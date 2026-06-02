import React, { useState } from 'react';
import axios from 'axios';
import { Check, X } from 'lucide-react';

const TAG_OPTIONS = [
    "혼밥 가능", "데이트", "분위기 좋아요",
    "웨이팅 있음", "친절해요", "가성비 좋아요",
    "위생 인증", "주차 가능", "양 많음"
];

const RestaurantReviewTab = () => {
    const [score, setScore] = useState<number>(0);
    const [content, setContent] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isRevisit, setIsRevisit] = useState<boolean | null>(null);

    // 여러 장의 이미지를 관리하기 위한 배열 State (file 객체와 preview 주소를 함께 저장)
    const [images, setImages] = useState<{ file: File; preview: string }[]>([]);

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

    const handleRevisitToggle = (value: boolean) => {
        if (isRevisit === value) {
            setIsRevisit(null);
        } else {
            setIsRevisit(value);
        }
    };

    const handleTagToggle = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length >= 3) {
                alert("태그는 최대 3개까지 선택 가능합니다.");
                return;
            }
            setSelectedTags([...selectedTags, tag]);
        }
    };

    // 다중 파일 선택 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);

            // 최대 업로드 개수 제한 (예: 5장)
            if (images.length + filesArray.length > 5) {
                alert("사진은 최대 5장까지 등록 가능합니다.");
                return;
            }

            const newImages = filesArray.map((file) => ({
                file,
                preview: URL.createObjectURL(file)
            }));

            // 기존 이미지 목록에 추가
            setImages((prev) => [...prev, ...newImages]);
        }
        // 같은 파일을 연속으로 선택해도 onChange가 트리거되도록 input value 초기화
        e.target.value = "";
    };

    // 선택한 개별 이미지 제거 핸들러
    const handleRemoveImage = (indexToRemove: number) => {
        setImages((prev) => {
            const target = prev[indexToRemove];
            if (target) {
                URL.revokeObjectURL(target.preview); // 메모리 해제
            }
            return prev.filter((_, index) => index !== indexToRemove);
        });
    };

    // 전체 이미지 초기화 (등록 완료 후 사용)
    const clearAllImages = () => {
        images.forEach((img) => URL.revokeObjectURL(img.preview));
        setImages([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (score === 0) { alert("별점을 선택해주세요."); return; }
        if (isRevisit == null) { alert("재방문 의사를 선택해주세요."); return; }
        if (!content.trim()) { alert("상세 후기를 입력해주세요."); return; }
        if (selectedTags.length < 1) { alert("태그를 최소 1개 이상 선택해주세요."); return; }

        try {
            const formData = new FormData();

            const reviewData = {
                restaurantId: 1,
                score: score,
                content: content,
                tags: selectedTags,
                isRevisit: isRevisit
            };

            const reviewBlob = new Blob([JSON.stringify(reviewData)], { type: "application/json" });
            formData.append("review", reviewBlob);

            // 배열 내 모든 파일을 동일한 'images' 키로 추가 (Spring의 List<MultipartFile>과 매핑)
            images.forEach((img) => {
                formData.append("images", img.file);
            });

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/review`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            alert(response.data);

            setScore(0);
            setContent("");
            setSelectedTags([]);
            setIsRevisit(null);
            clearAllImages(); // 이미지 상태 및 메모리 전체 초기화
        } catch (error) {
            console.error(error);
            alert('리뷰 등록에 실패했습니다.');
        }
    };

    return (
        <div className="p-6" style={styles.container}>
            <div style={styles.tabHeader}>
                <h2 style={styles.headerTitle}>후기 작성하기</h2>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.restaurantCard}>
                    <div style={styles.restaurantIcon}>🏪</div>
                    <div style={styles.restaurantInfo}>
                        <h3 style={styles.restaurantName}>성수동 스테이크 하우스</h3>
                        <p style={styles.restaurantMeta}>스테이크 · 성수동</p>
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

                {/* 재방문 의사 선택 영역 */}
                <div style={styles.revisitContainer}>
                    <h4 style={styles.revisitTitle}>재방문 의사가 있나요? <span style={styles.required}>*</span></h4>
                    <div style={styles.revisitButtonGroup}>
                        <button
                            type="button"
                            onClick={() => handleRevisitToggle(true)}
                            style={{
                                ...styles.revisitButton,
                                ...(isRevisit === true ? styles.revisitYesActive : styles.revisitInactive)}}>
                            <span style={styles.iconCircle}>
                                <Check size={12} strokeWidth={3} color="#FFF" />
                            </span>
                            예
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRevisitToggle(false)}
                            style={{
                                ...styles.revisitButton,
                                ...(isRevisit === false ? styles.revisitNoActive : styles.revisitInactive)}}>
                            <span style={styles.iconCircle}>
                                <X size={12} strokeWidth={3} color="#FFF" />
                            </span>
                            아니오
                        </button>
                    </div>
                </div>

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

                {/* 사진 첨부 영역 (다중 업로드 지원 수정) */}
                <div style={styles.section}>
                    <h4 style={styles.sectionTitle}>사진 첨부 <span style={styles.optional}>(선택)</span></h4>
                    <div style={styles.photoContainer}>
                        {/* 등록된 프리뷰 이미지들을 루프 돌며 렌더링 */}
                        {images.map((img, index) => (
                            <div key={index} style={styles.thumbnailWrapper}>
                                <img src={img.preview} alt={`미리보기 ${index + 1}`} style={styles.thumbnail} />
                                <button type="button" onClick={() => handleRemoveImage(index)} style={styles.removeButton}>
                                    <X size={10} strokeWidth={3} />
                                </button>
                            </div>
                        ))}

                        {/* 최대 개수(5장) 미만일 때만 업로드 버튼 노출 */}
                        {images.length < 5 && (
                            <label style={styles.photoUploadButton}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple // 한 번에 여러 파일 선택을 가능하게 함
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <span style={{ fontSize: '24px', color: '#aaa' }}>+</span>
                            </label>
                        )}
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

                <button type="submit" style={styles.submitBottomButton}>
                    후기 등록하기
                </button>
            </form>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
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
    revisitContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: '12px',
        padding: '18px',
        marginBottom: '25px',
        textAlign: 'center'
    },
    revisitTitle: { fontSize: '15px', fontWeight: 'bold', margin: '0 0 14px 0' },
    revisitButtonGroup: { display: 'flex', justifyContent: 'center', gap: '12px' },
    revisitButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '120px',
        padding: '10px 0',
        borderRadius: '24px',
        border: '1px solid',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out'
    },
    iconCircle: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        backgroundColor: 'currentColor'
    },
    revisitInactive: { borderColor: '#E0E0E0', backgroundColor: '#FFF', color: '#AAA' },
    revisitYesActive: { borderColor: '#2E7D32', backgroundColor: '#E8F5E9', color: '#2E7D32' },
    revisitNoActive: { borderColor: '#C62828', backgroundColor: '#FFEBEE', color: '#C62828' },
    textareaWrapper: { position: 'relative', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '12px' },
    textarea: { width: '100%', height: '100px', border: 'none', resize: 'none', outline: 'none', fontSize: '14px', fontFamily: 'inherit', lineHeight: '1.5' },
    charCounter: { position: 'absolute', bottom: '10px', right: '12px', fontSize: '12px', color: '#aaa' },
    photoContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px' }, // 여러 줄 배치를 위해 flexWrap 추가
    photoUploadButton: {
        width: '70px',
        height: '70px',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
    },
    thumbnailWrapper: {
        position: 'relative',
        width: '70px',
        height: '70px',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '8px',
        border: '1px solid #E0E0E0'
    },
    removeButton: {
        position: 'absolute',
        top: '-6px',
        right: '-6px',
        backgroundColor: '#555',
        color: '#FFF',
        border: 'none',
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    tagButton: {
        padding: '8px 14px',
        borderRadius: '20px',
        border: '1px solid',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    submitBottomButton: { width: '100%', backgroundColor: '#FF8A3D', color: '#FFF', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default RestaurantReviewTab;