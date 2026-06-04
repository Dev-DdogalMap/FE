import { FaMapMarkerAlt } from "react-icons/fa";
import type { RestaurantInfoResponse } from "../../model/restaurantTypes";
import RestaurantLocationMap from "../RestaurantLocationMap";

import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { toast } from 'sonner';

interface Props {
    info: RestaurantInfoResponse;
}

const RestaurantInfoSection = ({ info }: Props) => {

    const isMobile = useIsMobile();

    const handleCopyPhone = async () => {
        const phone = info?.phone;

        if (!phone) {
            toast.error("복사할 전화번호가 없습니다.");
            return;
        }

        await navigator.clipboard.writeText(phone);
        toast.success("전화번호가 복사되었습니다.");
    };

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

            {/* 전화 */}
            <div className="p-4 flex justify-between text-sm">
                <span className="text-gray-500">전화</span>

                {info.phone ? (
                    isMobile ? (
                        <a
                            href={`tel:${info.phone}`}
                            className="hover:text-[#FF6B00]"
                        >
                            {info.phone}
                        </a>
                    ) : (
                        <button
                            type="button"
                            onClick={handleCopyPhone}
                            className="hover:text-[#FF6B00] cursor-pointer"
                        >
                            {info.phone}
                        </button>
                    )
                ) : (
                    <span className="text-gray-400">등록된 전화번호 없음</span>
                )}
            </div>

        </div>
    );
};

export default RestaurantInfoSection;