import axios from "@/shared/api/axios";

import type {
  GetRestaurantPreviewParams,
  GetRestaurantPreviewResponse,
  GetRestaurantInfoResponse,
    FoodTypeOption,
    CreateVisitVerificationRequest,
  CreateVisitVerificationResponse,
} from "../model/restaurantTypes";

/**
 * 음식점 미리보기 조회
 *
 * GET /api/restaurants/{restaurantId}/preview
 */
export async function getRestaurantPreview({
  restaurantId,
  lat,
  lng,
}: GetRestaurantPreviewParams) {
  const { data } = await axios.get<GetRestaurantPreviewResponse>(
    `/api/restaurants/${restaurantId}/preview`,
    {
      params: {
        lat,
        lng,
      },
    },
  );

  return data;
}

/**
 * 음식점 위치/매장 정보 조회
 *
 * GET /api/restaurants/{restaurantId}/info
 */
export async function getRestaurantInfo(restaurantId: number) {
  const { data } = await axios.get<GetRestaurantInfoResponse>(
    `/api/restaurants/${restaurantId}/info`,
  );

  return data;
}

export async function createVisitVerification(
  request: CreateVisitVerificationRequest,
) {
  const { data } = await axios.post<CreateVisitVerificationResponse>(
    "/api/visit/visit-verification",
    request,
  );

  return data;
    return data;
}

/**
 * 음식 카테고리 목록 조회
 *
 * GET /api/food-types
 */
export async function getFoodTypes() {
    const { data } = await axios.get<FoodTypeOption[]>(
        "/api/food-types",
    );

    return data;
}