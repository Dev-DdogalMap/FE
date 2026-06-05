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

/**
 * 음식점 정보 상세 조회 응답
 * 
 * GET /api/restaurants/{restaurantId}/info
 */
export interface RestaurantInfoResponse {
    restaurantId: number;
    placeName: string;
    roadAddressName: string;
    phone: string | null;
    placeUrl: string | null;
    latitude: number;
    longitude: number;

    foodType: string;
    imageUrl: string | null;
    topTags: string[];
    foodScore: number | null;

    averageScore: number | null;
    reviewCount: number;
    distance: number | null;

    residentRecommendRate: number | null;  // 주민 추천 비율 (0~100)
    revisitRate: number | null;            // 재방문율 (0~100, is_revisit=TRUE 비율)
    visitVerifyCount: number | null;       // 방문 인증 수
    bookmarkCount: number | null;          // 즐겨찾기 수
}

/**
 * 음식 카테고리 응답
 */
export interface FoodTypeOption {
    foodTypeId: number;
    type: string;
}