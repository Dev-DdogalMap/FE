import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";

import { getRestaurantInfo } from "../../api/getRestaurantInfo";
import type { RestaurantInfoResponse } from "../../model/restaurantTypes";
import RestaurantLocationMap from "../RestaurantLocationMap";

const RestaurantInfoTab = () => {
  const { restaurantId } = useParams();

  const [info, setInfo] = useState<RestaurantInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getRestaurantInfo(Number(restaurantId));
        setInfo(data);
      } catch (e) {
        console.error(e);
        setError("음식점 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [restaurantId]);

  // 로딩
  if (loading) {
    return <div className="p-6">로딩중...</div>;
  }

  // 에러
  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  // 데이터 없음
  if (!info) {
    return (
      <div className="p-6">
        정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* 지도 */}
      <div className="rounded-xl overflow-hidden bg-white">
        <div className="relative h-64">
          <RestaurantLocationMap
            latitude={info.latitude}
            longitude={info.longitude}
            placeName={info.placeName}
          />
        </div>

        {/* 주소 + 길찾기 */}
        <div className="p-4 text-sm text-gray-700 flex items-center gap-2">
          <FaMapMarkerAlt />
          <span className="flex-1">  {/* 배치 확인 */}
            {info.roadAddressName}
          </span>

          <a
            href={`https://map.kakao.com/link/to/${encodeURIComponent(info.placeName)},${info.latitude},${info.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500 text-white text-[11px] font-medium hover:bg-blue-600 transition"
          >
            길찾기
          </a>
        </div>

        {/* 정보 */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex justify-between">
            <span className="text-gray-500">전화</span>
            {info.phone ? (
              <a
                href={`tel:${info.phone}`}
                className="text-blue-500 hover:underline"
              >
                {info.phone}
              </a>
            ) : (
              <span className="text-gray-400">
                등록된 전화번호 없음
              </span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">장소 URL</span>

            {info.placeUrl ? (
              <a
                href={info.placeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500"
              >
                바로가기
              </a>
            ) : (
              <span className="text-gray-400">
                정보 없음
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfoTab;