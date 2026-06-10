import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { searchRestaurants } from "@/features/search/api/searchApi";
import type {
    RestaurantSearchItem,
    SearchSort,
} from "@/features/search/model/searchTypes";
import { getFoodTypes } from "@/features/restaurant/api/restaurantApi";
import { getMyRegion } from "@/features/myPage/api/myPageApi";
import { useWatchLocation } from "@/shared/location/useWatchLocation";
import { useAuth } from "@/shared/auth/AuthContext";
import RestaurantPreviewCard from "@/features/restaurant/ui/RestaurantPreviewCard";
import type { RestaurantPreview } from "@/features/restaurant/model/restaurantTypes";
import { useSearchParams } from "react-router-dom";
import { Search, ChevronDown, Loader2, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS } from "@/shared/constants/colors";
import RegionSelect from "@/features/region/ui/RegionSelect";

interface FoodTypeOption {
    foodTypeId: number;
    type: string;
}

const SORT_OPTIONS: { value: SearchSort; label: string }[] = [
    { value: "distance", label: "거리순" },
    { value: "jjinScore", label: "맛집지수순" },
    { value: "score", label: "별점순" },
];

const PAGE_SIZE = 20;
const MAX_PAGES = 10;

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
    const { accessToken, refreshAccessToken, isLoading: authLoading } = useAuth();

    const [items, setItems] = useState<RestaurantSearchItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const [region, setRegion] = useState("");
    const [foodTypes, setFoodTypes] = useState<FoodTypeOption[]>([]);
    const [foodTypesError, setFoodTypesError] = useState<string | null>(null);
    const [sort, setSort] = useState<SearchSort>("distance");
    const [selectedRegionId, setSelectedRegionId] = useState<number | undefined>();
    const [selectedRegionName, setSelectedRegionName] = useState("전체");
    // 사용자가 RegionSelect 에서 손으로 골랐는지 여부
    // - true 면 본인 동네 자동 채우기 effect 가 라벨을 덮어쓰지 않음
    //   (silent token refresh 로 accessToken 만 갱신될 때 라벨이 본인 동네로 되돌아가는 문제 방지)
    const [hasManuallySelectedRegion, setHasManuallySelectedRegion] = useState(false);

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
        searchPage: number,
    ) => {
        const currentId = ++requestIdRef.current;
        setLoading(true);
        setSearchError(null);
        // 좌표 없으면 distance 정렬 의미 없음 → jjinScore 로 normalize 후 전송
        const effectiveSort: SearchSort =
            searchSort === "distance" && (!location?.lat || !location?.lng)
                ? "jjinScore"
                : searchSort;
        searchRestaurants(
            {
                lat: location?.lat,
                lng: location?.lng,
                keyword: searchKeyword || undefined,
                region: searchRegion || undefined,
                foodTypeId: searchFoodTypeId,
                sort: effectiveSort,
                page: searchPage,
                size: PAGE_SIZE,
            },
            { accessToken },
        )
            .then((res) => {
                if (currentId !== requestIdRef.current) return;
                setItems(res.items);
                setTotalCount(res.totalCount);
            })
            .catch(() => {
                if (currentId !== requestIdRef.current) return;
                setSearchError("검색 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
                setItems([]);
                setTotalCount(0);
            })
            .finally(() => {
                if (currentId !== requestIdRef.current) return;
                setLoading(false);
            });
    };

    /**
     * 필터/정렬/검색어 변경 시 페이지 1로 리셋한 뒤 검색 호출.
     */
    const fetchSearchReset = (
        searchKeyword: string,
        searchRegion: string,
        searchFoodTypeId: number | undefined,
        searchSort: SearchSort,
    ) => {
        setPage(1);
        fetchSearch(searchKeyword, searchRegion, searchFoodTypeId, searchSort, 1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchSearch(keyword, region, selectedFoodTypeId, sort, newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 총 페이지 수 (최대 MAX_PAGES = 10)
    const totalPages = Math.min(
        Math.ceil(totalCount / PAGE_SIZE),
        MAX_PAGES,
    );

    // 페이지네이션 sliding window — 현재 페이지 ±2 까지만 노출 (최대 5개 버튼)
    // 끝(1 또는 totalPages)에 가까우면 자동으로 잘림: 1페이지는 [1 2 3], 마지막은 [n-2 n-1 n] 처럼
    const PAGE_WINDOW = 2;
    const pageStart = Math.max(1, page - PAGE_WINDOW);
    const pageEnd = Math.min(totalPages, page + PAGE_WINDOW);
    const visiblePages = Array.from(
        { length: Math.max(0, pageEnd - pageStart + 1) },
        (_, i) => pageStart + i,
    );

    useEffect(() => {
        getFoodTypes()
            .then(setFoodTypes)
            .catch(() => setFoodTypesError("음식 종류 목록을 불러오지 못했습니다."));
    }, []);

    // 로그인 사용자의 인증 동네를 가져와서 RegionSelect 표시값 초기화
    // (실제 검색 region 파라미터는 빈 문자열로 유지 → BE 가 user.region 자동 적용)
    useEffect(() => {
        // 로그아웃(accessToken null) 시 라벨/깃발/region 초기화
        // - region 까지 리셋해야 재로그인 시 UI 라벨 / 검색 region 파라미터 mismatch 방지
        //   (예: "전체" 선택 → region="ALL" 상태로 로그아웃 → 재로그인 시 라벨만 본인 동네로 채워지고 검색은 전국으로 나감)
        if (!accessToken) {
            setSelectedRegionName("전체");
            setHasManuallySelectedRegion(false);
            setRegion("");
            return;
        }
        // 사용자가 손으로 지역 골랐으면 자동 덮어쓰기 금지
        if (hasManuallySelectedRegion) return;
        getMyRegion({ accessToken, refreshAccessToken })
            .then((data) => {
                if (data.verified && data.eupmyeondongName) {
                    setSelectedRegionName(data.eupmyeondongName);
                }
            })
            .catch(() => {
                // 실패해도 "전체" 표시로 폴백 — 별도 처리 없음
            });
    }, [accessToken, refreshAccessToken, hasManuallySelectedRegion]);

    // 위치가 결정됐는지(성공 OR 거부) 판단
    // - location 값이 채워짐 → 권한 허용 + 위치 받음
    // - locationError 값이 채워짐 → 권한 거부 또는 에러
    // 둘 중 하나라도 일어나기 전에는 검색 호출하지 않음 (페이지 진입 시 2번 호출 방지)
    const locationResolved = location !== null || locationError !== null;
    // auth 결정됐는지 (로그인/비로그인 확정) — useAuth.isLoading 으로 판단
    // false 면 refresh 진행 중 → 이 시점에 검색 나가면 accessToken 없이 호출 → 비로그인 결과 반환
    // (location 거부 케이스에서 locationResolved 가 즉시 true 되어 auth 도착 전 검색 나가는 회귀 방지)
    const authResolved = !authLoading;

    useEffect(() => {
        // location/auth 둘 다 결정되기 전엔 검색 호출하지 않음
        // - authResolved 는 한 번 true 되면 다시 false 안 됨 → silent token refresh 시 재검색 안 일어남
        if (!locationResolved) return;
        if (!authResolved) return;
        fetchSearchReset(keyword, region, selectedFoodTypeId, sort);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.lat, location?.lng, locationError, authResolved]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSearchReset(keyword, region, selectedFoodTypeId, sort);
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
                <RegionSelect
                    selectedRegionId={selectedRegionId}
                    selectedRegionName={selectedRegionName}
                    onChange={(regionName, dong) => {
                        // 사용자가 손으로 지역 선택했음을 표시 → 이후 token refresh 가 라벨 덮어쓰지 못함
                        setHasManuallySelectedRegion(true);
                        // "전체"(빈 문자열) 명시적 선택 시 BE 에 "ALL" 전송 → user.region 자동 적용 방지 → 전국 검색
                        const effectiveRegion = regionName || "ALL";
                        setRegion(effectiveRegion);
                        setSelectedRegionName(regionName || "전체");
                        setSelectedRegionId(dong?.regionId);

                        fetchSearchReset(keyword, effectiveRegion, selectedFoodTypeId, sort);
                }}
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
                                fetchSearchReset(keyword, region, undefined, sort);
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
                                    fetchSearchReset(keyword, region, ft.foodTypeId, sort);
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
                    {totalCount > MAX_PAGES * PAGE_SIZE
                        ? `검색 결과 ${totalCount.toLocaleString()}개 중 상위 ${(MAX_PAGES * PAGE_SIZE).toLocaleString()}개`
                        : `검색 결과 ${totalCount.toLocaleString()}개`}
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
                                    fetchSearchReset(keyword, region, selectedFoodTypeId, opt.value);
                                }}
                                className="whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition active:scale-95"
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

            {totalPages > 1 && (
                <nav
                    aria-label="검색 결과 페이지네이션"
                    className="mt-6 flex items-center justify-center gap-1"
                >
                    <button
                        type="button"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        aria-label="이전 페이지"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {visiblePages.map((p) => {
                        const isActive = p === page;
                        return (
                            <button
                                key={p}
                                type="button"
                                onClick={() => handlePageChange(p)}
                                aria-current={isActive ? "page" : undefined}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition"
                                style={
                                    isActive
                                        ? {
                                            backgroundColor: COLORS.PRIMARY,
                                            color: "#FFFFFF",
                                        }
                                        : {
                                            backgroundColor: "#FFFFFF",
                                            color: "#6B7280",
                                            border: "1px solid #E5E7EB",
                                        }
                                }
                            >
                                {p}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                        aria-label="다음 페이지"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronRight size={16} />
                    </button>
                </nav>
            )}

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
