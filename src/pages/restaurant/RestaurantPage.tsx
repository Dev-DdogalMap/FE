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

        const { restaurantId } = useParams();

    console.log(restaurantId);

    return (
        <div className="pb-28">
            <RestaurantCommon />

            <RestaurantTabs
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === "score" && <RestaurantScoreTab />}
            {activeTab === "info" && <RestaurantInfoTab />}
            {activeTab === "review" && <RestaurantReviewTab />}

            <RestaurantBottom />
        </div>
    );
};

export default RestaurantPage;