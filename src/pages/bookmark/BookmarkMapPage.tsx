import BookmarkCategoryTabs from "@/features/bookmark/ui/BookmarkCategoryTabs";
import BookmarkMap from "@/features/bookmark/ui/BookmarkMap";
import BookmarkRestaurantList from "@/features/bookmark/ui/BookmarkRestaurantList";

import { useBookmarkMap } from "@/features/bookmark/hooks/useBookmarkMap";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const BookmarkMapPage = () => {
    const { bookmarkCategoryId } = useParams();
    const navigate = useNavigate();

    const {
        categories,
        restaurants,
        listRestaurants,
        selectedCategoryId,
        sort,
        setSort,
        selectCategory,
    } = useBookmarkMap(
        bookmarkCategoryId ? Number(bookmarkCategoryId) : undefined
    );

    const handleCategoryChange = (categoryId: number) => {
        selectCategory(categoryId);
        navigate(`/bookmark-map/${categoryId}`);
    };

    if (!selectedCategoryId) {
        return null;
    }

    return (
        <div className="relative flex flex-col h-screen overflow-hidden">
            {/* 뒤로 가기 버튼 */}
            <button
                onClick={() => navigate(-1)}
                aria-label="뒤로 가기"
                className="absolute left-4 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md"
            >
                <ArrowLeft size={22} className="text-gray-900" />
            </button>

            <BookmarkMap restaurants={restaurants} />

            <div className="flex-1 bg-white rounded-t-3xl -mt-4 z-10 flex flex-col min-h-0">
                <div className="shrink-0">
                    <BookmarkCategoryTabs
                        categories={categories}
                        selectedCategoryId={selectedCategoryId}
                        onSelect={handleCategoryChange}
                        sort={sort}
                        onSortChange={setSort}
                    />
                </div>

                <div className="flex-1 overflow-y-auto pb-4">
                    <BookmarkRestaurantList restaurants={listRestaurants} />  
                </div>
            </div>
        </div>
    );
};

export default BookmarkMapPage;