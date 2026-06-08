import { Medal } from "lucide-react";

import type { Badge } from "../../model/myPageTypes";

type RepresentativeBadgeCardProps = {
  badge: Badge | null;
  onChangeClick: () => void;
};

const RepresentativeBadgeCard = ({
  badge,
  onChangeClick,
}: RepresentativeBadgeCardProps) => {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
            대표 배지
            </p>

        <button
            type="button"
            onClick={onChangeClick}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 transition active:scale-95"
            >
            {badge ? "변경" : "설정"}
            </button>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50">
            {badge ? (
                <img
                src={badge.iconImage}
                alt={badge.name}
                className="h-16 w-16 object-contain"
                />
            ) : (
                <Medal size={36} className="text-gray-400" />
            )}
        </div>

        <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-400">
                현재 설정된 대표 배지
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
                {badge?.name ?? "대표 배지 없음"}
            </p>

            {!badge && (
                <p className="mt-1 text-xs text-gray-400">
                대표 배지를 설정해보세요.
                </p>
            )}
            </div>
        </div>
    </div>
  );
};

export default RepresentativeBadgeCard;