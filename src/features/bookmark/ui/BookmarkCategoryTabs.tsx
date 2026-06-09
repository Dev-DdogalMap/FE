import type { BookmarkCategory } from '../model/bookmarkTypes';

interface Props {
  categories: BookmarkCategory[];
  selectedCategoryId: number;
  onSelect: (categoryId: number) => void;
}

export default function BookmarkCategoryTabs({ categories, selectedCategoryId, onSelect }: Props) {
  const selectedCategory = categories.find(c => c.bookmarkCategoryId === selectedCategoryId);

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
        {/* 폴더 변경 필터 (콤보박스) */}
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

        {/* 정렬 필터 */}
        <select className="text-gray-600 text-xs py-1.5 border-none outline-none cursor-pointer bg-transparent">
          <option>최신 순</option>
          <option>찐맛집지수 순</option>
          <option>별점 순</option>
          <option>리뷰개수 순</option>
        </select>
      </div>
    </div>
  );
}