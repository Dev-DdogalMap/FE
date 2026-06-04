import axios from "@/shared/api/axios";
import { authFetch } from "@/shared/api/authFetch";

import type {
  FoodTypeOption,
  RestaurantInfoResponse,
  GetRestaurantPreviewParams,
  GetRestaurantPreviewResponse,
} from "../model/restaurantTypes";

type AuthRequestOptions = {
  accessToken: string | null;
  refreshAccessToken: () => Promise<string | null>;
};

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
 * 음식점 정보 상세 조회 
 *
 * GET /api/restaurants/{restaurantId}/info
 */
export async function getRestaurantInfo({
    restaurantId,
    lat,
    lng,
}: GetRestaurantPreviewParams) {
    const { data } = await axios.get<RestaurantInfoResponse>(
        `/api/restaurants/${restaurantId}/info`,
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
 * 방문 인증 저장
 *
 * POST /api/visit/visit-verification
 */
export async function createVisitVerification(
  body: {
    restaurantId: number;
    userLatitude: number;
    userLongitude: number;
    accuracyMeter: number;
  },
  auth: AuthRequestOptions,
) {
  const response = await authFetch({
    path: "/api/visit/visit-verification",
    accessToken: auth.accessToken,
    refreshAccessToken: auth.refreshAccessToken,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  });

  if (!response.ok) {
    throw new Error("방문 인증 저장 실패");
  }

  return response.json();
}

/**
 * 음식 카테고리 목록 조회
 *
 * GET /api/food-types
 */
export async function getFoodTypes() {
  const { data } = await axios.get<unknown>("/api/food-types");

  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(
    (item): item is FoodTypeOption =>
      typeof item === "object" &&
      item !== null &&
      "foodTypeId" in item &&
      "type" in item,
  );
}
