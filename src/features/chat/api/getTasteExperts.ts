import { mockTasteExperts } from "@/features/chat/model/mockTasteExperts";
import type {
  TasteExpert,
  TasteExpertFilters,
  TasteExpertListResponse,
} from "@/features/chat/model/types";

const sortExperts = (
  experts: TasteExpert[],
  sort: TasteExpertFilters["sort"],
) => {
  switch (sort) {
    case "RATING":
      return [...experts].sort((a, b) => b.rating - a.rating);
    case "REVIEWS":
      return [...experts].sort((a, b) => b.reviewCount - a.reviewCount);
    case "EXPERTISE":
    default:
      return [...experts].sort((a, b) => {
        if (b.tasteLevel !== a.tasteLevel) {
          return b.tasteLevel - a.tasteLevel;
        }
        return b.reviewCount - a.reviewCount;
      });
  }
};

export async function getTasteExperts(
  filters: TasteExpertFilters,
): Promise<TasteExpertListResponse> {
  const keyword = filters.keyword.trim().toLowerCase();

  const filtered = mockTasteExperts.filter((expert) => {
    const matchesKeyword =
      keyword.length === 0 ||
      expert.nickname.toLowerCase().includes(keyword) ||
      expert.specialty.toLowerCase().includes(keyword) ||
      expert.bio.toLowerCase().includes(keyword);

    const matchesRegion =
      filters.region === "전체" || expert.region === filters.region;
    const matchesCategory =
      filters.category === "전체" || expert.category === filters.category;
    const matchesLevel = expert.tasteLevel >= filters.minLevel;

    return (
      matchesKeyword &&
      matchesRegion &&
      matchesCategory &&
      matchesLevel
    );
  });

  const sorted = sortExperts(filtered, filters.sort);
  const start = filters.page * filters.size;
  const end = start + filters.size;
  const content = sorted.slice(start, end);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        content,
        page: filters.page,
        size: filters.size,
        totalElements: sorted.length,
        totalPages: Math.max(1, Math.ceil(sorted.length / filters.size)),
      });
    }, 250);
  });
}
