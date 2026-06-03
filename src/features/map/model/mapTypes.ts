/**
 * 현재 지도 영역
 * - sw: South West
 * - ne: North East
 */
export type MapBounds = {
    swLat: number;
    swLng: number;
    neLat: number;
    neLng: number;
};

/**
 * 지도에 표시할 음식점 마커 정보
 * 
 * GET /api/restaurants/map 응답의 restaurants 배열 요소
 */
export interface RestaurantMapItem {
    restaurantId: number;
    placeName: string;
    foodTypeId: number;
    foodType: string;
    addressName: string;
    latitude: number;
    longitude: number;
}

/**
 * 지도 음식점 조회 응답
 *
 * GET /api/restaurants/map
 */
export interface GetRestaurantsOnMapResponse {
    restaurants: RestaurantMapItem[];
}

/**
 * 지도 음식점 조회 요청 파라미터
 */
export interface GetRestaurantsOnMapParams extends MapBounds {
    limit?: number;
}