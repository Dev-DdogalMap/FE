import { ChevronDown, SlidersHorizontal } from "lucide-react";

interface ChatFiltersProps {
  keyword: string;
  category: string;
  categoryOptions: string[];
  minLevel: number;
  onKeywordChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onMinLevelChange: (value: number) => void;
}

const filterButtonClass =
  "flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700";

const filterLabelClass = "text-xs font-semibold text-gray-400";

export default function ChatFilters({
  keyword,
  category,
  categoryOptions,
  minLevel,
  onKeywordChange,
  onCategoryChange,
  onMinLevelChange,
}: ChatFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <input
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="동네 또는 맛잘알 검색"
          className="w-full px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <label className={filterButtonClass}>
          <span className={filterLabelClass}>카테고리</span>
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="appearance-none bg-transparent pr-1 text-sm outline-none"
          >
            <option value="전체">전체</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </label>

        <label className={filterButtonClass}>
          <span className={filterLabelClass}>레벨</span>
          <select
            value={minLevel}
            onChange={(event) =>
              onMinLevelChange(Number(event.target.value))
            }
            className="appearance-none bg-transparent pr-1 text-sm outline-none"
          >
            <option value={10}>10 이상</option>
            <option value={9}>9 이상</option>
            <option value={8}>8 이상</option>
            <option value={7}>7 이상</option>
            <option value={6}>6 이상</option>
            <option value={5}>5 이상</option>
            <option value={4}>4 이상</option>
            <option value={3}>3 이상</option>
            <option value={2}>2 이상</option>
            <option value={1}>1 이상</option>
          </select>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </label>

        <button type="button" className={filterButtonClass}>
          <SlidersHorizontal className="h-4 w-4 text-[#ff4b0b]" />
          필터
        </button>
      </div>
    </div>
  );
}
