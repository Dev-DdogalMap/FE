import type { BadgeDetail } from "../../model/myPageTypes";

type Props = {
    badges: BadgeDetail[];
};

const BadgeGrid = ({ badges }: Props) => {
    const acquiredCount = badges.filter((badge) => badge.acquired).length;

    return (
        <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">전체 배지</p>

            <span className="text-xs text-gray-400">
            {acquiredCount}/{badges.length}
            </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => (
            <div
                key={badge.badgeId}
                className={`flex min-h-28 flex-col items-center justify-center rounded-2xl px-2 py-3 ${
                badge.acquired ? "bg-gray-50" : "bg-gray-50 opacity-40"
                }`}
            >
                <img
                src={badge.iconImage}
                alt={badge.name}
                className="h-20 w-20 object-contain"
                />

                {!badge.acquired && (
                <p className="mt-2 text-[10px] text-gray-500">
                    {badge.remainingCount}회 남음
                </p>
                )}
            </div>
            ))}
        </div>
        </div>
    );
};

export default BadgeGrid;