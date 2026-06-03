import axios from "@/shared/api/axios";

import type { RestaurantInfoResponse } from "../model/restaurantTypes";

/**
 * 음식점 정보 조회
 *
 * GET /api/restaurants/{restaurantId}/info
 */
export async function getRestaurantInfo(
    restaurantId: number,
) {
    const { data } =
        await axios.get<RestaurantInfoResponse>(
            `/api/restaurants/${restaurantId}/info`,
        );

    return data;
}