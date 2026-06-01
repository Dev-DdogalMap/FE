import {
    Bookmark,
    Navigation,
    Star,
    MessageSquareMore,
} from "lucide-react";

import type { RestaurantPreview } from "../model/restaurantTypes";

type Props = {
    restaurant: RestaurantPreview;
};

export default function RestaurantPreviewCard({ restaurant }: Props) {
    return (
        <article className="flex gap-4">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                {restaurant.imageUrl ? (
                    <img
                        src={restaurant.imageUrl}
                        alt={restaurant.placeName}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        이미지 없음
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-[#FF6B00]">
                                {restaurant.foodType}
                            </span>

                            <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-[#FF6B00]">
                                맛집지수 {restaurant.foodScore ?? "--"}%
                            </span>
                        </div>

                        <h3 className="mt-2 truncate text-lg font-bold text-gray-900">
                            {restaurant.placeName}
                        </h3>
                    </div>

                    <button
                        type="button"
                        aria-label="맛집 저장"
                        className="shrink-0 rounded-full p-1.5 text-gray-400 transition hover:bg-orange-50 hover:text-[#FF6B00]"
                    >
                        <Bookmark size={22} />
                    </button>
                </div>

                <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Star
                            size={15}
                            fill="#FFB800"
                            className="text-[#FFB800]"
                        />
                        <span className="text-sm font-semibold text-gray-800">
                            {restaurant.averageScore ?? "-"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MessageSquareMore size={14} />
                        <span>리뷰 {restaurant.reviewCount}</span>
                    </div>
                </div>

                {restaurant.topTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {restaurant.topTags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                    <Navigation
                        size={14}
                        className="shrink-0 text-[#FF6B00]"
                    />

                    {restaurant.distance !== null && (
                        <span className="shrink-0 font-semibold text-[#FF6B00]">
                            {restaurant.distance}m
                        </span>
                    )}

                    <span className="truncate">
                        {restaurant.addressName}
                    </span>
                </div>
            </div>
        </article>
    );
}