import { authFetch } from "@/shared/api/authFetch";

import type {
  ActivityDetailResponse,
  ActivitySummaryResponse,
  ChatPreferenceResponse,
  ChatPreferenceUpdateRequest,
  MyNeighborhoodResponse,
  MyNeighborhoodVerificationRequest,
  MyNeighborhoodVerificationResponse,
  MyStatsResponse,
  RepresentativeBadgeResponse,
  UpdateRepresentativeBadgeRequest,
  MyProfileResponse
} from "../model/myPageTypes";

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

export async function getMyActivity(
  {
    accessToken,
    refreshAccessToken,
  }: AuthApiParams,
): Promise<ActivitySummaryResponse> {
  const response = await authFetch({
    path: "/api/users/me/activity",
    accessToken,
    refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  return parseResponse<ActivitySummaryResponse>(response);
}

export async function getMyActivityDetail(
  {
    accessToken,
    refreshAccessToken,
  }: AuthApiParams,
): Promise<ActivityDetailResponse> {
  const response = await authFetch({
    path: "/api/users/me/activity/detail",
    accessToken,
    refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  return parseResponse<ActivityDetailResponse>(response);
}

export async function updateRepresentativeBadge(
  request: UpdateRepresentativeBadgeRequest,
  {
    accessToken,
    refreshAccessToken,
  }: AuthApiParams,
): Promise<RepresentativeBadgeResponse> {
  const response = await authFetch({
    path: "/api/users/me/representative-badge",
    accessToken,
    refreshAccessToken,
    options: {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
  });

  return parseResponse<RepresentativeBadgeResponse>(response);
}

export async function getChatPreference(
  {
    accessToken,
    refreshAccessToken,
  }: AuthApiParams,
): Promise<ChatPreferenceResponse> {
  const response = await authFetch({
    path: "/api/users/me/chat-preference",
    accessToken,
    refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  return parseResponse<ChatPreferenceResponse>(response);
}

export async function updateChatPreference(
  request: ChatPreferenceUpdateRequest,
  {
    accessToken,
    refreshAccessToken,
  }: AuthApiParams,
): Promise<ChatPreferenceResponse> {
  const response = await authFetch({
    path: "/api/users/me/chat-preference",
    accessToken,
    refreshAccessToken,
    options: {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
  });

  return parseResponse<ChatPreferenceResponse>(response);
}




export async function getMyStats(
  {
    accessToken,
    refreshAccessToken,
  }: AuthApiParams,
): Promise<MyStatsResponse> {
  const response = await authFetch({
    path: "/api/users/me/stats",
    accessToken,
    refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  return parseResponse<MyStatsResponse>(response);
}

export async function getMyProfile(
  {
    accessToken,
    refreshAccessToken,
  }: AuthApiParams,
): Promise<MyProfileResponse> {
  const response = await authFetch({
    path: "/api/users/me/profile",
    accessToken,
    refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  return parseResponse<MyProfileResponse>(response);
}