import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, Utensils, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Map from "@/features/map/ui/Map";
import RestaurantPreviewBottomSheet from "@/features/map/ui/RestaurantPreviewBottomSheet";
import { useMap } from "@/features/map/hooks/useMap";
import { getFoodTypes } from "@/features/restaurant/api/restaurantApi";
import type { FoodTypeOption } from "@/features/restaurant/model/restaurantTypes";

const DEFAULT_CENTER = {
  lat: 37.5665,
  lng: 126.978,
};

export default function MapPage() {
  const {
    restaurants,
    selectedRestaurant,
    fetchRestaurants,
    selectRestaurant,
    closePreview,
  } = useMap();

  const navigate = useNavigate();
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [foodTypes, setFoodTypes] = useState<FoodTypeOption[]>([]);
  const [foodTypesError, setFoodTypesError] = useState<string | null>(null);
  const [selectedFoodTypeId, setSelectedFoodTypeId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");

  const selectedFoodTypeName =
    foodTypes.find((foodType) => foodType.foodTypeId === selectedFoodTypeId)?.type ??
    "전체 카테고리";

  useEffect(() => {
    getFoodTypes()
      .then(setFoodTypes)
      .catch(() => {
        setFoodTypesError("음식 카테고리를 불러오지 못했습니다.");
      });
  }, []);

  const filteredRestaurants = useMemo(() => {
    if (selectedFoodTypeId === null) {
      return restaurants;
    }

    return restaurants.filter(
      (restaurant) => restaurant.foodTypeId === selectedFoodTypeId,
    );
  }, [restaurants, selectedFoodTypeId]);

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    const params = new URLSearchParams();

    if (trimmedKeyword) {
      params.set("keyword", trimmedKeyword);
    }

    if (selectedFoodTypeId !== null) {
      params.set("foodTypeId", String(selectedFoodTypeId));
    }

    navigate(`/search?${params.toString()}`);
  };

  const bottomSheetRef = useCallback((node: HTMLDivElement | null) => {
    resizeObserverRef.current?.disconnect();

    if (!node) {
      setBottomSheetHeight(0);
      return;
    }

    const updateHeight = () => {
      setBottomSheetHeight(node.offsetHeight);
    };

    updateHeight();

    resizeObserverRef.current = new ResizeObserver(updateHeight);
    resizeObserverRef.current.observe(node);
  }, []);

  return (
    <main className="relative h-[calc(100dvh-64px-64px)] w-full overflow-hidden">
      {/* 검색바 */}
      <div className="relative z-20 px-4 py-3">
        <div className="flex h-12 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="지역, 음식점 검색"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSearch}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-gray-400 transition hover:bg-orange-50 hover:text-[#ff6b00] active:scale-95 active:bg-orange-100"
            aria-label="검색"
          >
            <Search size={17} />
          </button>
        </div>
      </div>

      <Map
        center={DEFAULT_CENTER}
        restaurants={filteredRestaurants}
        onLoadRestaurants={fetchRestaurants}
        onSelectRestaurant={selectRestaurant}
        bottomSheetHeight={bottomSheetHeight}
      />

      {/* 카테고리 선택 */}
      <div className="absolute right-4 top-[76px] z-20">
        <button
          type="button"
          onClick={() => setIsCategoryOpen((prev) => !prev)}
          className="flex h-10 w-40 items-center justify-between gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm"
        >
          <Utensils size={16} />
          <span>{selectedFoodTypeName}</span>
          <ChevronDown
            size={16}
            className={isCategoryOpen ? "rotate-180 transition" : "transition"}
          />
        </button>

        {isCategoryOpen && (
          <div className="mt-2 max-h-[180px] w-40 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setSelectedFoodTypeId(null);
                setIsCategoryOpen(false);
              }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                selectedFoodTypeId === null
                  ? "bg-orange-50 text-orange-500"
                  : "hover:bg-gray-50"
              }`}
            >
              전체
            </button>

            {foodTypes.map((category) => (
              <button
                key={category.foodTypeId}
                type="button"
                onClick={() => {
                  setSelectedFoodTypeId(category.foodTypeId);
                  setIsCategoryOpen(false);
                }}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  selectedFoodTypeId === category.foodTypeId
                    ? "bg-orange-50 text-orange-500"
                    : "hover:bg-gray-50"
                }`}
              >
                {category.type}
              </button>
            ))}
          </div>
        )}

        {foodTypesError && (
          <div className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-500 shadow-sm">
            {foodTypesError}
          </div>
        )}
      </div>

      {selectedRestaurant && (
        <RestaurantPreviewBottomSheet
          ref={bottomSheetRef}
          restaurant={selectedRestaurant}
          onClose={closePreview}
        />
      )}
    </main>
  );
}