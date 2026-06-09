import markerImage from "@/assets/images/marker.png";
import KakaoBaseMap from "@/shared/map/KakaoBaseMap";
import { useEffect, useMemo, useRef } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import type { BookmarkMapRestaurant } from "../model/bookmarkTypes";

interface Props {
    restaurants: BookmarkMapRestaurant[];
}

const clusterStyles = [
    {
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

    const handleResetView = () => {
        if (mapRef.current) {
            fitBoundsToRestaurants(mapRef.current, restaurants);
        }
    };

    return (
        <div className="relative h-[380px] shrink-0">
            <KakaoBaseMap
                center={initialCenter}
                showCurrentLocation={false}
                shouldMoveToCurrentLocationOnLoad={false}
                onCreate={handleCreateMap}
            >
                <MarkerClusterer
                    averageCenter
                    minLevel={3}
                    gridSize={60}
                    calculator={[10, 100]}
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
                            title={restaurant.placeName} 
                            onClick={() => {
                                const map = mapRef.current;
                                if (!map) return;

                                const targetLatLng = new kakao.maps.LatLng(
                                    restaurant.latitude,
                                    restaurant.longitude,
                                );

                                map.setCenter(targetLatLng);

                                map.setLevel(2, {
                                    anchor: targetLatLng,
                                    animate: {
                                        duration: 300,
                                    },
                                });
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

            <button
                onClick={handleResetView}
                className="absolute bottom-6 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-md cursor-pointer bg-white shadow-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]"
                aria-label="지도 위치 초기화"
                title="처음 위치로"
            >
                <FaSyncAlt className="text-gray-600 text-[18px]" />
            </button>
        </div>
    );
}