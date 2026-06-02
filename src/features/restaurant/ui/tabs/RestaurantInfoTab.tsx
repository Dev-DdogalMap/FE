import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getRestaurantInfo } from "../../api/getRestaurantInfo";
import type { RestaurantInfoResponse } from "../../model/restaurantTypes";

const RestaurantInfoTab = () => {
    const { restaurantId } = useParams();

    const [info, setInfo] =
        useState<RestaurantInfoResponse | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        if (!restaurantId) return;

        const fetchInfo = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getRestaurantInfo(
                    Number(restaurantId)
                );

                setInfo(data);
            } catch (error) {
                console.error(error);

                setError(
                    "음식점 정보를 불러오지 못했습니다."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, [restaurantId]);

    // 로딩중
    if (loading) {
        return (
            <div className="p-6">
                로딩중...
            </div>
        );
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
    <div className="p-6">
        <div>{info.roadAddressName}</div>

        <div>{info.phone ?? "-"}</div>

 <div className="h-64 mt-4 rounded-xl overflow-hidden">
  <RestaurantLocationMap
    latitude={info.latitude}
    longitude={info.longitude}
  />
</div>

        <a
            href={`https://map.kakao.com/link/to/${info.placeName},${info.latitude},${info.longitude}`}
            target="_blank"
            rel="noreferrer"
        >
            길찾기
        </a>

        {info.placeUrl ? (
            <a
                href={info.placeUrl}
                target="_blank"
                rel="noreferrer"
            >
                카카오맵에서 보기
            </a>
        ) : (
            <span>카카오맵 정보 없음</span>
        )}
    </div>
);

};

export default RestaurantInfoTab;