import { useAuth } from "@/shared/auth/AuthContext";
import { useEffect, useState } from "react";

import {
    getBookmarkCategories,
    getBookmarkCategoryRestaurants,
} from "../api/bookmarkApi";

import type {
    BookmarkCategory,
    BookmarkMapRestaurant,
    BookmarkSortType,
} from "../model/bookmarkTypes";

export function useBookmarkMap(initialCategoryId?: number) {
  const { accessToken, refreshAccessToken } = useAuth();

  const [categories, setCategories] = useState<BookmarkCategory[]>([]);
  const [restaurants, setRestaurants] = useState<BookmarkMapRestaurant[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(initialCategoryId ?? null);

  const [sort, setSort] =
    useState<BookmarkSortType>("LATEST");

  // URL 변경 시 동기화
  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategoryId(initialCategoryId);
    }
  }, [initialCategoryId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) return;

    fetchRestaurants(selectedCategoryId);
  }, [selectedCategoryId, sort]);

  const fetchCategories = async () => {
    try {
      const categories =
        await getBookmarkCategories({
          accessToken,
          refreshAccessToken,
        });

      setCategories(categories);

      // URL 값이 없을 때만 첫 카테고리 선택
      if (
        !initialCategoryId &&
        categories.length > 0
      ) {
        setSelectedCategoryId(
          categories[0].bookmarkCategoryId
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
  console.log("selectedCategoryId changed:", selectedCategoryId);
}, [selectedCategoryId]);

  const fetchRestaurants = async (
    categoryId: number
  ) => {
    try {
      const response =
        await getBookmarkCategoryRestaurants({
          bookmarkCategoryId: categoryId,
          accessToken,
          refreshAccessToken,
        });

      console.log(
        "restaurants response",
        response
      );

      setRestaurants(
        response.restaurants ?? []
      );
    } catch (error) {
      console.error(
        "fetchRestaurants error",
        error
      );
    }
  };

  return {
    categories,
    restaurants,

    selectedCategoryId,

    sort,
    setSort,

    selectCategory: setSelectedCategoryId,
  };
}