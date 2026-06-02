import { useEffect, useState } from "react";

import axios from "@/shared/api/axios";
import { searchRestaurants } from "@/features/search/api/searchApi";
import type {
    RestaurantSearchItem,
    SearchSort,
} from "@/features/search/model/searchTypes";
import { useWatchLocation } from "@/shared/location/useWatchLocation";
import RestaurantPreviewCard from "@/features/restaurant/ui/RestaurantPreviewCard";
import type { RestaurantPreview } from "@/features/restaurant/model/restaurantTypes";

interface FoodTypeOption {
    foodTypeId: number;
    type: string;
}

const SORT_OPTIONS: { value: SearchSort; label: string }[] = [
    { value: "distance", label: "거리순" },
    { value: "jjinScore", label: "맛집지수순" },
    { value: "score", label: "별점순" },
];

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

export default function SearchPage() {
    const { location, errorMessage: locationError } = useWatchLocation();

    const [items, setItems] = useState<RestaurantSearchItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [region, setRegion] = useState("");
    const [selectedFoodTypeId, setSelectedFoodTypeId] = useState<number | undefined>(undefined);
    const [foodTypes, setFoodTypes] = useState<FoodTypeOption[]>([]);
    const [sort, setSort] = useState<SearchSort>("distance");

    const fetchSearch = (
        searchKeyword: string,
        searchRegion: string,
        searchFoodTypeId: number | undefined,
        searchSort: SearchSort,
    ) => {
        if (!location) return;
        setLoading(true);
        searchRestaurants({
            lat: location.lat,
            lng: location.lng,
            keyword: searchKeyword || undefined,
            region: searchRegion || undefined,
            foodTypeId: searchFoodTypeId,
            sort: searchSort,
            page: 1,
            size: 20,
        })
            .then((res) => setItems(res.items))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        axios.get<FoodTypeOption[]>("/api/food-types")
            .then((res) => setFoodTypes(res.data));
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

            <ul className="space-y-4">
                {items.map((item) => (
                    <li
                        key={item.restaurantId}
                        className="rounded-2xl border border-gray-200 p-3"
                    >
                        <RestaurantPreviewCard restaurant={toPreview(item)} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
