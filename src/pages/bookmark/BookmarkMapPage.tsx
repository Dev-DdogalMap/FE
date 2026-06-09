import BookmarkCategoryTabs from "@/features/bookmark/ui/BookmarkCategoryTabs";
import BookmarkMap from "@/features/bookmark/ui/BookmarkMap";
import BookmarkRestaurantList from "@/features/bookmark/ui/BookmarkRestaurantList";

import { useBookmarkMap } from "@/features/bookmark/hooks/useBookmarkMap";
import { useNavigate, useParams } from "react-router-dom";

const BookmarkMapPage = () => {
    const { bookmarkCategoryId } = useParams();
    const navigate = useNavigate();

    const {
        categories,
        restaurants,
        selectedCategoryId,
        // sort,
        // setSort,
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
        <div className="flex flex-col h-screen overflow-hidden">
            
            <BookmarkMap restaurants={restaurants} />

            <div className="flex-1 bg-white rounded-t-3xl -mt-4 z-10 flex flex-col min-h-0">
                
                <div className="shrink-0">
                    <BookmarkCategoryTabs
                        categories={categories}
                        selectedCategoryId={selectedCategoryId}
                        onSelect={handleCategoryChange}
                        // sort={sort}
                        // onSortChange={setSort}
                    />
                </div>

                <div className="flex-1 overflow-y-auto pb-4">
                    <BookmarkRestaurantList restaurants={restaurants} />
                </div>
                
            </div>
        </div>
    );
};

export default BookmarkMapPage;