import { Link } from "react-router-dom";
import type { BookmarkMapRestaurant } from "../model/bookmarkTypes";

type Props = {
    restaurants: BookmarkMapRestaurant[];
};

const BookmarkRestaurantList = ({ restaurants }: Props) => {
    return (
        <div>
            {restaurants.map((restaurant) => (
                <Link
                    key={restaurant.restaurantId}
                    to={`/restaurants/${restaurant.restaurantId}`}
                    className="block p-3 hover:bg-gray-50 active:bg-gray-100"
                >
                    <p className="font-bold">{restaurant.placeName}
                    <span className="text-sm text-gray-500"> &nbsp;{restaurant.foodType}</span></p>
                    
                    <p className="text-sm text-gray-500">{restaurant.addressName}</p>
                </Link>
            ))}
        </div>
    );
};

export default BookmarkRestaurantList;