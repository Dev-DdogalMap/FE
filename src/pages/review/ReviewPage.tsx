import React, { useState } from 'react';
import axios from 'axios';

// 시안 및 요구사항에 맞춘 총 10가지 태그 옵션
const TAG_OPTIONS = [
    "혼밥 가능", "데이트", "분위기 좋아요",
    "웨이팅 있음", "친절해요", "가성비 좋아요",
    "위생 인증", "주차 가능", "양 많음", "재방문 의사"
];

export default function ReviewPage() {
    // 상태 관리 (기본값 세팅)
    const [score, setScore] = useState<number>(0); // 필수 체크를 위해 초기값을 0으로 변경
    const [content, setContent] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // 별점 텍스트 가이드
    const getScoreText = (rating: number) => {
        switch (rating) {
            case 5: return "아주 맛있어요!";
            case 4: return "맛있어요!";
            case 3: return "보통이에요";
            case 2: return "그냥 그래요";
            case 1: return "별로예요";
            default: return "별점을 선택해주세요.";
        }
    };

    // 태그 토글 핸들러 (최대 3개 제한으로 수정)
    const handleTagToggle = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            // 입력 제한 조건: 최대 3개
            if (selectedTags.length >= 3) {
                alert("태그는 최대 3개까지 선택 가능합니다.");
                return;
            }
            setSelectedTags([...selectedTags, tag]);
        }
    };

    // 폼 제출 핸들러 (필수 입력 검증 추가)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🚨 1. 별점 필수 입력 체크
        if (score === 0) {
            alert("별점을 선택해주세요.");
            return;
        }

        // 🚨 2. 상세 후기 필수 입력 체크 (공백 제거 후 검사)
        if (!content.trim()) {
            alert("상세 후기를 입력해주세요.");
            return;
        }

        // 🚨 3. 태그 선택 개수 검증 (최소 1개 ~ 최대 3개)
        if (selectedTags.length < 1) {
            alert("태그를 최소 1개 이상 선택해주세요.");
            return;
        }
        if (selectedTags.length > 3) {
            alert("태그는 최대 3개까지만 선택 가능합니다.");
            return;
        }

        // 모든 검증 통과 시 서버 전송 실행
        try {
            const payload = {
                score: score,
                // content: content,      // 추후 백엔드 필드 확장 시 주석 해제
                // tags: selectedTags
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/review`,
                payload
            );

            alert(response.data);
        } catch (error) {
            console.error(error);
            alert('리뷰 등록에 실패했습니다.');
        }
    };

    return (
        <div style={styles.container}>
            {/* 상단 헤더 영역 */}
            <div style={styles.header}>
                <span style={styles.backButton}>&lt;</span>
                <h1 style={styles.headerTitle}>후기 작성</h1>
                <button onClick={handleSubmit} style={styles.submitTopButton}>등록</button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* 음식점 정보 카드 */}
                <div style={styles.restaurantCard}>
                    <div style={styles.restaurantIcon}>🏪</div>
                    <div style={styles.restaurantInfo}>
                        <h3 style={styles.restaurantName}>성수동 스테이크 하우스</h3>
                        <p style={styles.restaurantMeta}>스테이크 · 성수동</p>
                        <span style={styles.badge}>✓ 방문 인증 완료 <span style={{color: '#aaa'}}>2024.05.12 18:30</span></span>
                    </div>
                </div>

                <hr style={styles.divider} />

                {/* 별점 선택 영역 */}
                <div style={styles.section}>
                    <h4 style={styles.sectionTitle}>맛은 어땠나요? <span style={styles.required}>*</span></h4>
                    <div style={styles.starContainer}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <span
                                key={num}
                                onClick={() => setScore(num)}
                                style={{
                                    ...styles.star,
                                    color: num <= score ? '#FF8A3D' : '#E0E0E0'
                                }}
                            >
                ★
              </span>
                        ))}
                    </div>
                    <p style={styles.scoreText}>{getScoreText(score)}</p>
                </div>

                {/* 안내 회색 박스 영역 */}
                <div style={styles.grayBanner}></div>

                {/* 상세 후기 입력 영역 */}
                <div style={styles.section}>
                    <h4 style={styles.sectionTitle}>상세 후기 <span style={styles.required}>*</span></h4>
                    <div style={styles.textareaWrapper}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 500))}
                placeholder="분위기도 좋고, 직원분들도 친절했어요.&#10;데이트 장소로 추천합니다 😊"
                maxLength={500}
                style={styles.textarea}
            />
                        <span style={styles.charCounter}>{content.length}/500</span>
                    </div>
                </div>

                {/* 사진 첨부 영역 (선택사항 유지) */}
                <div style={styles.section}>
                    <h4 style={styles.sectionTitle}>사진 첨부 <span style={styles.optional}>(선택)</span></h4>
                    <div style={styles.photoContainer}>
                        <div style={styles.photoUploadButton}>
                            <span style={{fontSize: '24px', color: '#aaa'}}>+</span>
                        </div>
                    </div>
                </div>

                {/* 태그 선택 영역 */}
                <div style={styles.section}>
                    <h4 style={styles.sectionTitle}>태그 선택 <span style={styles.required}>*</span> <span style={styles.optional}>(1개 ~ 3개)</span></h4>
                    <div style={styles.tagContainer}>
                        {TAG_OPTIONS.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <button
                                    type="button"
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    style={{
                                        ...styles.tagButton,
                                        borderColor: isSelected ? '#FF8A3D' : '#E0E0E0',
                                        color: isSelected ? '#FF8A3D' : '#333',
                                        backgroundColor: isSelected ? '#FFF5EE' : '#FFF'
                                    }}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 하단 큰 등록 버튼 */}
                <button type="submit" style={styles.submitBottomButton}>
                    후기 등록하기
                </button>
            </form>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: { backgroundColor: '#FFF', minHeight: '100vh', fontFamily: 'sans-serif', color: '#333' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #F0F0F0', position: 'sticky', top: 0, backgroundColor: '#FFF', zIndex: 10 },
    backButton: { fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' },
    headerTitle: { fontSize: '18px', fontWeight: 'bold', margin: 0 },
    submitTopButton: { backgroundColor: '#FFF5EE', color: '#FF8A3D', border: 'none', padding: '6px 14px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' },
    form: { padding: '15px' },
    restaurantCard: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' },
    restaurantIcon: { fontSize: '32px', backgroundColor: '#F9F9F9', padding: '8px', borderRadius: '10px' },
    restaurantInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
    restaurantName: { fontSize: '16px', fontWeight: 'bold', margin: 0 },
    restaurantMeta: { fontSize: '13px', color: '#888', margin: 0 },
    badge: { fontSize: '11px', color: '#28A745', fontWeight: 'bold' },
    divider: { border: 'none', borderTop: '1px solid #F0F0F0', margin: '15px 0' },
    section: {  marginBottom: '20px' },
    sectionTitle: { fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0' },
    required: { color: '#FF8A3D', marginLeft: '2px' },
    optional: { color: '#aaa', fontWeight: 'normal', fontSize: '12px' },
    starContainer: { display: 'flex', justifyContent: 'center', gap: '8px', margin: '15px 0 5px 0' },
    star: { fontSize: '36px', cursor: 'pointer', userSelect: 'none' },
    scoreText: { textAlign: 'center', fontSize: '13px', color: '#555', margin: '0 0 15px 0', fontWeight: 'bold' },
    grayBanner: { height: '80px', backgroundColor: '#E0E0E0', borderRadius: '4px', marginBottom: '20px' },
    textareaWrapper: { position: 'relative', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '12px' },
    textarea: { width: '100%', height: '100px', border: 'none', resize: 'none', outline: 'none', fontSize: '14px', fontFamily: 'inherit', lineHeight: '1.5' },
    charCounter: { position: 'absolute', bottom: '10px', right: '12px', fontSize: '12px', color: '#aaa' },
    photoContainer: { display: 'flex', gap: '10px' },
    photoUploadButton: { width: '70px', height: '70px', border: '1px solid #E0E0E0', borderRadius: '8px', display: 'flex', justifyIntersection: 'center', justifyContents: 'center', alignItems: 'center', cursor: 'pointer' },
    tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    tagButton: { padding: '8px 14px', borderRadius: '20px', border: '1px solid', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s ease' },
    submitBottomButton: { width: '100%', backgroundColor: '#FF8A3D', color: '#FFF', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};