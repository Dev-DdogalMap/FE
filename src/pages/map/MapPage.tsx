import Map from "@/features/map/ui/Map";
import RestaurantPreviewBottomSheet from "@/features/map/ui/RestaurantPreviewBottomSheet";
import { useMap } from "@/features/map/hooks/useMap";
import { useCallback, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
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
      <div className="px-4 py-3">
        <div className="flex h-12 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="지역, 음식점, 메뉴 검색"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              handleSearch();
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-gray-400 transition hover:bg-orange-50 hover:text-[#ff6b00] active:scale-95 active:bg-orange-100"
            aria-label="검색"
          >
            <Search size={17} />
          </button>
        </div>
      </div>

      <Map
        center={DEFAULT_CENTER}
        restaurants={restaurants}
        onLoadRestaurants={fetchRestaurants}
        onSelectRestaurant={selectRestaurant}
        bottomSheetHeight={bottomSheetHeight}
      />

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