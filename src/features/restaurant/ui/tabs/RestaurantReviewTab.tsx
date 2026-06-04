import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

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
}

interface RestaurantReviewTabProps {
    restaurantId: number;
}

const RestaurantReviewTab = ({ restaurantId }: RestaurantReviewTabProps) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [onlyPhotos, setOnlyPhotos] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<string>("createdAt,desc");

    // 무한 스크롤 관련 상태 추가
    const pageRef = useRef<number>(0);
    const [hasNext, setHasNext] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false); // 초기 로드 및 필터 변경 시 로딩
    const [isFetchingNext, setIsFetchingNext] = useState<boolean>(false); // 스크롤 추가 로딩

    // 바닥 감지용 레퍼런스
    const observerRef = useRef<HTMLDivElement | null>(null);

    // 데이터 패칭 로직 분리 및 메모이제이션
    const fetchReviews = useCallback(async (currentPage: number, isReset: boolean = false) => {

        console.log("요청 페이지:", currentPage);

        // 초기화 요청이라면 상태부터 깔끔하게 정리
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
                        sort: `${sortField},${direction}`, // 이 부분이 백엔드로 전달됩니다.
                        hasImage: onlyPhotos
                    }
                }
            );

            const fetchedContent = response.data.content || response.data;

            // Page 객체 구조에 맞게 마지막 페이지인지 확인
            // last가 false이면 다음 페이지가 있다는 뜻이므로 true를 반환
            const hasNextPage = !response.data.last;

            // 결과 반영
            setReviews(isReset ? fetchedContent : (prev) => [...prev, ...fetchedContent]);
            setHasNext(hasNextPage);
        } catch (error) {
            console.error("리뷰 목록을 불러오지 못했습니다.", error);
        } finally {
            if (isReset) setLoading(false);
            else setIsFetchingNext(false);
        }
    }, [restaurantId, onlyPhotos, sortOrder]);

// 1. 상태 초기화 및 데이터 호출
    useEffect(() => {
        // 1) 페이지 번호 초기화
        pageRef.current = 0;

        // 2) 비동기 호출 (setState 호출을 함수 안으로 캡슐화)
        // 렌더링 직후가 아닌 다음 틱에 실행되도록 하여 동기적 렌더링 충돌을 피함
        const timer = setTimeout(() => {
            fetchReviews(0, true);
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchReviews]);

// 2. Intersection Observer를 이용한 무한 스크롤 감지 로직
    useEffect(() => {
        // 데이터가 더 없거나 로딩 중이면 관찰할 필요 없음
        if (!hasNext || loading || isFetchingNext) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // entries[0].isIntersecting: 화면에 보일 때
                if (entries[0].isIntersecting) {
                    pageRef.current += 1;
                    fetchReviews(pageRef.current, false);
                }
            },
            { threshold: 0.1 }
        );

        // 옵저버가 관찰할 타겟 설정
        const currentTarget = observerRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        // cleanup: 컴포넌트 언마운트나 의존성 변경 시 정리
        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasNext, loading, isFetchingNext, fetchReviews, reviews.length]);

    return (
        <div className="p-4">
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
                            pageRef.current = 0; // 💡 필터가 변경되면 페이지 번호를 다시 0으로 초기화!
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
                            const newSort = e.target.value;
                            setSortOrder(newSort);
                            pageRef.current = 0; // 정렬이 바뀌면 페이지를 0으로
                            // 여기서 fetchReviews를 직접 호출할 필요는 없습니다.
                            // useEffect가 sortOrder 변경을 감지하고 자동으로 실행하기 때문입니다.
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
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.reviewId} className="border-b pb-6 last:border-none">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-full h-full bg-gray-300" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 text-sm font-bold">
                                            <span>{review.nickname || "익명 유저"}</span>
                                            <span className="text-xs text-green-600 font-normal">
                                                Lv.{review.userLevel ?? 1} · {review.isLocal ? '로컬' : '미식가'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span className="text-orange-500">★ {review.score.toFixed(1)}</span>
                                            <span>{review.createdAt.split('T')[0]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {review.tags && review.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2.5">
                                    {review.tags.slice(0, 5).map((tag, idx) => ( // 5개까지만 보여주기
                                        <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                                            #{tag}
                                        </span>
                                    ))}
                                    {review.tags.length > 5 && (
                                        <span className="text-xs text-gray-400">...</span>
                                    )}
                                </div>
                            )}

                            <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">
                                {review.content}
                            </p>

                            {review.imageUrls && review.imageUrls.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                    {review.imageUrls.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url.startsWith('http') ? url : `${API_BASE_URL}${url}`}
                                            alt={`리뷰 이미지 ${idx + 1}`}
                                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0 border bg-gray-50"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* 스크롤 하단 감지용 타겟 요소 (Sentinel) */}
                    <div ref={observerRef} className="h-4" />

                    {/* 다음 데이터를 불러오는 중일 때 하단에 표시할 로딩 문구 */}
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