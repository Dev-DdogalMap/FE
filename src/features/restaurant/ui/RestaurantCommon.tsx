import type { RestaurantInfoResponse } from "@/features/restaurant/model/restaurantTypes";
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import ErrorView from "@/shared/ui/ErrorView";
import LoadingView from "@/shared/ui/LoadingView";
import { ArrowLeft, Info, MapPin, Phone, Share2, Star, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

interface Props {
    restaurant: RestaurantInfoResponse | null;
    loading: boolean;
}

interface TagProps {
    text: string;
}

const Tag = ({ text }: TagProps) => {
    return (
        <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-[#ff6b00]">
            {text}
        </div>
    );
};

const RestaurantCommon = ({ restaurant, loading }: Props) => {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    // 맛집지수 산식 설명 모달 표시 여부
    const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

    if (loading) {
        return (
            <LoadingView
                heightClassName="min-h-[360px]"
                title="음식점 정보를 불러오는 중이에요"
                description={"맛집 정보를\n준비하고 있습니다"}
            />
        );
    }

    if (!restaurant) {
        return (
            <ErrorView
                heightClassName="min-h-[360px]"
                title="음식점 정보를 불러오지 못했어요"
                description="잠시 후 다시 시도해주세요"
            />
        );
    }

    const hasImage = !!restaurant.imageUrl;

    const distanceText =
        restaurant.distance != null ? `내 위치에서 ${Math.round(restaurant.distance)}m` : null;

    const isFoodScoreCalculating =
        restaurant.foodScore === null || restaurant.foodScore === 0;
    const foodScoreText = isFoodScoreCalculating
        ? "계산중"
        : `${restaurant.foodScore}%`;

    const averageScoreText =
        restaurant.averageScore?.toFixed(1) ?? "-";

    const handleCopyPhone = async () => {
        if (!restaurant.phone) {
            return;
        }

        try {
            if (!navigator.clipboard) {
                throw new Error("Clipboard API is not supported");
            }

            await navigator.clipboard.writeText(restaurant.phone);

            toast.success("전화번호가 복사되었습니다.");
        } catch (error) {
            console.error("전화번호 복사 실패:", error);
            toast.error("전화번호를 복사하지 못했습니다.");
        }
    };

    return (
        <section>
            {/* 대표 이미지 */}
            <div className="relative h-[280px] overflow-hidden bg-orange-50">
                {hasImage ? (
                    <>
                        <img
                            src={restaurant.imageUrl!}
                            alt={restaurant.placeName}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />
                    </>
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
                            <UtensilsCrossed size={36} className="text-[#ff6b00]" />
                        </div>

                        <p className="mt-4 text-base font-semibold text-gray-700">
                            등록된 사진이 없습니다
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            음식점 정보를 준비 중이에요
                        </p>
                    </div>
                )}

                {/* 뒤로 가기 버튼 */}
                <button
                    onClick={() => navigate(-1)}
                    aria-label="뒤로 가기"
                    className="absolute left-4 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm"
                >
                    <ArrowLeft size={22} className="text-gray-900" />
                </button>

                {/* 공유 버튼 */}
                <button
                    onClick={async () => {
                        const shareData = {
                            title: restaurant.placeName,
                            url: window.location.href,
                        };

                        if (navigator.share) {
                            try {
                                await navigator.share(shareData);
                            } catch (error) {
                                if (error instanceof Error && error.name === 'AbortError') {
                                    return;
                                }
                                console.error('공유 실패:', error);
                            }
                        } else {
                            try {
                                await navigator.clipboard.writeText(window.location.href);
                                toast.success('링크가 복사되었습니다!');
                            } catch (error) {
                                console.error('클립보드 복사 실패:', error);
                                toast.error('복사에 실패했습니다');
                            }
                        }
                    }}
                    aria-label="공유하기"
                    className="absolute right-4 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm"
                >
                    <Share2 size={20} className="text-gray-900" />
                </button>
            </div>

            {/* 음식점 기본 정보 */}
            <div className="relative z-10 -mt-8 rounded-t-[32px] bg-white px-6 pt-8">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h1 className="line-clamp-2 text-[28px] font-extrabold leading-tight text-gray-900">
                            {restaurant.placeName}
                        </h1>

                        <div className="mt-3">
                            <span className="text-base font-semibold text-gray-700">
                                {restaurant.foodType}
                            </span>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-center">
                        {isFoodScoreCalculating ? (
                            <>
                                <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                                    맛집지수
                                    <button
                                        type="button"
                                        onClick={() => setIsScoreModalOpen(true)}
                                        aria-label="맛집지수 계산 방식"
                                        className="flex items-center justify-center"
                                    >
                                        <Info size={12} className="text-gray-400" />
                                    </button>
                                </div>
                                <div className="mt-1 text-[32px] font-black leading-none text-[#ff6b00]">
                                    {foodScoreText}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-[32px] font-black leading-none text-[#ff6b00]">
                                    {foodScoreText}
                                </div>
                                <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-gray-500">
                                    맛집지수
                                    <button
                                        type="button"
                                        onClick={() => setIsScoreModalOpen(true)}
                                        aria-label="맛집지수 계산 방식"
                                        className="flex items-center justify-center"
                                    >
                                        <Info size={12} className="text-gray-400" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-gray-500">
                    <MapPin size={17} />

                    {distanceText ? (
                        <span>{distanceText}</span>
                    ) : (
                        <span>위치 정보 없음</span>
                    )}

                    <span className="text-gray-300">·</span>

                    <Phone size={15} />

                    {restaurant.phone ? (
                        isMobile ? (
                            <a
                                href={`tel:${restaurant.phone}`}
                                className="transition-colors hover:text-[#FF6B00]"
                            >
                                {restaurant.phone}
                            </a>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCopyPhone}
                                className="cursor-pointer transition-colors hover:text-[#FF6B00]"
                            >
                                {restaurant.phone}
                            </button>
                        )
                    ) : (
                        <span className="text-gray-400">등록된 전화번호 없음</span>
                    )}
                </div>

                {/* 태그 (💡 undefined 방어 코드 적용) */}
                {restaurant.topTags && restaurant.topTags.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-2">
                        {restaurant.topTags.map((tag) => (
                            <Tag
                                key={tag}
                                text={tag}
                            />
                        ))}
                    </div>
                )}

                {/* 평점 */}
                <div className="mt-5 flex items-center gap-2 text-sm">
                    {(restaurant.reviewCount ?? 0) > 0 ? (
                        <>
                            <Star
                                size={16}
                                fill="#ff8a00"
                                color="#ff8a00"
                            />

                            <span className="font-semibold text-gray-900">
                                {averageScoreText}
                            </span>

                            <span className="text-gray-500">
                                ({restaurant.reviewCount})
                            </span>
                        </>
                    ) : (
                        <>
                            <Star
                                size={16}
                                color="#d1d5db"
                            />

                            <span className="text-gray-500">
                                아직 등록된 후기가 없어요
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* 맛집지수 산식 안내 모달 */}
            {isScoreModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() => setIsScoreModalOpen(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl bg-white p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-gray-900">맛집지수 계산 방식</h3>

                        <p className="mt-3 text-sm text-gray-700">
                            맛집지수는 다음 세 가지 항목으로 계산됩니다.
                        </p>

                        <ul className="mt-3 space-y-3 text-sm text-gray-700">
                            <li>
                                <div className="font-bold">주민 평점 × 40%</div>
                                <div className="text-xs text-gray-500">
                                    동네 인증 주민이 준 별점 (사용자 레벨 가중 평균)
                                </div>
                            </li>
                            <li>
                                <div className="font-bold">재방문율 × 35%</div>
                                <div className="text-xs text-gray-500">
                                    재방문 의향 후기 비율
                                </div>
                            </li>
                            <li>
                                <div className="font-bold">비주민 평점 × 25%</div>
                                <div className="text-xs text-gray-500">
                                    동네 외 사용자가 준 별점 (사용자 레벨 가중 평균)
                                </div>
                            </li>
                        </ul>

                        <p className="mt-4 text-xs text-gray-500">
                            활동량(레벨)이 높은 사용자의 평점에 더 큰 비중을 둡니다.
                        </p>

                        <button
                            type="button"
                            onClick={() => setIsScoreModalOpen(false)}
                            className="mt-6 h-12 w-full rounded-xl bg-[#ff6b00] font-bold text-white"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default RestaurantCommon;