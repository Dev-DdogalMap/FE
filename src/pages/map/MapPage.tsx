import KakaoBaseMap from "../../shared/map/KakaoBaseMap";

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-64px-64px)]">
      <KakaoBaseMap
        center={{
          lat: 37.5665,
          lng: 126.978,
        }}
      />
    </div>
  );
}