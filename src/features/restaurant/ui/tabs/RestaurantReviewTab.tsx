import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 백엔드 응답 데이터 구조에 맞춘 타입 정의
interface ReviewResponse {
    reviewId: number;
    score: number;
    content: string;
    isRevisit: boolean;
    createdAt: string;
    imageUrls: string[];
    tags: string[];
}

interface RestaurantReviewTabProps {
    restaurantId: number; // 부모 컴포넌트로부터 식당 고유 ID를 받음
}

const RestaurantReviewTab = ({ restaurantId }: RestaurantReviewTabProps) => {

    // 백엔드로부터 가져온 리뷰 목록을 저장할 State
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);

    // 컴포넌트 로드 및 의존성 변경 시 실행
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/review/restaurant/${restaurantId}`
                );
                setReviews(response.data.content);
            } catch (error) {
                console.error("리뷰 목록을 불러오지 못했습니다.", error);
            }
        };

        fetchReviews();
    }, [restaurantId]); // restaurantId나 refreshKey가 바뀔 때만 안전하게 실행됨

    return (
        <div className="p-6" style={styles.container}>
            <div style={styles.tabHeader}>
                <h2 style={styles.headerTitle}>후기 목록 조회</h2>
            </div>

            {/*<hr style={{ ...styles.divider, margin: '30px 0' }} />*/}

            {/* 신규 추가: 등록된 리뷰 목록 조회 피드 영역 */}
            <div style={styles.reviewListSection}>
                <h3 style={styles.reviewListTitle}>모든 후기 ({reviews.length})</h3>
                {reviews.length === 0 ? (
                    <p style={styles.emptyText}>아직 등록된 후기가 없습니다. 첫 후기를 남겨보세요!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.reviewId} style={styles.reviewItem}>
                            <div style={styles.reviewItemHeader}>
                                <span style={styles.reviewItemStars}>
                                    {"★".repeat(review.score)}{"☆".repeat(5 - review.score)}
                                </span>
                                <span style={styles.reviewItemDate}>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={styles.reviewItemRevisit}>
                                {review.isRevisit ? "🟢 재방문 의사 있음" : "🔴 재방문 의사 없음"}
                            </div>
                            <p style={styles.reviewItemContent}>{review.content}</p>

                            {/* 후기 이미지 리스트 출력 */}
                            {review.imageUrls && review.imageUrls.length > 0 && (
                                <div style={styles.reviewItemImages}>
                                    {review.imageUrls.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={`${import.meta.env.VITE_API_BASE_URL}${url}`}
                                            alt="리뷰 첨부 이미지"
                                            style={styles.reviewItemImg}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* 태그 리스트 출력 */}
                            <div style={styles.reviewItemTags}>
                                {review.tags.map((tag, idx) => (
                                    <span key={idx} style={styles.reviewItemTag}>#{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    // ...기존 스타일 필드 완전 유지...
    container: { backgroundColor: '#FFF', fontFamily: 'sans-serif', color: '#333' },
    tabHeader: { paddingBottom: '10px', borderBottom: '1px solid #F0F0F0', marginBottom: '15px' },
    headerTitle: { fontSize: '18px', fontWeight: 'bold', margin: 0 },
    form: { display: 'flex', flexDirection: 'column' },
    restaurantCard: { display: 'flex', alignItems: 'center', gap: '12px', padding: '5px 0' },
    restaurantIcon: { fontSize: '28px', backgroundColor: '#F9F9F9', padding: '6px', borderRadius: '10px' },
    restaurantInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
    restaurantName: { fontSize: '15px', fontWeight: 'bold', margin: 0 },
    restaurantMeta: { fontSize: '12px', color: '#888', margin: 0 },
    divider: { border: 'none', borderTop: '1px solid #F0F0F0', margin: '15px 0' },
    section: { marginBottom: '20px' },
    sectionTitle: { fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0' },
    required: { color: '#FF8A3D', marginLeft: '2px' },
    optional: { color: '#aaa', fontWeight: 'normal', fontSize: '12px' },
    starContainer: { display: 'flex', justifyContent: 'center', gap: '8px', margin: '15px 0 5px 0' },
    star: { fontSize: '36px', cursor: 'pointer', userSelect: 'none' },
    scoreText: { textAlign: 'center', fontSize: '13px', color: '#555', margin: '0 0 15px 0', fontWeight: 'bold' },
    revisitContainer: { backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '18px', marginBottom: '25px', textAlign: 'center' },
    revisitTitle: { fontSize: '15px', fontWeight: 'bold', margin: '0 0 14px 0' },
    revisitButtonGroup: { display: 'flex', justifyContent: 'center', gap: '12px' },
    revisitButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '120px', padding: '10px 0', borderRadius: '24px', border: '1px solid', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease-in-out' },
    iconCircle: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'currentColor' },
    revisitInactive: { borderColor: '#E0E0E0', backgroundColor: '#FFF', color: '#AAA' },
    revisitYesActive: { borderColor: '#2E7D32', backgroundColor: '#E8F5E9', color: '#2E7D32' },
    revisitNoActive: { borderColor: '#C62828', backgroundColor: '#FFEBEE', color: '#C62828' },
    textareaWrapper: { position: 'relative', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '12px' },
    textarea: { width: '100%', height: '100px', border: 'none', resize: 'none', outline: 'none', fontSize: '14px', fontFamily: 'inherit', lineHeight: '1.5' },
    charCounter: { position: 'absolute', bottom: '10px', right: '12px', fontSize: '12px', color: '#aaa' },
    photoContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
    photoUploadButton: { width: '70px', height: '70px', border: '1px solid #E0E0E0', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
    thumbnailWrapper: { position: 'relative', width: '70px', height: '70px' },
    thumbnail: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E0E0E0' },
    removeButton: { position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#555', color: '#FFF', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    tagButton: { padding: '8px 14px', borderRadius: '20px', border: '1px solid', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s ease' },
    submitBottomButton: { width: '100%', backgroundColor: '#FF8A3D', color: '#FFF', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },

    // 신규 추가된 리뷰 피드용 인라인 스타일
    reviewListSection: { marginTop: '30px', textAlign: 'left' },
    reviewListTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' },
    emptyText: { color: '#888', fontSize: '14px', textAlign: 'center', padding: '30px 0' },
    reviewItem: { borderBottom: '1px solid #F0F0F0', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '8px' },
    reviewItemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    reviewItemStars: { color: '#FF8A3D', fontSize: '16px', letterSpacing: '2px' },
    reviewItemDate: { color: '#AAA', fontSize: '12px' },
    reviewItemRevisit: { fontSize: '13px', fontWeight: 'bold', color: '#555' },
    reviewItemContent: { fontSize: '14px', lineHeight: '1.6', margin: '4px 0', color: '#333', whiteSpace: 'pre-wrap' },
    reviewItemImages: { display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' },
    reviewItemImg: { width: '65px', height: '65px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E0E0E0' },
    reviewItemTags: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' },
    reviewItemTag: { fontSize: '12px', color: '#FF8A3D', backgroundColor: '#FFF5EE', padding: '4px 10px', borderRadius: '12px', border: '1px solid #FFE0CC' }
};

export default RestaurantReviewTab;