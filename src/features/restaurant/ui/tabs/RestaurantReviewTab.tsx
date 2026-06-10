import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {useAuth} from "@/shared/auth/AuthContext.tsx";
import { toast } from "sonner";

interface ReviewResponse {
    reviewId: number;
    nickname?: string;
    userLevel?: number;
    isLocal?: boolean;
    score: number;
    createdAt: string;
    content: string;
    imageUrls: string[];
    tags: string[];
    likeCount: number;
    restaurantName: string;
}

interface RestaurantReviewTabProps {
    restaurantId: number;
}

const RestaurantReviewTab = ({ restaurantId }: RestaurantReviewTabProps) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [onlyPhotos, setOnlyPhotos] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<string>("createdAt,desc");

    const { accessToken } = useAuth();

    // 무한 스크롤 관련 상태
    const pageRef = useRef<number>(0);
    const [hasNext, setHasNext] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [isFetchingNext, setIsFetchingNext] = useState<boolean>(false);

    // 바닥 감지용 레퍼런스
    const observerRef = useRef<HTMLDivElement | null>(null);

    // 데이터 패칭 로직
    const fetchReviews = useCallback(async (currentPage: number, isReset: boolean = false) => {
        if (isReset) {
            setLoading(true);
            setHasNext(true);
        } else {
            setIsFetchingNext(true);
        }

        try {
            const [sortField, direction] = sortOrder.split(",");
            const response = await axios.get(
                `${API_BASE_URL}/api/restaurants/${restaurantId}/reviews`,
                {
                    params: {
                        page: currentPage,
                        size: 10,
                        sort: `${sortField},${direction}`,
                        hasImage: onlyPhotos
                    }
                }
            );

            const fetchedContent = response.data.content || response.data;
            const hasNextPage = !response.data.last;

            setReviews(isReset ? fetchedContent : (prev) => [...prev, ...fetchedContent]);
            setHasNext(hasNextPage);
        } catch (error) {
            console.error("리뷰 목록을 불러오지 못했습니다.", error);
        } finally {
            if (isReset) setLoading(false);
            else setIsFetchingNext(false);
        }
    }, [restaurantId, onlyPhotos, sortOrder, API_BASE_URL]);

    // 상태 초기화 및 데이터 호출
    useEffect(() => {
        pageRef.current = 0;
        const timer = setTimeout(() => {
            fetchReviews(0, true);
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchReviews]);

    // Intersection Observer 무한 스크롤 감지
    useEffect(() => {
        if (!hasNext || loading || isFetchingNext) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    pageRef.current += 1;
                    fetchReviews(pageRef.current, false);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasNext, loading, isFetchingNext, fetchReviews]);

    const handleLike = async (reviewId: number) => {
        if (!accessToken) {
            toast.info("로그인이 필요한 기능입니다.");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/review/${reviewId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setReviews(prev =>
                prev.map(review =>
                    review.reviewId === reviewId
                        ? { ...review, likeCount: review.likeCount + 1 }
                        : review
                )
            );
        } catch (error) {
            console.error("좋아요 등록에 실패했습니다.", error);
        }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {/* 1. 필터 및 정렬 바 구역 */}
            <div className="flex items-center justify-between border-b pb-3 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 border rounded-full bg-white hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        필터
                    </button>

                    <button
                        onClick={() => {
                            setOnlyPhotos(!onlyPhotos);
                            pageRef.current = 0;
                        }}
                        className={`px-3 py-1.5 border rounded-full font-medium transition-colors ${
                            onlyPhotos
                                ? "border-orange-500 bg-orange-50 text-orange-600"
                                : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        사진 후기만
                    </button>
                </div>

                <div className="relative">
                    <select
                        value={sortOrder}
                        onChange={(e) => {
                            setSortOrder(e.target.value);
                            pageRef.current = 0;
                        }}
                        className="appearance-none bg-white border rounded-lg px-3 py-1.5 pr-8 font-medium text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <option value="createdAt,desc">최신순</option>
                        <option value="createdAt,asc">오래된순</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* 2. 리뷰 리스트 출력 구역 */}
            {loading ? (
                <div className="text-center py-10 text-gray-400">리뷰를 불러오는 중입니다...</div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-10 text-gray-400">등록된 리뷰가 없습니다.</div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.reviewId} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

                            {/* 상단 프로필 및 우측 더보기 버튼 구역 */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                                        <div className="w-full h-full bg-gray-300" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-800">
                                            {review.nickname || "익명 유저"}
                                        </div>
                                        <div className="text-xs text-green-600 font-medium mt-0.5">
                                            Lv.{review.userLevel ?? 1} · {review.isLocal ? '로컬' : '미식가'}
                                        </div>
                                    </div>
                                </div>
                                {/* 우측 더보기 버튼 (...) */}
                                <button className="text-gray-400 hover:text-gray-600 p-1">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM14 10a2 2 0 11-4 0 2 2 0 014 0zM22 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </button>
                            </div>

                            {/* 별점, 날짜, 방문인증 배지 구역 */}
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                <span className="text-orange-500 font-bold flex items-center gap-0.5">
                                    ★ {review.score.toFixed(1)}
                                </span>
                                <span className="text-gray-200">|</span>
                                <span>{review.createdAt.split('T')[0]}</span>
                                <span className="text-gray-200">|</span>
                                <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-green-100">
                                    방문 인증
                                </span>
                            </div>

                            {/* 태그 구역 */}
                            {review.tags && review.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {review.tags.slice(0, 5).map((tag, idx) => (
                                        <span key={idx} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-100">
                                            #{tag}
                                        </span>
                                    ))}
                                    {review.tags.length > 5 && (
                                        <span className="text-xs text-gray-400">...</span>
                                    )}
                                </div>
                            )}

                            {/* 리뷰 본문 텍스트 */}
                            <p className="text-sm text-gray-700 mb-4 whitespace-pre-line leading-relaxed">
                                {review.content}
                            </p>

                            {/* 가로 스크롤 리뷰 이미지 */}
                            {review.imageUrls && review.imageUrls.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-4">
                                    {review.imageUrls.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url.startsWith('http') ? url : `${API_BASE_URL}${url}`}
                                            alt={`리뷰 이미지 ${idx + 1}`}
                                            className="w-28 h-28 object-cover rounded-xl flex-shrink-0 border border-gray-100 bg-gray-50"
                                        />
                                    ))}
                                </div>
                            )}

                            {/* 하단 좋아요 / 댓글 버튼 구역 */}
                            <div className="flex items-center gap-4 text-xs text-gray-400 pt-3 border-t border-gray-50">
                                <button
                                    onClick={() => handleLike(review.reviewId)} // 💡 클릭 이벤트 바인딩
                                    className="flex items-center gap-1 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.757a1 1 0 01.707 1.707l-5.414 5.414a1 1 0 01-.707.293H10M3 10h3v10H3V10z" />
                                    </svg>
                                    <span>좋아요 {review.likeCount ?? 0}</span> {/* 💡 하드코딩 제거 */}
                                </button>
                            </div>

                        </div>
                    ))}

                    {/* 무한 스크롤 타겟 감지 포인트 */}
                    <div ref={observerRef} className="h-4" />

                    {/* 스크롤 하단 추가 로딩 */}
                    {isFetchingNext && (
                        <div className="text-center py-4 text-sm text-gray-400">
                            추가 리뷰를 불러오는 중입니다...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RestaurantReviewTab;