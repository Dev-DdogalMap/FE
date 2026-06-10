import defaultImage from "@/assets/images/logo.png";
import { Link } from "react-router-dom";
import type { BookmarkRestaurant } from "../model/bookmarkTypes";
type Props = {
    restaurants: BookmarkRestaurant[];
};

const BookmarkRestaurantList = ({ restaurants }: Props) => {

    return (
        <div>
            {restaurants.map((restaurant) => {


                return (
                    <Link
                        key={restaurant.restaurantId}
                        to={`/restaurants/${restaurant.restaurantId}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 active:bg-gray-100"
                    >
                        {restaurant.imageUrl ? (
                            <img
                                src={restaurant.imageUrl}
                                alt={restaurant.restaurantName}
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = defaultImage;
                                }}
                                className="w-16 h-16 rounded-lg object-cover shrink-0"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-orange-50 shrink-0 flex items-center justify-center">
                                <img
                                    src={defaultImage}
                                    alt="default"
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                        )}

                        {/* 우측 텍스트 정보 */}
                        <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">
                                {restaurant.restaurantName}
                                <span className="text-sm text-gray-500 font-normal">
                                    &nbsp;{restaurant.category}
                                </span>
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {restaurant.address}
                            </p>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
};

export default BookmarkRestaurantList;