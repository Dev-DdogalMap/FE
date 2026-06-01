import Map from "@/features/map/ui/Map";
import RestaurantPreviewBottomSheet from "@/features/map/ui/RestaurantPreviewBottomSheet";
import { useMap } from "@/features/map/hooks/useMap";

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

  return (
    <main className="relative h-[calc(100dvh-64px)] w-full overflow-hidden bg-white">
      <Map
        center={DEFAULT_CENTER}
        restaurants={restaurants}
        onLoadRestaurants={fetchRestaurants}
        onSelectRestaurant={selectRestaurant}
      />

      {selectedRestaurant && (
        <RestaurantPreviewBottomSheet
          restaurant={selectedRestaurant}
          onClose={closePreview}
        />
      )}
    </main>
  );
}