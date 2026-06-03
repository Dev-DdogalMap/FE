import axios from "@/shared/api/axios";

import type {
    SearchRestaurantsParams,
    RestaurantSearchResponse,
} from "../model/searchTypes";

/**
 * 맛집 검색
 *
 * GET /api/restaurants/search
 */
export async function searchRestaurants(params: SearchRestaurantsParams) {
    const { data } = await axios.get<RestaurantSearchResponse>(
        "/api/restaurants/search",
        {
            params,
        },
    );

    return data;
}
