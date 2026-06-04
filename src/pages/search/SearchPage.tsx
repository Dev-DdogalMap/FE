import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "@/shared/api/axios";
import { searchRestaurants } from "@/features/search/api/searchApi";
import type {
    RestaurantSearchItem,
    SearchSort,
} from "@/features/search/model/searchTypes";
import { useWatchLocation } from "@/shared/location/useWatchLocation";
import RestaurantPreviewCard from "@/features/restaurant/ui/RestaurantPreviewCard";
import type { RestaurantPreview } from "@/features/restaurant/model/restaurantTypes";
import { useSearchParams } from "react-router-dom";
import { Search, ChevronDown, Loader2, ChevronUp } from "lucide-react";
import { COLORS } from "@/shared/constants/colors";

interface FoodTypeOption {
    foodTypeId: number;
    type: string;
}

const SORT_OPTIONS: { value: SearchSort; label: string }[] = [
    { value: "distance", label: "거리순" },
    { value: "jjinScore", label: "맛집지수순" },
    { value: "score", label: "별점순" },
];

/**
 * 검색 API 응답 아이템을 미리보기 카드 props 로 변환.
 */
const toPreview = (item: RestaurantSearchItem): RestaurantPreview => ({
    restaurantId: item.restaurantId,
    placeName: item.placeName,
    foodType: item.foodType,
    addressName: item.roadAddressName ?? item.addressName ?? "",
    imageUrl: null,
    distance: item.distance,
    averageScore: item.averageScore,
    reviewCount: item.reviewCount,
    topTags: item.tags,
    foodScore: item.jjinScore,
});

/**
 * 맛집 탐색 페이지.
 * - 현재 위치 + 필터 조건으로 검색 API 호출
 * - 동시 요청은 latest-request guard 로 마지막 응답만 반영 (stale items 방지)
 * - 검색 실패 시 에러 메시지 표시
 */
