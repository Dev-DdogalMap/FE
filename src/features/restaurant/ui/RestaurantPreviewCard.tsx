import { useEffect, useState } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import { getBookmarkCategoryStatuses } from "@/features/bookmark/api/bookmarkApi";
import {
    Bookmark,
    Navigation,
    Star,
    MessageSquareMore,
} from "lucide-react";
import { COLORS } from "@/shared/constants/colors";
import type { RestaurantPreview } from "../model/restaurantTypes";
import BookmarkCategoryModal from "@/features/bookmark/ui/BookmarkCategoryModal";

type Props = {
    restaurant: RestaurantPreview;
};

export default function RestaurantPreviewCard({ restaurant }: Props) {
    const { accessToken, refreshAccessToken, isLoggedIn } = useAuth();
    const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
    const [savedCategoryCount, setSavedCategoryCount] = useState(0);
    const [bookmarkAnchorRect, setBookmarkAnchorRect] =
        useState<DOMRect | null>(null);
    
    useEffect(() => {
        if (!isLoggedIn || !restaurant.restaurantId) {
            setSavedCategoryCount(0);
            return;
        }

        async function loadSavedCount() {
            try {
                const statuses = await getBookmarkCategoryStatuses({
                    restaurantId: restaurant.restaurantId,
                    accessToken,
                    refreshAccessToken,
                });

                setSavedCategoryCount(
                    statuses.filter((status) => status.saved).length
                );
            } catch (error) {
                console.error(error);
                setSavedCategoryCount(0);
            }
        }

        loadSavedCount();
    }, [restaurant.restaurantId, isLoggedIn, accessToken, refreshAccessToken]);

    const isSaved = savedCategoryCount > 0;

    return (
        <>
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
                                <span
                                    className="rounded-full px-2 py-1 text-xs font-semibold"
                                    style={{
                                        backgroundColor: COLORS.PRIMARY_PALE,
                                        color: COLORS.PRIMARY,
                                    }}
                                >
                                    {restaurant.foodType}
                                </span>

                                <span
                                    className="rounded-full px-2 py-1 text-xs font-bold"
                                    style={{
                                        backgroundColor: COLORS.PRIMARY_LIGHT,
                                        color: COLORS.PRIMARY,
                                    }}
                                >
                                    맛집지수 {restaurant.foodScore ?? "--"}%
                                </span>
                            </div>

                            <h3 className="mt-2 line-clamp-2 text-lg font-bold text-gray-900">
                                {restaurant.placeName}
                            </h3>
                        </div>

                        <button
                            type="button"
                            aria-label="맛집 저장"
                            onClick={(event) => {
                                event.stopPropagation();
                                setBookmarkAnchorRect(
                                    event.currentTarget.getBoundingClientRect()
                                );
                                setIsBookmarkModalOpen(true);
                            }}
                            className="flex shrink-0 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs font-bold transition hover:bg-[#FFF3E8]"
                            style={{
                                color: isSaved ? COLORS.PRIMARY : "#9CA3AF",
                            }}
                        >
                            <Bookmark
                                size={22}
                                fill={isSaved ? COLORS.PRIMARY : "none"}
                                color={isSaved ? COLORS.PRIMARY : "#9CA3AF"}
                            />

                            <span className="whitespace-nowrap">
                                {isSaved
                                    ? savedCategoryCount > 1
                                        ? `저장됨(${savedCategoryCount})`
                                        : "저장됨"
                                    : "저장"}
                            </span>
                        </button>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Star
                                size={15}
                                fill={COLORS.WARNING}
                                color={COLORS.WARNING}
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

                    <div className="mt-3 space-y-1.5">
                        {restaurant.distance !== null && (
                            <div
                                className="flex items-center gap-1.5 text-xs font-semibold"
                                style={{ color: COLORS.PRIMARY }}
                            >
                                <Navigation size={14} className="shrink-0" />
                                <span>
                                    내 위치에서 {Math.round(restaurant.distance)}m
                                </span>
                            </div>
                        )}

                        <p className="text-xs leading-relaxed text-gray-500">
                            {restaurant.addressName}
                        </p>
                    </div>
                </div>
            </article>

            <BookmarkCategoryModal
                isOpen={isBookmarkModalOpen}
                restaurantId={restaurant.restaurantId}
                anchorRect={bookmarkAnchorRect}
                onClose={() => setIsBookmarkModalOpen(false)}
                onChange={(count) => setSavedCategoryCount(count)}
            />
        </>
    );
}