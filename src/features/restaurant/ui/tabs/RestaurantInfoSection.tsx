import { FaMapMarkerAlt } from "react-icons/fa";
import type { RestaurantInfoResponse } from "../../model/restaurantTypes";
import RestaurantLocationMap from "../RestaurantLocationMap";

interface Props {
    info: RestaurantInfoResponse;
}

const RestaurantInfoSection = ({ info }: Props) => {

    return (
        <div className="bg-white rounded-xl overflow-hidden">

            {/* 지도 */}
            <div className="relative h-64">
                <RestaurantLocationMap
                    latitude={info.latitude}
                    longitude={info.longitude}
                    placeName={info.placeName}
                />
            </div>

            {/* 주소 + 길찾기 */}
            <div className="p-4 flex items-center gap-2 text-sm text-gray-700">
                <FaMapMarkerAlt />

                <span className="flex-1">
                    {info.roadAddressName}
                </span>

                <a
                    href={`https://map.kakao.com/link/to/${encodeURIComponent(info.placeName)},${info.latitude},${info.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-3 py-1 rounded-full bg-[#FF6B00] text-white text-[11px] font-medium hover:bg-orange-600 transition"
                >
                    길찾기
                </a>
            </div>
        </div>
    );
};

export default RestaurantInfoSection;