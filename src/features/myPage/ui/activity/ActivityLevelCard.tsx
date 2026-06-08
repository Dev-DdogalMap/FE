import type { LevelInfo } from "../../model/myPageTypes";
import { COLORS } from "@/shared/constants/colors";

type Props = {
    level: LevelInfo;
};

const ActivityLevelCard = ({ level }: Props) => {
    const progressPercent = Math.min(
        Math.max(level.progressPercent, 0),
        100,
    );

    return (
        <div
        className="rounded-3xl p-5 shadow-sm"
        style={{
            backgroundColor: COLORS.PRIMARY_PALE,
        }}
        >
        <p
            className="text-sm font-semibold"
            style={{
            color: COLORS.PRIMARY,
            }}
        >
            현재 맛집 레벨
        </p>

        <p className="mt-1 break-keep text-xl font-bold text-gray-900">
            Lv.{level.currentLevel} {level.currentLevelName}
        </p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
            <div
            className="h-full rounded-full transition-all"
            style={{
                width: `${progressPercent}%`,
                backgroundColor: COLORS.PRIMARY,
            }}
            />
        </div>

        <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>{level.currentExp} EXP</span>

            <span>
            다음 레벨까지 {level.remainingExpToNextLevel} EXP
            </span>
        </div>
        </div>
    );
};

export default ActivityLevelCard;