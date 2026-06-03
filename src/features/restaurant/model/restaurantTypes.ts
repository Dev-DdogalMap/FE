/**
 * 음식점 미리보기 정보
 *
 * 지도 마커 클릭 시 바텀시트에 표시
 * 다른 화면에서도 재사용 가능
 */
export interface RestaurantPreview {
    restaurantId: number;
    placeName: string;
    foodType: string;
    addressName: string;
    imageUrl: string | null;
    distance: number | null;
    averageScore: number | null;
    reviewCount: number;
    topTags: string[];
    foodScore: number | null;
}

/**
 * 음식점 미리보기 조회 응답
 *
 * GET /api/restaurants/{restaurantId}/preview
 */
export type GetRestaurantPreviewResponse = RestaurantPreview;

/**
 * 음식점 미리보기 조회 요청 파라미터
 */
export interface GetRestaurantPreviewParams {
    restaurantId: number;
    lat?: number;
    lng?: number;
}

// 위도, 경도로 방문인증 기능 붙이기
export interface RestaurantInfo {
  restaurantId: number;
  placeName: string;
  roadAddressName: string;
  phone?: string;
  placeUrl?: string;
  latitude: number;
  longitude: number;
}
export type GetRestaurantInfoResponse = RestaurantInfo;


export interface CreateVisitVerificationRequest {
  restaurantId: number;
  userLatitude: number;
  userLongitude: number;
  accuracyMeter: number;
}

export interface CreateVisitVerificationResponse {
  visitVerificationId: number;
  restaurantId: number;
  verifiedAt: string;
}