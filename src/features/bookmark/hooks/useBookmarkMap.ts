import { useAuth } from "@/shared/auth/AuthContext";
import { useEffect, useState } from "react";

import {
  getBookmarkCategories,
  getBookmarkCategoryRestaurants,
  getBookmarksByCategory,
} from "../api/bookmarkApi";

import type {
  BookmarkCategory,
  BookmarkMapRestaurant,
  BookmarkRestaurant,
  BookmarkSortType,
} from "../model/bookmarkTypes";

export function useBookmarkMap(initialCategoryId?: number) {
  const { accessToken, refreshAccessToken } = useAuth();

  const [categories, setCategories] = useState<BookmarkCategory[]>([]);
  const [restaurants, setRestaurants] = useState<BookmarkMapRestaurant[]>([]);

  // 리스트용 (정렬됨)
  const [listRestaurants, setListRestaurants] = useState<BookmarkRestaurant[]>(
    [],
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    initialCategoryId ?? null,
  );

  const [sort, setSort] = useState<BookmarkSortType>("LATEST");

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
  }, [selectedCategoryId]);

  useEffect(() => {
    if (!selectedCategoryId) return;
    fetchListRestaurants(selectedCategoryId, sort);
  }, [selectedCategoryId, sort]);

  const fetchCategories = async () => {
    try {
      const categories = await getBookmarkCategories({
        accessToken,
        refreshAccessToken,
      });
      setCategories(categories);

      // URL 값이 없을 때만 첫 카테고리 선택
      if (!initialCategoryId && categories.length > 0) {
        setSelectedCategoryId(categories[0].bookmarkCategoryId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRestaurants = async (categoryId: number) => {
    try {
      const response = await getBookmarkCategoryRestaurants({
        bookmarkCategoryId: categoryId,
        accessToken,
        refreshAccessToken,
      });

      setRestaurants(response.restaurants ?? []);
    } catch (error) {
      console.error("fetchRestaurants error", error);
    }
  };
  const fetchListRestaurants = async (
    categoryId: number,
    sortType: BookmarkSortType,
  ) => {
    try {
      const data = await getBookmarksByCategory({
        bookmarkCategoryId: categoryId,
        sort: sortType,
        accessToken,
        refreshAccessToken,
      });
      setListRestaurants(data ?? []);
    } catch (error) {
      console.error("fetchListRestaurants error", error);
    }
  };
  return {
    categories,
    restaurants,
 listRestaurants,
    selectedCategoryId,

    sort,
    setSort,

    selectCategory: setSelectedCategoryId,
  };
}
