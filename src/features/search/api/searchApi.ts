import axios from "@/shared/api/axios";

import type {
    SearchRestaurantsParams,
    RestaurantSearchResponse,
} from "../model/searchTypes";

/**
 * 맛집 검색
 *
 * GET /api/restaurants/search
 *
 * 비로그인 사용자도 호출 가능 (BE permitAll).
 * 로그인 사용자라면 accessToken 을 Authorization 헤더에 실어 보내야
 * BE 에서 사용자의 인증 동네(region) 를 자동으로 필터링에 적용함.
 */
export async function searchRestaurants(
    params: SearchRestaurantsParams,
    auth: { accessToken: string | null },
): Promise<RestaurantSearchResponse> {
    const { data } = await axios.get<RestaurantSearchResponse>(
        "/api/restaurants/search",
        {
            params,
            headers: auth.accessToken
                ? { Authorization: `Bearer ${auth.accessToken}` }
                : undefined,
        },
    );

    return data;
}
