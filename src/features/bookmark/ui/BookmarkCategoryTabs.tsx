import type { BookmarkCategory, BookmarkSortType } from '../model/bookmarkTypes';

interface Props {
    categories: BookmarkCategory[];
    selectedCategoryId: number;
    onSelect: (categoryId: number) => void;
    sort: BookmarkSortType;
    onSortChange: (sort: BookmarkSortType) => void;
}

export default function BookmarkCategoryTabs({ categories, selectedCategoryId, onSelect, sort, onSortChange }: Props) {
    const selectedCategory = categories.find(c => c.bookmarkCategoryId === selectedCategoryId);

    const sortOptions = [
        { label: "최신 순", value: "LATEST" },
        { label: "찐맛집지수 순", value: "FOOD_SCORE" },
        { label: "별점 높은 순", value: "RATING" },
        { label: "리뷰 많은 순", value: "REVIEW_COUNT" },
    ];

    return (
        <div className="flex justify-between items-center px-5 py-4 bg-white rounded-t-3xl">
            <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-gray-800">
                    {selectedCategory?.bookmarkCategoryName || '내 맛집 리스트'}
                </h2>
                <span className="text-orange-500 font-bold text-lg">
                    {selectedCategory?.bookmarkCount || 0}
                </span>
            </div>

            <div className="flex items-center space-x-2">
                {/* 폴더 변경 필터 */}
                <select
                    className="bg-gray-100 text-gray-600 text-xs px-2 py-1.5 rounded-md border-none outline-none cursor-pointer"
                    value={selectedCategoryId}
                    onChange={(e) => onSelect(Number(e.target.value))}
                >
                    {categories.map(category => (
                        <option key={category.bookmarkCategoryId} value={category.bookmarkCategoryId}>
                            {category.bookmarkCategoryName}
                        </option>
                    ))}
                </select>
                &nbsp;&nbsp;&nbsp;

                {/* 정렬 필터 */}
                <select
                    className="text-gray-600 text-xs py-1.5 border-none outline-none cursor-pointer bg-transparent"
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value as BookmarkSortType)}
                >
                    {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}