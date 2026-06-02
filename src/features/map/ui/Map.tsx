import { MarkerClusterer } from "react-kakao-maps-sdk";
import { useEffect, useRef } from "react";

import KakaoBaseMap from "@/shared/map/KakaoBaseMap";
import RestaurantMarker from "./RestaurantMarker";

import type { MapBounds, RestaurantMapItem } from "../model/mapTypes";
import { 
    CLUSTER_CALCULATOR, 
    CLUSTER_STYLES, 
} from "../constants/clusterStyles";

type Props = {
    center: {
        lat: number;
        lng: number;
    };
    restaurants: RestaurantMapItem[];
    onLoadRestaurants: (bounds: MapBounds) => void;
    onSelectRestaurant: (restaurantId: number) => void;
    bottomSheetHeight?: number;
};

export default function Map({
    center,
    restaurants,
    onLoadRestaurants,
    onSelectRestaurant,
    bottomSheetHeight=0,
    }: Props) {

    const timerRef = useRef<number | null>(null);
    const lastBoundsRef = useRef<string>("");
    
    useEffect(() => {
        return () => {
            if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleLoadRestaurants = (map: kakao.maps.Map) => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
        }

        timerRef.current = window.setTimeout(() => {
            const bounds = map.getBounds();
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();

            const nextBounds = {
                swLat: Number(sw.getLat().toFixed(5)),
                swLng: Number(sw.getLng().toFixed(5)),
                neLat: Number(ne.getLat().toFixed(5)),
                neLng: Number(ne.getLng().toFixed(5)),
            };

            const boundsKey = JSON.stringify(nextBounds);

            if (lastBoundsRef.current === boundsKey) {
                return;
            }

            lastBoundsRef.current = boundsKey;
            onLoadRestaurants(nextBounds);
        }, 300);
    };

    return (
        <KakaoBaseMap
            center={center}
            onCreate={handleLoadRestaurants}
            onIdle={handleLoadRestaurants}
            bottomSheetHeight={bottomSheetHeight}
        >
            <MarkerClusterer 
                averageCenter 
                minLevel={3}
                calculator={CLUSTER_CALCULATOR}
                styles={CLUSTER_STYLES}
                minClusterSize={5}
            >
                {restaurants.map((restaurant) => (
                    <RestaurantMarker
                        key={restaurant.restaurantId}
                        restaurant={restaurant}
                        onClick={() => onSelectRestaurant(restaurant.restaurantId)}
                    />
                ))}
            </MarkerClusterer>
        </KakaoBaseMap>
    );
}