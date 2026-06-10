import { API_BASE_URL } from "@/shared/config/api";

type AuthFetchParams = {
  path: string;
  accessToken: string | null;
  refreshAccessToken: () => Promise<string | null>;
  options?: RequestInit;
};

// 💡 동시 다발적인 토큰 재발급 요청을 하나로 제어하기 위한 전역 Promise 변수
let refreshPromise: Promise<string | null> | null = null;

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

  // 💡 핵심 수정: 이미 토큰 재발급이 진행 중이라면 새로운 API를 호출하지 않고,
  // 기존에 생성된 refreshPromise를 공유하여 그 결과(새 토큰)를 함께 기다림
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null; // 재발급 프로세스가 끝나면(성공이든 실패든) 변수를 초기화
    });
  }

  // 모든 동시 요청이 동일한 재발급 결과를 할당받음
  const newAccessToken = await refreshPromise;

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