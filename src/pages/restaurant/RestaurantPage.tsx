import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import RestaurantCommon from "@/features/restaurant/ui/RestaurantCommon";
import RestaurantTabs from "@/features/restaurant/ui/RestaurantTabs";

import RestaurantInfoTab from "@/features/restaurant/ui/tabs/RestaurantInfoTab";
import RestaurantReviewTab from "@/features/restaurant/ui/tabs/RestaurantReviewTab";

import RestaurantBottom from "@/features/restaurant/ui/RestaurantBottom";

import { getRestaurantPreview } from "@/features/restaurant/api/restaurantApi";
import type { RestaurantPreview } from "@/features/restaurant/model/restaurantTypes";
import { useWatchLocation } from "@/shared/location/useWatchLocation";
import ErrorView from "@/shared/ui/ErrorView";

const RestaurantPage = () => {
    const [activeTab, setActiveTab] = useState("info");

    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState<RestaurantPreview | null>(null);
    const { location } = useWatchLocation();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const restaurantIdNumber = Number(restaurantId);
    const isInvalidRestaurantId = !restaurantId || Number.isNaN(restaurantIdNumber);

    // useParams로 가져온 string 타입을 number 타입으로 변환
    const numericId = Number(restaurantId);

    useEffect(() => {
        if (isInvalidRestaurantId) return;

        const fetchRestaurant = async () => {
            try {
                setLoading(true);
                setError(false);

                const data = await getRestaurantPreview({
                    restaurantId: restaurantIdNumber,
                    lat: location?.lat,
                    lng: location?.lng,
                });

                setRestaurant(data);
            } catch (error) {
                console.error("음식점 정보 조회 실패:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [isInvalidRestaurantId, restaurantIdNumber, location?.lat, location?.lng]);

    if (isInvalidRestaurantId || error) {
        return (
            <ErrorView
                heightClassName="min-h-screen"
                title="음식점 정보를 불러오지 못했어요"
                description={
                    isInvalidRestaurantId
                    ? "잘못된 음식점 주소입니다."
                    : "잠시 후 다시 시도해주세요"
                }
            />
        );
    }

    return (
        <div className="pb-28">
            <RestaurantCommon
                restaurant={restaurant}
                loading={loading}
            />

            {!loading && restaurant && (
            <>
                <RestaurantTabs
                activeTab={activeTab}
                onChange={setActiveTab}
                />

                {activeTab === "info" && <RestaurantInfoTab />}
                {activeTab === "review" && <RestaurantReviewTab restaurantId={numericId} />}

                <RestaurantBottom />
            </>
            )}
        </div>
    );
};

export default RestaurantPage;