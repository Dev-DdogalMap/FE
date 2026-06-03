
import { useWatchLocation } from "@/shared/location/useWatchLocation";
import { MapPinned, Navigation } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Circle,
  Map,
  MapMarker,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import ErrorView from "../ui/ErrorView";
import LoadingView from "../ui/LoadingView";

type Props = {
  center: {
    lat: number;
    lng: number;
  };
  children?: ReactNode; // 지도 안에 표시할 요소
  onCreate?: (map: kakao.maps.Map) => void; // 지도 객체 처음 생성됐을 때 실행
  onIdle?: (map: kakao.maps.Map) => void; // 지도 이동이나 확대/축소가 끝났을 때 실행
  bottomSheetHeight?: number; 
};

export default function KakaoBaseMap({ 
  center,
  children,
  onCreate,
  onIdle, 
  bottomSheetHeight = 0,
}: Props) {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_APP_KEY,
    libraries: ["services", "clusterer"],
  });

  const {
    location: currentLocation,
    loading: locationLoading,
    errorMessage,
  } = useWatchLocation();

  const [mapCenter, setMapCenter] = useState(center);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  const hasInitialCentered = useRef(false);
  const currentLocationButtonBottom =
    bottomSheetHeight > 0? bottomSheetHeight + 30: 20;

  useEffect(() => {
    if (!currentLocation) return;
    if (hasInitialCentered.current) return;

    const nextCenter = {
      lat: currentLocation.lat,
      lng: currentLocation.lng,
    };

    setMapCenter(nextCenter);
    hasInitialCentered.current = true;
  }, [currentLocation]);

  const handleCreateMap = (createdMap: kakao.maps.Map) => {
    setMap(createdMap);
    onCreate?.(createdMap);
  };

  const moveToCurrentLocation = () => {
    if (!currentLocation) return;

    const nextCenter = {
      lat: currentLocation.lat,
      lng: currentLocation.lng,
    };

    setMapCenter(nextCenter);

    if (map && (window as any).kakao) {
      const kakao = (window as any).kakao;

      map.panTo(
        new kakao.maps.LatLng(
          currentLocation.lat,
          currentLocation.lng
        )
      );
    }
  };

  if (loading) {
    return (
      <LoadingView
        icon={
          <Navigation
            size={32}
            className="animate-pulse text-[#FF6B00]"
          />
        }
        title="현재 위치를 확인하고 있어요"
        description={`주변의 로컬 맛집 정보를\n불러오고 있습니다`}
      />
    );
  }

  
  if (error) {
    console.error("Kakao Map Load Error:", error);

    return (
      <ErrorView
        icon={
          <MapPinned
            size={32}
            className="text-[#FF6B00]"
          />
        }
        title="지도를 불러오지 못했어요"
        description={"네트워크 상태를 확인하거나\n잠시 후 다시 시도해주세요"}
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      <Map
        center={mapCenter}
        level={4}
        onCreate={handleCreateMap}
        onIdle={onIdle}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {children}

        {currentLocation && (
          <>
            <MapMarker
              position={{
                lat: currentLocation.lat,
                lng: currentLocation.lng,
              }}
            />

            <Circle
              center={{
                lat: currentLocation.lat,
                lng: currentLocation.lng,
              }}
              radius={currentLocation.accuracy}
              strokeWeight={1}
              strokeColor="#FF6B00"
              strokeOpacity={0.6}
              fillColor="#FF6B00"
              fillOpacity={0.15}
            />
          </>
        )}
      </Map>

      {locationLoading && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow">
          현재 위치 확인 중...
        </div>
      )}

      {errorMessage && (
        <div className="absolute left-4 right-4 top-4 z-10 rounded-xl bg-white px-4 py-3 text-xs font-semibold text-red-500 shadow">
          {errorMessage}
        </div>
      )}

      {currentLocation && (
        <button
          type="button"
          onClick={moveToCurrentLocation}
          style={{ bottom: currentLocationButtonBottom }}
          className="absolute right-4 z-10 rounded-full bg-white px-4 py-3 text-sm font-bold text-[#FF6B00] shadow active:scale-[0.98]"
        >
          내 위치
        </button>
      )}
    </div>
  );
}