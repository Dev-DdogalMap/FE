import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import axios from "axios";

// --- Interfaces ---
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
    commentCount: number;
}

interface UnwrittenReviewResponse {
    visitVerificationId: number; // 💡 중복 Key 에러 해결을 위해 추가
    restaurantId: number;
    restaurantName: string;
    category: string;
    address: string;
    visitDate: string;
}

const MyReviewManagement = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { accessToken, isLoading: isAuthLoading } = useAuth();

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
            const [, direction] = sortOrder.split(","); // 💡 정렬 방향 추출

            const response = await axios.get(`${API_BASE_URL}/api/my/unwritten-reviews`, {
                params: {
                    page,
                    size: 5,
                    sort: `verifiedAt,${direction}` // 💡 정렬 조건 파라미터 추가
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
    }, [API_BASE_URL, accessToken, sortOrder]); // 💡 sortOrder 의존성 추가

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
        setUnwrittenPage(0); // 💡 미작성 후기 페이지 변수도 초기화
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
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 border border-gray-100" />
                                        <div>
                                            <div className="text-sm font-bold text-gray-800">{review.nickname || "익명 유저"}</div>
                                            <div className="text-[11px] text-gray-400 font-medium">
                                                Lv.{review.userLevel ?? 1} · {review.isLocal ? '로컬' : '미식가'}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-gray-300 hover:text-gray-500 p-1">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM14 10a2 2 0 11-4 0 2 2 0 014 0zM22 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </button>
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
                                    <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                                        <span>좋아요 {review.likeCount}</span>
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                                        <span>댓글 {review.commentCount}</span>
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
                            /* 💡 key 속성을 기존 restaurantId에서 고유값인 visitVerificationId로 변경 */
                            <div key={item.visitVerificationId} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-base font-bold text-gray-800">{item.restaurantName}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{item.category} · {item.address}</p>
                                    </div>
                                    <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-[10px] font-bold border border-green-100 flex-shrink-0">방문 인증</span>
                                </div>
                                <div className="text-xs text-gray-400 mb-4">방문일: {item.visitDate}</div>
                                <button className="w-full py-3 bg-orange-500 text-white rounded-xl text-sm font-bold active:bg-orange-600 shadow-sm transition-colors">
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