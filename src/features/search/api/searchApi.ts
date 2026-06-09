import { authFetch } from "@/shared/api/authFetch";

import type {
    SearchRestaurantsParams,
    RestaurantSearchResponse,
} from "../model/searchTypes";

type AuthOptions = {
    accessToken: string | null;
    refreshAccessToken: () => Promise<string | null>;
};

/**
 * SearchRestaurantsParams → URL query string 변환.
 * undefined / null / 빈 문자열 필드는 제외.
 */
function buildQueryString(params: SearchRestaurantsParams): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        search.append(key, String(value));
    });
    const query = search.toString();
    return query ? `?${query}` : "";
}

/**
 * 맛집 검색
 *
 * GET /api/restaurants/search
 *
 * 비로그인 사용자도 호출 가능 (BE permitAll).
 * 로그인 사용자라면 Authorization 헤더에 토큰을 실어 보내야 BE에서
 * 사용자의 인증 동네(region)를 자동으로 필터링에 적용함.
 */
export async function searchRestaurants(
    params: SearchRestaurantsParams,
    auth: AuthOptions,
): Promise<RestaurantSearchResponse> {
    const query = buildQueryString(params);
    const response = await authFetch({
        path: `/api/restaurants/search${query}`,
        accessToken: auth.accessToken,
        refreshAccessToken: auth.refreshAccessToken,
        options: {
            method: "GET",
        },
    });

    if (!response.ok) {
        throw new Error(`검색 실패 (status=${response.status})`);
    }

    return response.json() as Promise<RestaurantSearchResponse>;
}
