import markerImage from "@/assets/images/marker.png";
import KakaoBaseMap from "@/shared/map/KakaoBaseMap";
import { useEffect, useMemo, useRef } from "react";
import { MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import type { BookmarkMapRestaurant } from "../model/bookmarkTypes";

interface Props {
    restaurants: BookmarkMapRestaurant[];
}

// 클러스터 단계별 스타일 (사이즈 구간별로 다르게 적용)
const clusterStyles = [
    {
        // 2~9개: 가장 작고 연한 색
        width: "40px",
        height: "40px",
        background: "#FF8A3D",
        border: "3px solid #FFE7D6",
        borderRadius: "50%",
        color: "#fff",
        textAlign: "center" as const,
        fontWeight: "bold",
        fontSize: "13px",
        lineHeight: "34px",
        boxShadow: "0 2px 6px rgba(255, 107, 0, 0.3)",
    },
    {
        // 10~99개
        width: "48px",
        height: "48px",
        background: "#FF5722",
        border: "3px solid #FFD1B0",
        borderRadius: "50%",
        color: "#fff",
        textAlign: "center" as const,
        fontWeight: "bold",
        fontSize: "14px",
        lineHeight: "42px",
        boxShadow: "0 2px 8px rgba(255, 107, 0, 0.4)",
    },
    {
        // 100개 이상: 가장 진한 색 (메인 컬러)
        width: "56px",
        height: "56px",
        background: "#ff4400ef",
        border: "3px solid #FFB088",
        borderRadius: "50%",
        color: "#fff",
        textAlign: "center" as const,
        fontWeight: "bold",
        fontSize: "15px",
        lineHeight: "50px",
        boxShadow: "0 3px 10px rgba(255, 107, 0, 0.5)",
    },
];

export default function BookmarkMap({ restaurants }: Props) {
    const mapRef = useRef<kakao.maps.Map | null>(null);

    const initialCenter = useMemo(() => {
        return restaurants.length > 0
            ? { lat: restaurants[0].latitude, lng: restaurants[0].longitude }
            : { lat: 37.5665, lng: 126.9780 };
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            fitBoundsToRestaurants(mapRef.current, restaurants);
        }
    }, [restaurants]);

    const handleCreateMap = (map: kakao.maps.Map) => {
        mapRef.current = map;
        fitBoundsToRestaurants(map, restaurants);
    };

    function fitBoundsToRestaurants(
        map: kakao.maps.Map,
        restaurantsList: BookmarkMapRestaurant[],
    ) {
        if (restaurantsList.length === 0) return;

        const kakao = (window as any).kakao;
        if (!kakao) return;

        if (restaurantsList.length === 1) {
            const { latitude, longitude } = restaurantsList[0];
            map.setCenter(new kakao.maps.LatLng(latitude, longitude));
            map.setLevel(4);
            return;
        }

        const bounds = new kakao.maps.LatLngBounds();
        restaurantsList.forEach((r) => {
            bounds.extend(new kakao.maps.LatLng(r.latitude, r.longitude));
        });

        map.setBounds(bounds, 50, 50, 50, 50);
    }

    return (
        <div className="h-[380px] shrink-0">
            <KakaoBaseMap
                center={initialCenter}
                showCurrentLocation={false}
                shouldMoveToCurrentLocationOnLoad={false}
                onCreate={handleCreateMap}
            >
                <MarkerClusterer
                    averageCenter
                    minLevel={3}              // 줌 레벨 3 이상부터 클러스터링
                    gridSize={60}             // 클러스터 격자 크기
                    calculator={[10, 100]}    // 사이즈 구간 (styles와 매칭)
                    styles={clusterStyles}
                    texts={(size) => size >= 100 ? "99+" : String(size)}
                >
                    {restaurants.map((restaurant) => (
                        <MapMarker
                            key={restaurant.restaurantId}
                            position={{
                                lat: restaurant.latitude,
                                lng: restaurant.longitude,
                            }}
                            image={{
                                src: markerImage,
                                size: { width: 32, height: 32 },
                                options: { offset: { x: 16, y: 32 } },
                            }}
                        />
                    ))}
                </MarkerClusterer>
            </KakaoBaseMap>
        </div>
    );
}