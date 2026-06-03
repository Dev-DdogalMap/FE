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
    addressName: item.addressName ?? "",
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

    // 최신 검색 요청만 반영하기 위한 카운터. 새 요청이 시작될 때마다 증가시키고,
    // 응답이 도착하면 그 시점 id 와 현재 ref 를 비교해 stale 응답을 무시.
    const requestIdRef = useRef(0);

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
            <h1 className="mb-4 text-lg font-bold">맛집 탐색</h1>

            {locationError && (
                <div className="mb-2 rounded bg-red-50 p-2 text-sm text-red-600">
                    {locationError}
                </div>
            )}

            {foodTypesError && (
                <div className="mb-2 rounded bg-red-50 p-2 text-sm text-red-600">
                    {foodTypesError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="지역, 음식, 맛집 이름 검색"
                    className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
            </form>

            <div className="mb-4 flex flex-wrap gap-2">
                <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="지역 (예: 성수동)"
                    className="min-w-0 flex-1 rounded-full border border-gray-300 px-3 py-1 text-sm"
                />
                <select
                    value={selectedFoodTypeId ?? ""}
                    onChange={(e) =>
                        setSelectedFoodTypeId(
                            e.target.value ? Number(e.target.value) : undefined,
                        )
                    }
                    className="rounded-full border border-gray-300 px-3 py-1 text-sm"
                >
                    <option value="">전체</option>
                    {foodTypes.map((ft) => (
                        <option key={ft.foodTypeId} value={ft.foodTypeId}>
                            {ft.type}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={() => fetchSearch(keyword, region, selectedFoodTypeId, sort)}
                    className="shrink-0 whitespace-nowrap rounded-full bg-orange-500 px-3 py-1 text-sm text-white"
                >
                    필터 적용
                </button>
            </div>

            <div className="mb-4 flex gap-2">
                {SORT_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                            setSort(opt.value);
                            fetchSearch(keyword, region, selectedFoodTypeId, opt.value);
                        }}
                        className={`rounded-full px-3 py-1 text-sm ${
                            sort === opt.value
                                ? "bg-orange-500 text-white"
                                : "border border-gray-300 text-gray-700"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {loading && <div className="text-sm text-gray-500">불러오는 중...</div>}

            {searchError && (
                <div className="mb-2 rounded bg-red-50 p-2 text-sm text-red-600">
                    {searchError}
                </div>
            )}

            <ul className="space-y-4">
                {items.map((item) => (
                    <li
                        key={item.restaurantId}
                        onClick={() => navigate(`/restaurants/${item.restaurantId}`)}
                        className="cursor-pointer rounded-2xl border border-gray-200 p-3 transition hover:shadow-md"
                    >
                        <RestaurantPreviewCard restaurant={toPreview(item)} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
