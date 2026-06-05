import { authFetch } from "@/shared/api/authFetch";
import type {
  BookmarkCategory,
  BookmarkCategoryStatus,
  BookmarkRestaurant,
  CreateBookmarkCategoryRequest,
  CreateBookmarkRequest,
  CreateBookmarkResponse,
} from "../model/bookmarkTypes";

type AuthApiParams = {
  accessToken: string | null;
  refreshAccessToken: () => Promise<string | null>;
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "북마크 API 요청에 실패했습니다.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export async function getBookmarkCategories({
  accessToken,
  refreshAccessToken,
}: AuthApiParams): Promise<BookmarkCategory[]> {
  const response = await authFetch({
    path: "/api/bookmark-categories",
    accessToken,
    refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  return parseResponse<BookmarkCategory[]>(response);
}

export async function getMyBookmarks({
  accessToken,
  refreshAccessToken,
}: AuthApiParams): Promise<BookmarkRestaurant[]> {
  const response = await authFetch({
    path: "/api/bookmarks",
    accessToken,
    refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  return parseResponse<BookmarkRestaurant[]>(response);
}

export async function getBookmarksByCategory({
  bookmarkCategoryId,
  accessToken,
  refreshAccessToken,
}: AuthApiParams & {
  bookmarkCategoryId: number;
}): Promise<BookmarkRestaurant[]> {
  const response = await authFetch({
    path: `/api/bookmark-categories/${bookmarkCategoryId}/bookmarks`,
    accessToken,
    refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  return parseResponse<BookmarkRestaurant[]>(response);
}

export async function createBookmarkCategory({
  accessToken,
  refreshAccessToken,
  body,
}: AuthApiParams & {
  body: CreateBookmarkCategoryRequest;
}): Promise<BookmarkCategory> {
  const response = await authFetch({
    path: "/api/bookmark-categories",
    accessToken,
    refreshAccessToken,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  });

  return parseResponse<BookmarkCategory>(response);
}

export async function deleteBookmarkCategory({
  bookmarkCategoryId,
  accessToken,
  refreshAccessToken,
}: AuthApiParams & {
  bookmarkCategoryId: number;
}): Promise<void> {
  const response = await authFetch({
    path: `/api/bookmark-categories/${bookmarkCategoryId}`,
    accessToken,
    refreshAccessToken,
    options: {
      method: "DELETE",
    },
  });

  return parseResponse<void>(response);
}

export async function getBookmarkCategoryStatuses({
  restaurantId,
  accessToken,
  refreshAccessToken,
}: AuthApiParams & {
  restaurantId: number;
}): Promise<BookmarkCategoryStatus[]> {
  const response = await authFetch({
    path: `/api/bookmarks/restaurants/${restaurantId}/bookmarkcategories`,
    accessToken,
    refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  return parseResponse<BookmarkCategoryStatus[]>(response);
}

export async function createBookmark({
  accessToken,
  refreshAccessToken,
  body,
}: AuthApiParams & {
  body: CreateBookmarkRequest;
}): Promise<CreateBookmarkResponse> {
  const response = await authFetch({
    path: "/api/bookmarks",
    accessToken,
    refreshAccessToken,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  });

  return parseResponse<CreateBookmarkResponse>(response);
}

export async function deleteBookmarkFromCategory({
  bookmarkCategoryId,
  restaurantId,
  accessToken,
  refreshAccessToken,
}: AuthApiParams & {
  bookmarkCategoryId: number;
  restaurantId: number;
}): Promise<void> {
  const response = await authFetch({
    path: `/api/bookmark-categories/${bookmarkCategoryId}/restaurants/${restaurantId}`,
    accessToken,
    refreshAccessToken,
    options: {
      method: "DELETE",
    },
  });

  return parseResponse<void>(response);
}