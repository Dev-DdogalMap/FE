import { CustomOverlayMap } from "react-kakao-maps-sdk";
import markerImage from "@/assets/images/marker.png";

import type { RestaurantMapItem } from "../model/mapTypes";

type Props = {
    restaurant: RestaurantMapItem;
    onClick: () => void;
};

export default function RestaurantMarker({ restaurant, onClick }: Props) {
    return (
        <CustomOverlayMap
        position={{
            lat: restaurant.latitude,
            lng: restaurant.longitude,
        }}
        yAnchor={1}
        >
        <button
            type="button"
            onClick={(event) => {
            event.stopPropagation();
            onClick();
            }}
            className="block h-8 w-8 cursor-pointer border-0 bg-transparent p-0"
        >
            <img
            src={markerImage}
            alt={`${restaurant.placeName} 마커`}
            className="h-full w-full object-contain"
            draggable={false}
            />
        </button>
        </CustomOverlayMap>
    );
}