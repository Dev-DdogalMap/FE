import { useState } from "react";

import RestaurantCommon from "@/features/restaurant/ui/RestaurantCommon";
import RestaurantTabs from "@/features/restaurant/ui/RestaurantTabs";

import RestaurantScoreTab from "@/features/restaurant/ui/tabs/RestaurantScoreTab";
import RestaurantInfoTab from "@/features/restaurant/ui/tabs/RestaurantInfoTab";
import RestaurantReviewTab from "@/features/restaurant/ui/tabs/RestaurantReviewTab";

import RestaurantBottom from "@/features/restaurant/ui/RestaurantBottom";

const RestaurantPage = () => {
    const [activeTab, setActiveTab] = useState("score");

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

export default RestaurantPage