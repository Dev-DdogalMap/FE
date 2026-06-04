import { useState } from "react";

import { getRestaurantsOnMap } from "../api/mapApi";
import type { MapBounds, RestaurantMapItem } from "../model/mapTypes";
import { getRestaurantPreview } from "@/features/restaurant/api/restaurantApi";
import type { RestaurantPreview } from "@/features/restaurant/model/restaurantTypes";
import { useWatchLocation } from "@/shared/location/useWatchLocation";

/**
 * 지도에서 사용하는 상태와 이벤트 관리
 */
export function useMap() {
    const [restaurants, setRestaurants] = useState<RestaurantMapItem[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantPreview | null>(null);


    /**
    * 사용자 현재 위치
    */
    const { location: currentLocation } = useWatchLocation();

    /**
     * 지도 bounds 기준으로 음식점 마커 조회
     */
    const fetchRestaurants = async (bounds: MapBounds) => {
        const response = await getRestaurantsOnMap({
            ...bounds
        });
        
        setRestaurants(response.restaurants);
    }

    /**
     * 마커 클릭시 음식점 미리보기 조회
     */
    const selectRestaurant = async(restaurantId: number) => {
        const response = await getRestaurantPreview({
            restaurantId,
            lat: currentLocation?.lat,
            lng: currentLocation?.lng
        });

        setSelectedRestaurant(response);
    }

    /**
     * 미리보기 닫기
     */
    const closePreview = () => {
        setSelectedRestaurant(null);
    }

    return {
        restaurants,
        selectedRestaurant,
        fetchRestaurants,
        selectRestaurant,
        closePreview
    }
}