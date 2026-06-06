import { authFetch } from "@/shared/api/authFetch";

import type { MyNeighborhoodResponse, MyNeighborhoodVerificationRequest, MyNeighborhoodVerificationResponse } from "../model/myPageTypes";

type AuthApiParams = {
  accessToken: string | null;
  refreshAccessToken: () => Promise<string | null>;
};

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  if (!response.ok) {
    const message = await response.text().catch(() => "");

    throw new Error(
      message || "요청에 실패했습니다.",
    );
  }

  return response.json();
}

export async function getMyRegion(
  {
    accessToken,
    refreshAccessToken,
  }: AuthApiParams,
): Promise<MyNeighborhoodResponse> {
  const response = await authFetch({
    path: "/api/users/me/region-verification",
    accessToken,
    refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  return parseResponse<MyNeighborhoodResponse>(
    response,
  );
}

export async function verifyRegion(
  request: MyNeighborhoodVerificationRequest,
  {
    accessToken,
    refreshAccessToken,
  }: AuthApiParams,
): Promise<MyNeighborhoodVerificationResponse> {
  const response = await authFetch({
    path: "/api/users/me/region-verification",
    accessToken,
    refreshAccessToken,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
  });

  return parseResponse<MyNeighborhoodVerificationResponse>(
    response,
  );
}