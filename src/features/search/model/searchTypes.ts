/**
 * 맛집 검색 결과 한 항목.
 * BE의 RestaurantSearchResponse.Item 과 매칭.
 */
export interface RestaurantSearchItem {
    restaurantId: number;
    placeName: string;
    foodType: string;
    addressName: string | null;
    roadAddressName: string | null;
    latitude: number | null;
    longitude: number | null;
    distance: number | null;
    averageScore: number | null;
    reviewCount: number;
    jjinScore: number | null;
    tags: string[];
}

/**
 * 맛집 검색 페이지 응답.
 * BE의 RestaurantSearchResponse 와 매칭.
 */
export interface RestaurantSearchResponse {
    page: number;
    size: number;
    totalCount: number;
    items: RestaurantSearchItem[];
}

/**
 * 정렬 옵션.
 * - distance:  거리 가까운 순 (기본)
 * - jjinScore: 맛집 지수 높은 순
 * - score:     별점 평균 높은 순
 */
export type SearchSort = "distance" | "jjinScore" | "score";

/**
 * 맛집 검색 요청 파라미터.
 * GET /api/restaurants/search
 */
export interface SearchRestaurantsParams {
    keyword?: string;
    region?: string;
    foodTypeId?: number;
    lat?: number;
    lng?: number;
    sort?: SearchSort;
    page?: number;
    size?: number;
}
