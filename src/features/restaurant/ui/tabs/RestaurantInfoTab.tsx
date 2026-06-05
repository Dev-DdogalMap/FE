import type { RestaurantInfoResponse } from "../../model/restaurantTypes";

import RestaurantInfoSection from "./RestaurantInfoSection";
import RestaurantScoreSection from "./RestaurantScoreSection";

type Props = {
    restaurant: RestaurantInfoResponse;
};

const RestaurantInfoTab = ({ restaurant }: Props) => {
    return (
        <div className="flex flex-col gap-6 p-6">
            <RestaurantScoreSection restaurant={restaurant} />
            <RestaurantInfoSection info={restaurant} />
        </div>
    );
};

export default RestaurantInfoTab;