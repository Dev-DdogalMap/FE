//v5 - 역지오코딩, 인증하기 버튼 클릭 시 모달 표시, 카카오 SDK 로드 대기
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/shared/auth/AuthContext";
import { useWatchLocation } from "@/shared/location/useWatchLocation";

import { verifyRegion } from "@/features/myPage/api/myPageApi";

import KakaoBaseMap from "@/shared/map/KakaoBaseMap";
import { MapMarker } from "react-kakao-maps-sdk";


const MAX_ACCURACY = 50;

const MyNeighborhoodVerificationPage = () => {
    const navigate = useNavigate();
    const { isLoading, accessToken, refreshAccessToken } = useAuth();

    const { location, loading: locationLoading, errorMessage } = useWatchLocation();

    const [regionName, setRegionName] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isKakaoReady, setIsKakaoReady] = useState(false);

    const KAKAO_SDK_POLL_INTERVAL = 100; // ms
    const KAKAO_SDK_LOAD_TIMEOUT = 10000; // ms

    // errorMessage 발생 시 토스트로 표시
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [errorMessage]);

    // 카카오맵 SDK 로드 대기
    useEffect(() => {
        // 이미 로드되어 있으면 바로
        if ((window as any).kakao?.maps?.services) {
            setIsKakaoReady(true);
            return;
        }

        // 100ms마다 체크
        const interval = setInterval(() => {
            if (window.kakao?.maps?.services) {
                setIsKakaoReady(true);
                clearInterval(interval);
                clearTimeout(timeout);
            }
        }, KAKAO_SDK_POLL_INTERVAL);

        // 10초 후 타임아웃
        const timeout = setTimeout(() => {
            clearInterval(interval);
            toast.error("지도 서비스를 불러오지 못했습니다. 새로고침 해주세요.");
        }, KAKAO_SDK_LOAD_TIMEOUT);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    // 위치가 잡히면 자동으로 행정동 이름 가져오기 (모달은 띄우지 않음)
    useEffect(() => {
        if (!location || !isKakaoReady) return;

        const kakao = (window as any).kakao;
        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.coord2RegionCode(
            location.lng,
            location.lat,
            (result: any, status: any) => {
                if (status !== kakao.maps.services.Status.OK) return;

                const region = result.find((r: any) => r.region_type === "H");

                if (region) {
                    setRegionName(region.region_3depth_name);
                }
            }
        );
    }, [location, isKakaoReady]);

    // 인증하기 버튼 클릭 → 유효성 검사 후 모달 표시
    const handleOpenModal = () => {
        if (isLoading) {
            toast.info("로그인 상태 확인 중입니다.");
            return;
        }

        if (!location) {
            toast.error("현재 위치를 확인할 수 없습니다.");
            return;
        }

        if (location.accuracy > MAX_ACCURACY) {
            toast.error("GPS 정확도가 낮습니다. 야외에서 다시 시도해주세요.");
            return;
        }

        if (!regionName) {
            toast.error("위치 정보를 확인 중입니다. 잠시만 기다려주세요.");
            return;
        }

        setShowConfirmModal(true);
    };

    // 취소 핸들러
    const handleCancelModal = () => {
        setShowConfirmModal(false);
        toast.info("동네 인증이 취소되었습니다.");
    };

    // 모달에서 인증하기 클릭
    const handleConfirmRegion = async () => {
        if (!location) return;

        try {
            setSubmitting(true);

            const result = await verifyRegion(
                {
                    latitude: location.lat,
                    longitude: location.lng,
                    accuracy: location.accuracy,
                },
                {
                    accessToken,
                    refreshAccessToken,
                }
            );

            setShowConfirmModal(false);

            toast.success(`${result.eupmyeondongName} 인증 완료`);

            navigate("/mypage");
        } catch (error) {
            console.error(error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "동네 인증에 실패했습니다."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto flex max-w-screen-sm flex-col gap-6 p-4">
            <div>
                <h1 className="text-xl font-bold">내 동네 인증</h1>

                <p className="mt-2 text-sm text-gray-500">
                    현재 위치를 기반으로 동네 인증을 진행합니다.
                </p>
            </div>

            {/* 지도 영역 */}
            <div className="relative h-[360px] overflow-hidden rounded-3xl">
                {location && isKakaoReady ? (
                    <KakaoBaseMap
                        center={{ lat: location.lat, lng: location.lng }}
                        level={4}
                        shouldMoveToCurrentLocationOnLoad={true}
                        showCurrentLocationMarker={true}
                    >
                        {/* 내 위치 */}
                        <MapMarker
                            position={{
                                lat: location.lat,
                                lng: location.lng,
                            }}
                        />
                    </KakaoBaseMap>
                ) : (
                    <div className="flex h-full items-center justify-center bg-gray-100">
                        <p className="text-sm text-gray-500">
                            {!isKakaoReady
                                ? "지도 서비스를 불러오는 중..."
                                : locationLoading
                                    ? "위치 정보를 불러오는 중..."
                                    : "위치 정보를 사용할 수 없습니다."}
                        </p>
                    </div>
                )}

                {/* 지도 위 로딩 오버레이 */}
                {locationLoading && location && isKakaoReady && (
                    <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 shadow-md">
                        <div className="flex items-center gap-2">
                            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <p className="text-xs text-white">현재 위치 확인 중...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 인증하기 버튼 */}
            <button
                type="button" disabled={isLoading || locationLoading || !location || !isKakaoReady || submitting}
                onClick={handleOpenModal}
                className="h-12 cursor-pointer rounded-xl bg-orange-500 font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
            >
                {submitting ? "인증 중..." : "동네 인증하기"}
            </button>

            {/* 확인 모달 */}
            {showConfirmModal && regionName && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-30">
                    <div className="w-[320px] rounded-2xl bg-white p-5 shadow-lg">
                        <h2 className="text-lg font-bold">
                            동네 인증 확인
                        </h2>

                        <p className="mt-3 text-sm text-gray-600">
                            현재 위치는
                        </p>

                        <p className="mt-1 text-xl font-bold text-orange-500">
                            {regionName}
                        </p>

                        <p className="mt-3 text-sm text-gray-500">
                            이 동네로 인증하시겠습니까?
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            ※ 지도 서비스와 행정구역 데이터의 기준 차이로 인해<br />
                            실제 동네 이름과 다소 다르게 표시될 수 있습니다.
                        </p>

                        <div className="mt-5 flex gap-2">
                            <button
                                className="flex-1 cursor-pointer rounded-xl bg-gray-200 py-2 text-sm transition-colors hover:bg-gray-300 disabled:opacity-50"
                                onClick={handleCancelModal}
                                disabled={submitting}
                            >
                                취소
                            </button>

                            <button
                                className="flex-1 cursor-pointer rounded-xl bg-orange-500 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
                                onClick={handleConfirmRegion}
                                disabled={submitting}
                            >
                                {submitting ? "인증 중..." : "인증하기"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyNeighborhoodVerificationPage;
