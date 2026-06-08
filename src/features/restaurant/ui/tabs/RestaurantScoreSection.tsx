import { Heart, CheckCircle, MessageSquare, Star, Users } from "lucide-react";

import type { RestaurantInfoResponse } from "../../model/restaurantTypes";

type Props = {
    restaurant: RestaurantInfoResponse | null;
};

/** 비율 (0~100) → "98%" 또는 "-" */
const formatPercent = (value: number | null) => {
    if (value === null || value === 0) return "-";
    return `${value}%`;
};

/** 카운트 → "1.2k" 또는 "-" */
const formatCount = (count: number | null | undefined) => {
    // count가 undefined로 들어와도 안전하게 "-"를 반환하도록 수정
    if (count === null || count === undefined || count === 0) return "-";
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
};

/** 별점 (0~5) → "4.6/5" 또는 "-" */
const formatScore = (value: number | null) => {
    if (value === null || value === 0) return "-";
    return `${value.toFixed(1)}/5`;
};

const RestaurantScoreSection = ({ restaurant }: Props) => {
    if (!restaurant) return null;

    const averageScore = restaurant.averageScore;
    const items = [
        {
            icon: <Heart size={22} fill="#EF4444" className="text-red-500" />,
            bg: "bg-red-50",
            progressColor: "bg-red-500",
            value: formatPercent(restaurant.residentRecommendRate),
            progress: restaurant.residentRecommendRate ?? 0,
            label: "주민 추천 비율",
            description: "동네 주민 추천",
        },
        {
            icon: <CheckCircle size={22} className="text-green-500" />,
            bg: "bg-green-50",
            progressColor: "bg-green-500",
            value: formatPercent(restaurant.revisitRate),
            progress: restaurant.revisitRate ?? 0,
            label: "재방문율",
            description: "재방문 의사",
        },
        {
            icon: <MessageSquare size={22} fill="#3B82F6" className="text-blue-500" />,
            bg: "bg-blue-50",
            progressColor: "bg-blue-500",
            value: formatCount(restaurant.visitVerifyCount),
            progress: 0,
            label: "방문 인증 수",
            description: "실제 방문 인증",
        },
        {
            icon: <Star size={22} fill="#F97316" className="text-orange-500" />,
            bg: "bg-orange-50",
            progressColor: "bg-orange-500",
            value: formatScore(averageScore),
            progress: averageScore ? (averageScore / 5) * 100 : 0,
            label: "후기 품질",
            description: "별점 평균",
        },
        {
            icon: <Users size={22} className="text-purple-500" />,
            bg: "bg-purple-50",
            progressColor: "bg-purple-500",
            value: formatCount(restaurant.bookmarkCount),
            progress: 0,
            label: "즐겨찾기 수",
            description: "사용자 저장",
        },
    ];

    return (
        <section className="px-4 py-6">
            <div className="mb-4 flex items-center gap-1">
                <h3 className="text-lg font-bold">찐 맛집 지수</h3>
                <span className="text-xs text-gray-400">ⓘ</span>
            </div>

            <div className="grid grid-cols-5 gap-1">
                {items.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-full ${item.bg}`}
                        >
                            {item.icon}
                        </div>
                        <div className="mt-2 text-sm font-bold">{item.value}</div>
                        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                                className={`h-full ${item.progressColor}`}
                                style={{ width: `${Math.min(item.progress, 100)}%` }}
                            />
                        </div>
                        <div className="mt-2 text-[11px] font-medium text-gray-700">
                            {item.label}
                        </div>
                        <div className="mt-0.5 text-[10px] text-gray-400">
                            {item.description}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RestaurantScoreSection;
