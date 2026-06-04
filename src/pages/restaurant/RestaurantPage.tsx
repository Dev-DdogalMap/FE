import { useState } from "react";
import { useParams } from "react-router-dom";

import RestaurantCommon from "@/features/restaurant/ui/RestaurantCommon";
import RestaurantTabs from "@/features/restaurant/ui/RestaurantTabs";

import RestaurantInfoTab from "@/features/restaurant/ui/tabs/RestaurantInfoTab";
import RestaurantReviewTab from "@/features/restaurant/ui/tabs/RestaurantReviewTab";
import RestaurantScoreTab from "@/features/restaurant/ui/tabs/RestaurantScoreTab";

import RestaurantBottom from "@/features/restaurant/ui/RestaurantBottom";

const RestaurantPage = () => {
    const [activeTab, setActiveTab] = useState("score");
    const { restaurantId } = useParams<{ restaurantId: string }>();
    // useParams로 가져온 string 타입을 number 타입으로 변환
    const numericId = Number(restaurantId);

    console.log(restaurantId);

    return (
        <div className="pb-28">
            <RestaurantCommon
                restaurant={{
                    restaurantId: numericId,
                    placeName: "로딩 중인 식당",
                    foodType: "음식점",
                    addressName: "주소 정보를 불러오는 중입니다",
                    imageUrl: null,
                    distance: null,
                    foodScore: null,
                    averageScore: null,
                    topTags: [],
                    reviewCount: 0,
                }}
                loading={false}
            />

            <RestaurantTabs
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === "score" && <RestaurantScoreTab />}
            {activeTab === "info" && <RestaurantInfoTab />}
            {activeTab === "review" && <RestaurantReviewTab restaurantId={numericId} />}

            <RestaurantBottom />
        </div>
    );
};

export default RestaurantPage;