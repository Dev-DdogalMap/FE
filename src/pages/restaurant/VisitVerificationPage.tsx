import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Circle, MapMarker } from "react-kakao-maps-sdk";
import { useAuth } from "@/shared/auth/AuthContext";

import KakaoBaseMap from "@/shared/map/KakaoBaseMap";
import {
  createVisitVerification,
  getRestaurantInfo,
} from "@/features/restaurant/api/restaurantApi";
import type { GetRestaurantInfoResponse } from "@/features/restaurant/model/restaurantTypes";
import VisitCompleteModal from "@/features/restaurant/ui/VisitCompleteModal";

const VERIFY_RADIUS_METER = 50;
//const USE_MOCK_INSIDE_RADIUS = true;

type VerifyStatus = "idle" | "success" | "fail" | "permission-error";

const getDistanceMeter = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const EARTH_RADIUS_METER = 6371000;
  const toRad = (value: number) => (value * Math.PI) / 180;


  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METER * c;
};

const VisitVerificationPage = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const { accessToken, refreshAccessToken } = useAuth();
  const [restaurant, setRestaurant] =
    useState<GetRestaurantInfoResponse | null>(null);

  const hasAutoCheckedRef = useRef(false);
  const locationRequestIdRef = useRef(0);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [distance, setDistance] = useState<number | null>(null);
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accuracyMeter, setAccuracyMeter] = useState<number | null>(null);

  const restaurantIdNumber = Number(restaurantId);
  const isInvalidRestaurantId =
    !restaurantId || Number.isNaN(restaurantIdNumber);

  const [verifiedAt, setVerifiedAt] = useState<string>("");

  useEffect(() => {
    if (isInvalidRestaurantId) return;

    const fetchRestaurant = async () => {
      try {
        setLoading(true);

        const data = await getRestaurantInfo(restaurantIdNumber);
        setRestaurant(data);
      } catch (error) {
        console.error("가게 위치 정보 조회 실패:", error);
        alert("가게 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [isInvalidRestaurantId, restaurantIdNumber]);

  const checkUserInsideRestaurantRadius = () => {
    if (!restaurant) return;

    if (!navigator.geolocation) {
      setStatus("permission-error");
      return;
    }

    const requestId = ++locationRequestIdRef.current;

    setChecking(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (requestId !== locationRequestIdRef.current) return;

        const restaurantLatitude = restaurant.latitude;
        const restaurantLongitude = restaurant.longitude;

        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;
        // const userLatitude = USE_MOCK_INSIDE_RADIUS
        //   ? restaurantLatitude + 0.0001
        //   : position.coords.latitude;

        // const userLongitude = USE_MOCK_INSIDE_RADIUS
        //   ? restaurantLongitude + 0.0001
        //   : position.coords.longitude;

        const calculatedDistance = getDistanceMeter(
          restaurantLatitude,
          restaurantLongitude,
          userLatitude,
          userLongitude,
        );

        setUserLocation({
          latitude: userLatitude,
          longitude: userLongitude,
        });

        setDistance(Math.round(calculatedDistance));
        setAccuracyMeter(position.coords.accuracy);

        setStatus(
          calculatedDistance <= VERIFY_RADIUS_METER ? "success" : "fail",
        );

        setChecking(false);
      },
      (error) => {
        if (requestId !== locationRequestIdRef.current) return;

        console.error("현재 위치 조회 실패:", error);
        console.error("error.code:", error.code);
        console.error("error.message:", error.message);

        if (error.code === error.PERMISSION_DENIED) {
          setStatus("permission-error");
        } else {
          // TIMEOUT / POSITION_UNAVAILABLE은 권한 화면이 아니라 반경 밖 화면으로 처리
          setStatus("fail");
        }

        setChecking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 5000,
      },
    );
  };

  useEffect(() => {
    if (!restaurant) return;
    if (hasAutoCheckedRef.current) return;

    hasAutoCheckedRef.current = true;
    checkUserInsideRestaurantRadius();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  const handleVisitVerificationSubmit = async () => {
    if (!restaurantId || !restaurant || !userLocation || distance === null) {
      alert("방문 인증 정보를 확인할 수 없습니다.");
      return;
    }

    if (status !== "success") {
      alert("가게 반경 50m 이내에서만 방문 인증할 수 있습니다.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await createVisitVerification(
          {
            restaurantId: Number(restaurantId),
            userLatitude: userLocation.latitude,
            userLongitude: userLocation.longitude,
            accuracyMeter: accuracyMeter ?? 0,
          },
          {
            accessToken,
            refreshAccessToken,
          },
      );

      setVerifiedAt(res.verifiedAt);
      setIsCompleteModalOpen(true);
    } catch (error) {
      console.error("방문 인증 저장 실패:", error);
      alert("방문 인증 저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isInvalidRestaurantId) {
    return <div className="p-5">잘못된 음식점 주소입니다.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="relative flex h-16 items-center justify-center px-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-5 text-2xl text-gray-900"
        >
          ‹
        </button>

        <h1 className="text-xl font-bold text-gray-900">방문 인증</h1>

        <button
          type="button"
          className="absolute right-5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg"
        >
          ?
        </button>
      </header>

      <main className="px-5 pb-8">
        <section className="relative h-[420px] overflow-hidden rounded-3xl bg-[#f6f1e8]">
          {restaurant ? (
            <KakaoBaseMap
              center={{
                lat: restaurant.latitude,
                lng: restaurant.longitude,
              }}
              level={2}
              shouldMoveToCurrentLocationOnLoad={false}
              showCurrentLocationMarker={false}
            >
              <Circle
                center={{
                  lat: restaurant.latitude,
                  lng: restaurant.longitude,
                }}
                radius={50}
                strokeWeight={2}
                strokeColor="#FF6B00"
                strokeOpacity={0.9}
                fillColor="#FF6B00"
                fillOpacity={0.15}
              />

              <MapMarker
                position={{
                  lat: restaurant.latitude,
                  lng: restaurant.longitude,
                }}
              />

              {userLocation && (
                <MapMarker
                  position={{
                    lat: userLocation.latitude,
                    lng: userLocation.longitude,
                  }}
                />
              )}
            </KakaoBaseMap>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              지도 불러오는 중...
            </div>
          )}

          {restaurant && (
            <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-full bg-white px-6 py-3 shadow-md">
              <span className="mr-2 text-[#ff6b00]">🍴</span>
              <span className="font-bold">{restaurant.placeName}</span>
            </div>
          )}

          <div className="pointer-events-none absolute left-1/2 top-[110px] z-20 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-[#ff6b00] shadow">
            가게 기준 반경 50m
          </div>
        </section>

        {restaurant && (
          <section className="mt-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-4xl">
                🏠
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">
                  {restaurant.placeName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {restaurant.roadAddressName}
                </p>

                <button
                  type="button"
                  onClick={() => navigate(`/restaurants/${restaurantId}`)}
                  className="mt-3 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold"
                >
                  가게 정보 보기 ›
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="mt-4 rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          {loading && (
            <>
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-100" />
              <h2 className="mt-4 text-xl font-bold">불러오는 중이에요</h2>
              <p className="mt-2 text-sm text-gray-500">
                가게 위치 정보를 확인하고 있어요.
              </p>
            </>
          )}

          {!loading && status === "idle" && checking && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#ff6b00] border-t-transparent" />
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                현재 위치 확인 중이에요
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                선택한 가게 기준 반경 50m 이내인지 확인하고 있어요.
              </p>
            </>
          )}

          {!loading && status === "success" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-4xl text-[#ff6b00]">
                ✓
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                현재 위치에서 인증 가능해요!
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                가게 반경 50m 이내입니다.
              </p>

              {distance !== null && (
                <p className="mt-2 text-sm font-bold text-[#ff6b00]">
                  현재 거리 {distance}m
                </p>
              )}

              <button
                type="button"
                onClick={handleVisitVerificationSubmit}
                disabled={submitting}
                className="mt-6 h-12 w-full rounded-2xl bg-[#ff6b00] font-bold text-white disabled:bg-gray-300"
              >
                {submitting ? "인증 중..." : "방문 인증하기"}
              </button>
            </>
          )}

          {!loading && status === "fail" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-4xl text-red-500">
                ×
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                가게 반경 밖입니다
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                선택한 가게 위치 기준으로
                <br />
                반경 50m 이내에서만 인증할 수 있어요.
              </p>

              {distance !== null && (
                <p className="mt-2 text-sm font-bold text-[#ff6b00]">
                  현재 거리 {distance}m
                </p>
              )}

              <button
                type="button"
                onClick={checkUserInsideRestaurantRadius}
                disabled={checking}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#ff6b00] font-bold text-[#ff6b00] disabled:border-gray-300 disabled:text-gray-400"
              >
                {checking ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ff6b00] border-t-transparent" />
                    확인 중...
                  </>
                ) : (
                  "가게 근처에서 다시 시도"
                )}
              </button>
            </>
          )}

          {!loading && status === "permission-error" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-4xl">
                !
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                위치 권한이 필요해요
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                브라우저에서 위치 권한을 허용해주세요.
              </p>

              <button
                type="button"
                onClick={checkUserInsideRestaurantRadius}
                disabled={checking}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6b00] font-bold text-white disabled:bg-gray-300"
              >
                {checking ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    확인 중...
                  </>
                ) : (
                  "다시 시도"
                )}
              </button>
            </>
          )}
        </section>
      </main>

      {isCompleteModalOpen && restaurant && (
        <VisitCompleteModal
          restaurantName={restaurant.placeName}
          onClose={() => setIsCompleteModalOpen(false)}
          onLaterClick={() => {
            setIsCompleteModalOpen(false);
            navigate(`/restaurants/${restaurantId}`);
          }}
          onReviewClick={() => {
            setIsCompleteModalOpen(false);

            navigate("/review", {
              state: {
                restaurantId: restaurantIdNumber,
                placeName: restaurant.placeName,
                roadAddressName: restaurant.roadAddressName,
                verifiedAt: verifiedAt,
                accessToken: accessToken
              }
            });
          }}
        />
      )}
    </div>
  );
};

export default VisitVerificationPage;