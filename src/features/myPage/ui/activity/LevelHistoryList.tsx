import type { LevelHistory } from "../../model/myPageTypes";
import { COLORS } from "@/shared/constants/colors";

type Props = {
    histories: LevelHistory[];
};

const LevelHistoryList = ({ histories }: Props) => {
    return (
        <div className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-gray-700">
            최근 경험치 내역
        </p>

        <div className="space-y-3">
            {histories.map((history) => (
            <div
                key={history.historyId}
                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-none"
            >
                <div>
                <p className="font-medium text-gray-900">
                    {history.activityName}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                    Lv.{history.level} {history.levelName}
                </p>
                </div>

                <div className="text-right">
                <p
                    className="font-bold"
                    style={{
                    color: COLORS.SUCCESS,
                    }}
                >
                    +{history.expAmount} EXP
                </p>

                <p className="mt-1 text-xs text-gray-400">
                    {new Date(history.createdAt).toLocaleString("ko-KR", {
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        })
                    }
                </p>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export default LevelHistoryList;