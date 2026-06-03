import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getRestaurantInfo } from "../../api/getRestaurantInfo";
import type { RestaurantInfoResponse } from "../../model/restaurantTypes";

import RestaurantInfoSection from "./RestaurantInfoSection";
import RestaurantScoreSection from "./RestaurantScoreSection";

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
        const data = await getRestaurantInfo(Number(restaurantId));
        setInfo(data);
      } catch (e) {
        setError("음식점 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [restaurantId]);

  if (loading) return <div className="p-6">로딩중...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!info) return <div className="p-6">정보가 없습니다.</div>;

  return (
    <div className="p-6 flex flex-col gap-6">
      <RestaurantScoreSection />
      <RestaurantInfoSection info={info} />
      
    </div>
  );
};

export default RestaurantInfoTab;