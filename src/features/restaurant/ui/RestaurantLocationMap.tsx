import markerImage from "@/assets/images/marker.png";
import KakaoBaseMap from "@/shared/map/KakaoBaseMap";
import { MapMarker } from "react-kakao-maps-sdk";

interface Props {
    latitude: number;
    longitude: number;
    placeName: string;
}


const RestaurantLocationMap = ({
    latitude,
    longitude,
}: Props) => {

    return (
        <KakaoBaseMap
            center={{
                lat: latitude,
                lng: longitude,
            }}
            showCurrentLocation={false}
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
        </KakaoBaseMap>
    );
};

export default RestaurantLocationMap;