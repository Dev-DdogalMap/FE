import { Map, useKakaoLoader } from "react-kakao-maps-sdk";

type Props = {
  center: {
    lat: number;
    lng: number;
  };
};

export default function KakaoBaseMap({ center }: Props) {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_APP_KEY,
    libraries: ["services", "clusterer"],
  });

  if (loading) return <div>지도 로딩중...</div>;

  if (error) {
    console.error("Kakao Map Load Error:", error);
    return <div>지도 로딩 실패</div>;
  }

  return (
    <Map
      center={center}
      level={4}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}