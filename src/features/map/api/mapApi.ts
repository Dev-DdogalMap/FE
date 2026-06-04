import axios from "@/shared/api/axios";

import type {
    GetRestaurantsOnMapResponse,
    GetRestaurantsOnMapParams
} from "../model/mapTypes";

/**
 * 현재 지도 범위 내 음식점 조회
 *
 * GET /api/restaurants/map
 */
export async function getRestaurantsOnMap(
    params: GetRestaurantsOnMapParams,
) {
    const { data } = await axios.get<GetRestaurantsOnMapResponse>(
        "/api/restaurants/map",
        {
            params,
        },
    );

    return data;
}