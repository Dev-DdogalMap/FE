import { API_BASE_URL } from "@/shared/config/api";

type AuthFetchParams = {
  path: string;
  accessToken: string | null;
  refreshAccessToken: () => Promise<string | null>;
  options?: RequestInit;
};

export async function authFetch({
  path,
  accessToken,
  refreshAccessToken,
  options = {},
}: AuthFetchParams) {
  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status !== 401 && response.status !== 403) {
    return response;
  }

  console.log("accessToken 만료 감지 → refreshToken으로 재발급 시도");

  const newAccessToken = await refreshAccessToken();

  if (!newAccessToken) {
    return response;
  }

  const retryHeaders = new Headers(options.headers);
  retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

  response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: retryHeaders,
  });

  return response;
}