//common
import {
    ArrowLeft,
    MapPin,
    Share2,
    Star,
    UtensilsCrossed,
    Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { RestaurantInfoResponse } from "@/features/restaurant/model/restaurantTypes";
import ErrorView from "@/shared/ui/ErrorView";
import LoadingView from "@/shared/ui/LoadingView";
import { toast } from 'sonner';
import { useIsMobile } from '@/shared/hooks/useIsMobile';

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
        restaurant.distance !== null ? `내 위치에서 ${Math.round(restaurant.distance)}m` : null;

    const foodScoreText =
        restaurant.foodScore !== null ? `${restaurant.foodScore}%` : "-";

    const averageScoreText =
        restaurant.averageScore !== null
            ? restaurant.averageScore.toFixed(1)
            : "-";
    
    const handleCopyPhone = async () => {
        const phone = restaurant?.phone;
    
        if (!phone) {
            toast.error("복사할 전화번호가 없습니다.");
            return;
        }
    
        await navigator.clipboard.writeText(phone);
        toast.success("전화번호가 복사되었습니다.");
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

                        {/* 이미지가 있을 때만 상단 버튼 가독성을 위한 오버레이 */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />
                    </>
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                        {/* 음식점 기본 아이콘 */}
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
                    className={`absolute left-4 top-6 flex h-10 w-10 items-center justify-center rounded-full active:scale-95`}
                >
                    <ArrowLeft
                        size={22}
                        className="text-gray-800"
                    />
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
                                // 사용자가 공유를 취소한 경우는 무시
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
                    className="absolute right-4 top-6 flex h-10 w-10 items-center justify-center rounded-full active:scale-95"
                >
                    <Share2 size={20} className="text-gray-800" />
                </button>
            </div>

            {/* 음식점 기본 정보 */}
            <div className="relative z-10 -mt-8 rounded-t-[32px] bg-white px-6 pt-8">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        {/* 음식점 이름 */}
                        <h1 className="line-clamp-2 text-[28px] font-extrabold leading-tight text-gray-900">
                            {restaurant.placeName}
                        </h1>

                        {/* 음식 카테고리 */}
                        <div className="mt-3">
                            <span className="text-base font-semibold text-gray-700">
                                {restaurant.foodType}
                            </span>
                        </div>
                    </div>

                    {/* 맛집 지수 */}
                    <div className="flex shrink-0 flex-col items-center">
                        <div className="text-[32px] font-black leading-none text-[#ff6b00]">
                            {foodScoreText}
                        </div>

                        <div className="mt-1 text-xs font-semibold text-gray-500">
                            맛집지수
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-gray-500">
                    {/* 위치 */}
                    <MapPin size={17} />

                    {distanceText ? (
                        <span>{distanceText}</span>
                    ) : (
                        <span>위치 정보 없음</span>
                    )}

                    <span className="text-gray-300">·</span>

                    {/* 전화번호 */}
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

                {/* 태그 */}
                {restaurant.topTags.length > 0 && (
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
                    {restaurant.reviewCount > 0 ? (
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
        </section>
    );
};

export default RestaurantCommon;