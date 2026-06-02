import markerImage from "@/assets/images/marker.png";
import { Map, MapMarker, useKakaoLoader, } from "react-kakao-maps-sdk";

interface Props {
    latitude: number;
    longitude: number;
    placeName: string;
}


const RestaurantLocationMap = ({
    latitude,
    longitude,
}: Props) => {
    const [loading, error] = useKakaoLoader({
        appkey: import.meta.env.VITE_KAKAO_MAP_APP_KEY,
    });

    if (loading) {
        return <div>지도 로딩중...</div>;
    }

    if (error) {
        return <div>지도 로딩 실패</div>;
    }

    return (
        <Map
            center={{
                lat: latitude,
                lng: longitude,
            }}
            level={3}
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            <MapMarker
                position={{
                    lat: latitude,
                    lng: longitude,
                }}
                image={{
                    src: markerImage,
                    size: {
                        width: 32,
                        height: 32,
                    },
                    options: {
                        offset: {
                            x: 16,
                            y: 32,
                        },
                    },
                }}
            />
        </Map>
    );
};

export default RestaurantLocationMap;