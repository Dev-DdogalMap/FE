import { ChevronDown, SlidersHorizontal } from "lucide-react";

interface ChatFiltersProps {
  keyword: string;
  region: string;
  category: string;
  categoryOptions: string[];
  minLevel: number;
  onKeywordChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onMinLevelChange: (value: number) => void;
}

const filterButtonClass =
  "flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700";

export default function ChatFilters({
  keyword,
  region,
  category,
  categoryOptions,
  minLevel,
  onKeywordChange,
  onRegionChange,
  onCategoryChange,
  onMinLevelChange,
}: ChatFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <input
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="맛집명 또는 맛잘알 검색"
          className="w-full px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <label className={filterButtonClass}>
          <select
            value={region}
            onChange={(event) => onRegionChange(event.target.value)}
            className="appearance-none bg-transparent pr-1 text-sm outline-none"
          >
            <option value="성수동">성수동</option>
            <option value="전체">전체</option>
          </select>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </label>

        <label className={filterButtonClass}>
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
          <select
            value={minLevel}
            onChange={(event) =>
              onMinLevelChange(Number(event.target.value))
            }
            className="appearance-none bg-transparent pr-1 text-sm outline-none"
          >
            <option value={5}>레벨 5 이상</option>
            <option value={4}>레벨 4 이상</option>
            <option value={3}>레벨 3 이상</option>
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
