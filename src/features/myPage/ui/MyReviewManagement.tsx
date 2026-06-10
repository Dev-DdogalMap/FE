import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext.tsx";
import axios from "axios";

// --- Interfaces ---
interface ReviewResponse {
    reviewId: number;
    nickname?: string;
    userLevel?: number;
    userLevelName?: string;
    isLocal?: boolean;
    score: number;
    createdAt: string;
    content: string;
    imageUrls: string[];
    tags: string[];
    likeCount: number;
    commentCount: number;
    restaurantName: string;
    isRevisit: boolean;
}

interface UnwrittenReviewResponse {
    visitVerificationId: number;
    restaurantId: number;
    restaurantName: string;
    category: string;
    address: string;
    visitDate: string;
    daysRemaining: number; // 💡 1. 백엔드 DTO와 맞추어 남은 일수 필드 추가
}

const MyReviewManagement = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { accessToken, isLoading: isAuthLoading } = useAuth();
    const navigate = useNavigate();

    // 1. 작성한 후기 상태 관리
    const [writtenReviews, setWrittenReviews] = useState<ReviewResponse[]>([]);
    const [writtenCount, setWrittenCount] = useState(0);
    const [writtenPage, setWrittenPage] = useState(0);
    const [hasMoreWritten, setHasMoreWritten] = useState(true);
    const [sortOrder, setSortOrder] = useState<string>("createdAt,desc");

    // 2. 미작성 후기 상태 관리
    const [unwrittenReviews, setUnwrittenReviews] = useState<UnwrittenReviewResponse[]>([]);
    const [unwrittenCount, setUnwrittenCount] = useState(0);
    const [unwrittenPage, setUnwrittenPage] = useState(0);
    const [hasMoreUnwritten, setHasMoreUnwritten] = useState(true);

    const [loading, setLoading] = useState(true);

    // --- API 통신: 작성한 후기 가져오기 ---
    const fetchWrittenReviews = useCallback(async (page: number, isReset: boolean = false) => {
        if (!accessToken) return;

        try {
            const [sortField, direction] = sortOrder.split(",");

            const response = await axios.get(`${API_BASE_URL}/api/my/reviews`, {
                params: { page, size: 5, sort: `${sortField},${direction}` },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const { content, last, totalElements } = response.data;

            setWrittenReviews(prev => isReset ? content : [...prev, ...content]);
            setHasMoreWritten(!last);
            setWrittenCount(totalElements);
        } catch (error) {
            console.error("작성한 후기를 불러오는 데 실패했습니다.", error);
        }
    }, [sortOrder, API_BASE_URL, accessToken]);

    // --- API 통신: 미작성 후기 가져오기 ---
    const fetchUnwrittenReviews = useCallback(async (page: number, isReset: boolean = false) => {
        if (!accessToken) return;

        try {
            const [, direction] = sortOrder.split(",");

            const response = await axios.get(`${API_BASE_URL}/api/my/unwritten-reviews`, {
                params: {
                    page,
                    size: 5,
                    sort: `verifiedAt,${direction}`
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const { content, last, totalElements } = response.data;

            setUnwrittenReviews(prev => isReset ? content : [...prev, ...content]);
            setHasMoreUnwritten(!last);
            setUnwrittenCount(totalElements);
        } catch (error) {
            console.error("미작성 후기 목록을 불러오는 데 실패했습니다.", error);
        }
    }, [API_BASE_URL, accessToken, sortOrder]);

    // --- 비동기 데이터 초기화 및 인증 수명 주기 관리 ---
    useEffect(() => {
        if (isAuthLoading) return;

        if (!accessToken) {
            const timer = setTimeout(() => setLoading(false), 0);
            return () => clearTimeout(timer);
        }

        const initializeData = async () => {
            try {
                await Promise.all([
                    fetchWrittenReviews(0, true),
                    fetchUnwrittenReviews(0, true)
                ]);
            } catch (error) {
                console.error("데이터를 초기화하는 중 에러가 발생했습니다.", error);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [isAuthLoading, accessToken, fetchWrittenReviews, fetchUnwrittenReviews]);

    // 정렬 순서 변경 핸들러
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLoading(true);
        setSortOrder(e.target.value);
        setWrittenPage(0);
        setUnwrittenPage(0);
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-400 text-sm font-medium animate-pulse">
                    로딩 중입니다...
                </div>
            </div>
        );
    }

    const handleLike = async (reviewId: number) => {
        if (!accessToken) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }

        try {
            // 백엔드의 토글 API 호출
            const response = await axios.post(`${API_BASE_URL}/api/review/${reviewId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // 백엔드가 리턴한 좋아요 최종 상태 (true: 등록됨, false: 취소됨)
            const isLiked = response.data;

            setWrittenReviews(prev =>
                prev.map(review =>
                    review.reviewId === reviewId
                        ? {
                            ...review,
                            // true면 +1, false면 -1 연산 적용
                            likeCount: isLiked ? review.likeCount + 1 : Math.max(0, review.likeCount - 1)
                        }
                        : review
                )
            );
        } catch (error) {
            console.error("좋아요 처리에 실패했습니다.", error);
        }
    };

    const handleWriteClick = (item: UnwrittenReviewResponse) => {
        navigate(`/review/write/${item.visitVerificationId}?restaurantId=${item.restaurantId}`, {
            state: item
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-12 antialiased">
            <div className="max-w-md mx-auto px-4">

                {/* 섹션 1: 내가 작성한 후기 */}
                <section className="pt-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        내가 작성한 후기 <span className="text-orange-500">({writtenCount})</span>
                    </h2>

                    {/* 필터 및 정렬 바 */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-full bg-white text-gray-600 shadow-sm active:bg-gray-50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            필터
                        </button>
                        <div className="relative">
                            <select
                                value={sortOrder}
                                onChange={handleSortChange}
                                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 font-medium text-gray-700 focus:outline-none cursor-pointer"
                            >
                                <option value="createdAt,desc">최신순</option>
                                <option value="createdAt,asc">오래된순</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* 작성한 리뷰 리스트 카드 영역 */}
                    <div className="space-y-4">
                        {writtenReviews.map((review) => (
                            <div key={review.reviewId} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <div className="mb-2 text-base font-bold text-gray-900 border-b border-gray-50 pb-2">
                                    {review.restaurantName || "알 수 없는 가게"}
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 border border-gray-100" />
                                        <div>
                                            <div className="text-sm font-bold text-gray-800">{review.nickname || "익명 유저"}</div>
                                            <div className="text-[11px] text-gray-400 font-medium">
                                                Lv.{review.userLevel ?? 1} · {review.userLevelName || (review.isLocal ? '로컬' : '맛집 새내기')}
                                            </div>
                                        </div>
                                    </div>
                                    {/*<button className="text-gray-300 hover:text-gray-500 p-1"> 나중에 더보기 추가 시 주석 해제
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM14 10a2 2 0 11-4 0 2 2 0 014 0zM22 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </button>*/}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                    <span className="text-orange-500 font-bold">★ {review.score.toFixed(1)}</span>
                                    <span>|</span>
                                    <span>{review.createdAt.split('T')[0]}</span>
                                    <span>|</span>
                                    <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[10px] font-bold border border-green-100">방문 인증</span>
                                </div>

                                {review.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {review.tags.map((tag, idx) => (
                                            <span key={idx} className="text-[11px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-100">#{tag}</span>
                                        ))}
                                    </div>
                                )}

                                <p className="text-sm text-gray-700 mb-4 leading-relaxed whitespace-pre-line">{review.content}</p>

                                {review.imageUrls.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
                                        {review.imageUrls.map((url, idx) => (
                                            <img key={idx} src={url} alt="리뷰 이미지" className="w-24 h-24 object-cover rounded-xl flex-shrink-0 border border-gray-50" />
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleLike(review.reviewId)}
                                        className="flex items-center gap-1 hover:text-gray-600 transition-colors"
                                    >
                                        <span>좋아요 {review.likeCount}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {hasMoreWritten && (
                        <button
                            onClick={() => {
                                const nextPage = writtenPage + 1;
                                setWrittenPage(nextPage);
                                fetchWrittenReviews(nextPage);
                            }}
                            className="w-full mt-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 font-medium active:bg-gray-50 transition-colors shadow-sm"
                        >
                            더보기
                        </button>
                    )}
                </section>

                {/* 중간 경계선 영역 */}
                <div className="my-8 border-t border-gray-200/60" />

                {/* 섹션 2: 미작성 후기 */}
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        미작성 후기 <span className="text-orange-500">({unwrittenCount})</span>
                    </h2>

                    {/* 미작성 카드 리스트 */}
                    <div className="space-y-4">
                        {unwrittenReviews.map((item) => (
                            <div key={item.visitVerificationId} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-base font-bold text-gray-800">{item.restaurantName}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{item.category} · {item.address}</p>
                                    </div>
                                    <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-[10px] font-bold border border-green-100 flex-shrink-0">방문 인증</span>
                                </div>

                                {/* 💡 2. 방문일 옆에 만료 D-Day 표시 영역 추가 */}
                                <div className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
                                    <span>방문일: {item.visitDate}</span>
                                    <span>·</span>
                                    <span className={`font-semibold ${item.daysRemaining <= 2 ? "text-red-500" : "text-orange-500"}`}>
                                        {item.daysRemaining === 0 ? "오늘 만료" : `D-${item.daysRemaining}`}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleWriteClick(item)}
                                    className="w-full py-3 bg-orange-500 text-white rounded-xl text-sm font-bold active:bg-orange-600 shadow-sm transition-colors"
                                >
                                    후기 작성하기
                                </button>
                            </div>
                        ))}
                    </div>

                    {hasMoreUnwritten && (
                        <button
                            onClick={() => {
                                const nextPage = unwrittenPage + 1;
                                setUnwrittenPage(nextPage);
                                fetchUnwrittenReviews(nextPage);
                            }}
                            className="w-full mt-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 font-medium active:bg-gray-50 transition-colors shadow-sm"
                        >
                            더보기
                        </button>
                    )}
                </section>

            </div>
        </div>
    );
};

export default MyReviewManagement;