export type BookmarkCategory = {
  bookmarkCategoryId: number;
  bookmarkCategoryName: string;
  sortOrder: number | null;
  isDefault: boolean;
  bookmarkCount: number;
};

export type BookmarkRestaurant = {
  bookmarkId: number;
  restaurantId: number;
  restaurantName: string;
  category: string;
  address: string;
  imageUrl: string | null;
  memo: string | null;
  createdAt: string;
  averageScore: number | null;
  reviewCount: number;
  foodScore: number | null;
  topTags: string[];
};

export type BookmarkCategoryStatus = {
  bookmarkCategoryId: number;
  bookmarkCategoryName: string;
  sortOrder: number | null;
  isDefault: boolean;
  bookmarkCount: number;
  saved: boolean;
  bookmarkId: number | null;
};

export type CreateBookmarkRequest = {
  restaurantId: number;
  bookmarkCategoryId: number;
  memo?: string | null;
};

export type CreateBookmarkResponse = {
  bookmarkId: number;
};

export type CreateBookmarkCategoryRequest = {
  bookmarkCategoryName: string;
};

export interface BookmarkMapRestaurant {
    bookmarkId: number;
    restaurantId: number;
    placeName: string;
    foodType: string;
    addressName: string;
    latitude: number;
    longitude: number;
    thumbnailImageUrl?: string;
    averageRating?: number;
    reviewCount?: number;
    ddogalScore?: number;
}

export interface BookmarkCategoryRestaurantsResponse {
    bookmarkCategoryId: number;
    bookmarkCategoryName: string;
    bookmarkCount: number;
    restaurants: BookmarkMapRestaurant[];
}

export type BookmarkSortType =
    | "LATEST"
    | "FOOD_SCORE"
    | "RATING"
    | "REVIEW_COUNT";