export default function SearchPage() {
    const navigate = useNavigate();
    const { location, errorMessage: locationError } = useWatchLocation();

    const [items, setItems] = useState<RestaurantSearchItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const [region, setRegion] = useState("");
    const [foodTypes, setFoodTypes] = useState<FoodTypeOption[]>([]);
    const [foodTypesError, setFoodTypesError] = useState<string | null>(null);
    const [sort, setSort] = useState<SearchSort>("distance");

    // 검색 파라미터
    const [searchParams] = useSearchParams();

    const [keyword, setKeyword] = useState(
        () => searchParams.get("keyword")?.trim() ?? "",
    );

    const [selectedFoodTypeId, setSelectedFoodTypeId] = useState<number | undefined>(
        () => {
            const value = searchParams.get("foodTypeId");
            return value ? Number(value) : undefined;
        },
    );

    const [isFoodTypeOpen, setIsFoodTypeOpen] = useState(false);

    const selectedFoodTypeName =
        selectedFoodTypeId === undefined
            ? "음식 종류"
            : foodTypes.find((ft) => ft.foodTypeId === selectedFoodTypeId)?.type ?? "음식 종류";

    // 최신 검색 요청만 반영하기 위한 카운터. 새 요청이 시작될 때마다 증가시키고,
    // 응답이 도착하면 그 시점 id 와 현재 ref 를 비교해 stale 응답을 무시.
    const requestIdRef = useRef(0);

    const [showTopButton, setShowTopButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowTopButton(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /**
     * 검색 API 호출. 위치 정보가 없으면 호출하지 않음.
     * 마지막 요청만 화면에 반영하고, 실패 시 에러 메시지 표시.
     */
    const fetchSearch = (
        searchKeyword: string,
        searchRegion: string,
        searchFoodTypeId: number | undefined,
        searchSort: SearchSort,
    ) => {
        if (!location) return;
        const currentId = ++requestIdRef.current;
        setLoading(true);
        setSearchError(null);
        searchRestaurants({
            lat: location.lat,
            lng: location.lng,
            keyword: searchKeyword || undefined,
            region: searchRegion || undefined,
            foodTypeId: searchFoodTypeId,
            sort: searchSort,
            page: 1,
            size: 50,
        })
            .then((res) => {
                if (currentId !== requestIdRef.current) return;
                setItems(res.items);
            })
            .catch(() => {
                if (currentId !== requestIdRef.current) return;
                setSearchError("검색 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
                setItems([]);
            })
            .finally(() => {
                if (currentId !== requestIdRef.current) return;
                setLoading(false);
            });
    };

    useEffect(() => {
        axios.get<FoodTypeOption[]>("/api/food-types")
            .then((res) => setFoodTypes(res.data))
            .catch(() => setFoodTypesError("음식 종류 목록을 불러오지 못했습니다."));
    }, []);

    useEffect(() => {
        if (location) {
            fetchSearch(keyword, region, selectedFoodTypeId, sort);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.lat, location?.lng]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSearch(keyword, region, selectedFoodTypeId, sort);
    };

    return (
        <div className="px-4 py-6">
            <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900">
                    내 주변 맛집 찾기
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    거리, 평점, 맛집지수로 빠르게 비교해 보세요.
                </p>
            </div>

            {foodTypesError && (
                <div className="mb-2 rounded bg-red-50 p-2 text-sm text-red-600">
                    {foodTypesError}
                </div>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                }}
                className="mb-4"
            >
                <div className="flex h-12 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="지역, 음식, 맛집 이름 검색"
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                    />
                    <button
                        type="submit"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-gray-400 transition hover:bg-[#FFF3E8] hover:text-[#FF6B00] active:scale-95 active:bg-[#FFE7D6]"
                        aria-label="검색"
                    >
                        <Search size={17} />
                    </button>
                </div>
            </form>

            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="지역 입력 (예: 성수동)"
                    className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#FF6B00]/20"
                />

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsFoodTypeOpen((prev) => !prev)}
                        className="flex h-[48px] min-w-[110px] items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm"
                    >
                        <span>{selectedFoodTypeName}</span>

                        <ChevronDown
                            size={16}
                            className={isFoodTypeOpen ? "rotate-180 transition" : "transition"}
                        />
                    </button>

                    {isFoodTypeOpen && (
                    <div className="absolute right-0 top-12 z-30 max-h-56 w-40 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedFoodTypeId(undefined);
                                setIsFoodTypeOpen(false);
                                fetchSearch(keyword, region, undefined, sort);
                            }}
                            className={`w-full rounded-xl px-3 py-2.5 text-left text-sm ${
                                selectedFoodTypeId === undefined
                                    ? "bg-[#FFF3E8] font-semibold text-[#FF6B00]"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            전체
                        </button>

                        {foodTypes.map((ft) => (
                            <button
                                key={ft.foodTypeId}
                                type="button"
                                onClick={() => {
                                    setSelectedFoodTypeId(ft.foodTypeId);
                                    setIsFoodTypeOpen(false);
                                    fetchSearch(keyword, region, ft.foodTypeId, sort);
                                }}
                                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm ${
                                    selectedFoodTypeId === ft.foodTypeId
                                        ? "bg-[#FFF3E8] font-semibold text-[#FF6B00]"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                {ft.type}
                        </button>
                        ))}
                    </div>
                    )}
                </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    검색 결과 {items.length}개
                </p>

                <div className="flex gap-2">
                    {SORT_OPTIONS.map((opt) => {
                        const isSelected = sort === opt.value;

                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    setSort(opt.value);
                                    fetchSearch(keyword, region, selectedFoodTypeId, opt.value);
                                }}
                                className="rounded-full border px-3.5 py-1.5 text-sm font-medium transition active:scale-95"
                                style={
                                    isSelected
                                        ? {
                                            borderColor: COLORS.PRIMARY,
                                            backgroundColor: COLORS.PRIMARY_PALE,
                                            color: COLORS.PRIMARY,
                                        }
                                        : {
                                            borderColor: "#E5E7EB",
                                            backgroundColor: "#FFFFFF",
                                            color: "#6B7280",
                                        }
                                }
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-500">
                    <Loader2
                        size={18}
                        className="animate-spin"
                        color={COLORS.PRIMARY}
                    />
                    <span>검색 중</span>
                </div>
            )}

            {!loading && !searchError && items.length === 0 && (
                <div className="rounded-3xl bg-white px-6 py-10 text-center shadow-sm">
                    <p className="text-sm font-semibold text-gray-700">
                        검색 결과가 없어요
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        다른 지역이나 음식 종류로 검색해보세요
                    </p>
                </div>
            )}

            {locationError && (
                <div className="mb-2 rounded bg-red-50 p-2 text-sm text-red-600">
                    {locationError}
                </div>
            )}

            {searchError && (
                <div className="mb-2 rounded bg-red-50 p-2 text-sm text-red-600">
                    {searchError}
                </div>
            )}

            <ul className="space-y-4">
                {items.map((item) => (
                    <li
                        key={item.restaurantId}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/restaurants/${item.restaurantId}`)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                navigate(`/restaurants/${item.restaurantId}`);
                            }
                        }}
                        className="cursor-pointer rounded-2xl border border-gray-200 p-3 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    >
                        <RestaurantPreviewCard restaurant={toPreview(item)} />
                    </li>
                ))}
            </ul>

            {showTopButton && (
                <button
                    type="button"
                    aria-label="맨 위로 이동"
                    onClick={() =>
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        })
                    }
                    className="fixed bottom-24 left-[calc(50%+150px)] right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-lg active:scale-95"
                >
                    <ChevronUp size={22} className="text-gray-700" />
                </button>
            )}
        </div>
    );
}
