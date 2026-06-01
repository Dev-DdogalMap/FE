import { MarkerClusterer } from "react-kakao-maps-sdk";
import { useRef } from "react";

import KakaoBaseMap from "@/shared/map/KakaoBaseMap";
import RestaurantMarker from "./RestaurantMarker";

import type { MapBounds, RestaurantMapItem } from "../model/mapTypes";
import { CLUSTER_CALCULATOR, CLUSTER_STYLES, } from "../constants/clusterStyles";

type Props = {
    center: {
        lat: number;
        lng: number;
    };
    restaurants: RestaurantMapItem[];
    onLoadRestaurants: (bounds: MapBounds) => void;
    onSelectRestaurant: (restaurantId: number) => void;
};

export default function Map({
    center,
    restaurants,
    onLoadRestaurants,
    onSelectRestaurant,
    }: Props) {

    const timerRef = useRef<number | null>(null);

    const handleLoadRestaurants = (map: kakao.maps.Map) => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
        }

    timerRef.current = window.setTimeout(() => {
        const bounds = map.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        onLoadRestaurants({
            swLat: sw.getLat(),
            swLng: sw.getLng(),
            neLat: ne.getLat(),
            neLng: ne.getLng(),
        });
        }, 300);
    };

    return (
        <KakaoBaseMap
            center={center}
            onCreate={handleLoadRestaurants}
            onIdle={handleLoadRestaurants}
        >
            <MarkerClusterer 
                averageCenter 
                minLevel={2}
                calculator={CLUSTER_CALCULATOR}
                styles={CLUSTER_STYLES}
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