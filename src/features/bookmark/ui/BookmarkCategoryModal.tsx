import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Heart, Bookmark, Flag, Star, List, MapPin } from "lucide-react";
import { useAuth } from "@/shared/auth/AuthContext";
import {
  createBookmark,
  createBookmarkCategory,
  deleteBookmarkFromCategory,
  getBookmarkCategoryStatuses
} from "@/features/bookmark/api/bookmarkApi";
import type { BookmarkCategoryStatus } from "@/features/bookmark/model/bookmarkTypes";
import { toast } from "sonner";

type BookmarkCategoryModalProps = {
  isOpen: boolean;
  restaurantId: number | null;
  anchorRect?: DOMRect | null;
  onClose: () => void;
  onChange?: (savedCategoryCount: number) => void;
};

export default function BookmarkCategoryModal({
  isOpen,
  restaurantId,
  anchorRect,
  onClose,
  onChange,
}: BookmarkCategoryModalProps) {
  const { accessToken, refreshAccessToken, isLoggedIn } = useAuth();

  const [categories, setCategories] = useState<BookmarkCategoryStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingCategoryId, setProcessingCategoryId] = useState<number | null>(
    null
  );
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreateInputOpen, setIsCreateInputOpen] = useState(false);

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;

  const desktopModalStyle: React.CSSProperties =
    isDesktop && anchorRect
      ? {
          position: "fixed",
          top: Math.max(
            12,
            Math.min(anchorRect.bottom + 10, window.innerHeight - 560)
            ),
            left: Math.max(
            12,
            Math.min(anchorRect.left - 300, window.innerWidth - 420)
            ),
          width: 400,
          maxHeight: 560,
          borderRadius: 4,
        }
      : {};

  useEffect(() => {
    if (!isOpen || !restaurantId || !isLoggedIn) return;

    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, restaurantId, isLoggedIn]);

  async function loadCategories() {
    if (!restaurantId) return;

    try {
        setIsLoading(true);

        const data = await getBookmarkCategoryStatuses({
        restaurantId,
        accessToken,
        refreshAccessToken,
        });

        setCategories(data);
        onChange?.(data.filter((category) => category.saved).length);
    } catch (error) {
        console.error(error);
        toast.error("저장 카테고리을 불러오지 못했어요.");
    } finally {
        setIsLoading(false);
        }
    }

  async function handleToggleCategory(category: BookmarkCategoryStatus) {
    if (!restaurantId) return;

    try {
        setProcessingCategoryId(category.bookmarkCategoryId);

        if (category.saved) {
        await deleteBookmarkFromCategory({
            bookmarkCategoryId: category.bookmarkCategoryId,
            restaurantId,
            accessToken,
            refreshAccessToken,
        });
        } else {
        await createBookmark({
            accessToken,
            refreshAccessToken,
            body: {
            restaurantId,
            bookmarkCategoryId: category.bookmarkCategoryId,
            memo: null,
            },
        });
        }

        await loadCategories();
    } catch (error) {
        console.error(error);
        toast.error("저장 상태 변경에 실패했어요.");
    } finally {
        setProcessingCategoryId(null);
        }
    }

    async function handleCreateCategory() {
        if (!restaurantId) return;

        const trimmedName = newCategoryName.trim();

        if (!trimmedName) {
            toast("새 카테고리 이름을 입력해주세요.");
            return;
        }

        try {
            setIsCreatingCategory(true);

            const createdCategory = await createBookmarkCategory({
            accessToken,
            refreshAccessToken,
            body: {
                bookmarkCategoryName: trimmedName,
            },
            });

            await createBookmark({
            accessToken,
            refreshAccessToken,
            body: {
                restaurantId,
                bookmarkCategoryId: createdCategory.bookmarkCategoryId,
                memo: null,
            },
            });

            setNewCategoryName("");
            setIsCreateInputOpen(false);

            await loadCategories();
        } catch (error) {
            console.error(error);
            toast.error("새 카테고리 생성에 실패했어요.");
        } finally {
            setIsCreatingCategory(false);
        }
    }

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        ...styles.overlay,
        ...(isDesktop ? styles.desktopOverlay : {}),
      }}
      onClick={onClose}
    >
      <section
        style={{
          ...styles.modal,
          ...(isDesktop ? styles.desktopModal : {}),
          ...desktopModalStyle,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <header style={styles.header}>
          <h2 style={styles.title}>카테고리에 저장</h2>
        </header>

        {isLoading ? (
          <div style={styles.emptyBox}>카테고리을 불러오는 중...</div>
        ) : categories.length === 0 ? (
          <div style={styles.emptyBox}>저장할 카테고리가 없어요.</div>
        ) : (
          <div style={styles.categoryList}>
            {categories.map((category, index) => {
              const isProcessing =
                processingCategoryId === category.bookmarkCategoryId;

              return (
                <button
                  key={category.bookmarkCategoryId}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleToggleCategory(category)}
                  style={{
                    ...styles.categoryItem,
                    ...(category.saved ? styles.savedCategoryItem : {}),
                    ...(isProcessing ? styles.disabledItem : {}),
                  }}
                >
                  <span style={styles.leftIcon}>
                    {getCategoryIcon(index, category.isDefault)}
                  </span>

                  <span style={styles.checkWrap}>
                    {category.saved && (
                      <span style={styles.checkCircle}>
                        <Check size={17} strokeWidth={4} />
                      </span>
                    )}
                  </span>

                  <div style={styles.categoryText}>
                    <strong style={styles.categoryName}>
                      {category.bookmarkCategoryName}
                    </strong>
                    <span style={styles.categoryCount}>
                      비공개·{category.bookmarkCount}개 장소
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {isCreateInputOpen ? (
            <div style={styles.createBox}>
                <input
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="새 카테고리 이름"
                maxLength={100}
                style={styles.createInput}
                autoFocus
                />

                <div style={styles.createActions}>
                <button
                    type="button"
                    style={styles.cancelCreateButton}
                    onClick={() => {
                    setIsCreateInputOpen(false);
                    setNewCategoryName("");
                    }}
                >
                    취소
                </button>

                <button
                    type="button"
                    style={styles.confirmCreateButton}
                    disabled={isCreatingCategory}
                    onClick={handleCreateCategory}
                >
                    {isCreatingCategory ? "생성 중" : "생성"}
                </button>
                </div>
            </div>
            ) : (
            <button
                type="button"
                style={styles.newListButton}
                onClick={() => setIsCreateInputOpen(true)}
            >
                + 새 카테고리
            </button>
            )}
      </section>
    </div>,
    document.body
  );
}

function getCategoryIcon(index: number, isDefault: boolean) {
  if (isDefault) {
    return <List size={22} />;
  }

  const icons = [
    <Heart size={24} fill="#C62828" color="#C62828" />,
    <Flag size={24} fill="#188038" color="#188038" />,
    <MapPin size={23} color="#007C89" />,
    <Star size={25} fill="#8B4F00" color="#8B4F00" />,
    <Bookmark size={24} color="#007C89" />,
  ];

  return icons[index % icons.length];
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 2147483647,
    background: "rgba(0, 0, 0, 0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: "0 18px 120px",
    boxSizing: "border-box",
  },
  desktopOverlay: {
    background: "transparent",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 0,
  },
  modal: {
    width: "100%",
    maxWidth: 430,
    maxHeight: "68vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 24,
    boxSizing: "border-box",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.22)",
  },
  desktopModal: {
    maxWidth: 400,
    borderRadius: 4,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.28)",
  },
  header: {
    padding: "22px 24px 20px",
    borderBottom: "1px solid #eee",
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: "#202124",
  },
  emptyBox: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#777",
    fontSize: 14,
  },
  categoryList: {
    display: "flex",
    flexDirection: "column",
  },
  categoryItem: {
    width: "100%",
    minHeight: 76,
    border: "none",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 24px",
    cursor: "pointer",
    textAlign: "left",
  },
  savedCategoryItem: {
    background: "#D2F4FA",
  },
  disabledItem: {
    opacity: 0.6,
    cursor: "wait",
  },
  leftIcon: {
    width: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#007C89",
    flexShrink: 0,
  },
  checkWrap: {
    width: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "#008C95",
    color: "#fff",
    display: "grid",
    placeItems: "center",
  },
  categoryText: {
    flex: 1,
    minWidth: 0,
  },
  categoryName: {
    display: "block",
    fontSize: 20,
    fontWeight: 700,
    color: "#202124",
    lineHeight: 1.25,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  categoryCount: {
    display: "block",
    marginTop: 4,
    fontSize: 15,
    color: "#5f6368",
    lineHeight: 1.25,
  },
  newListButton: {
    width: "calc(100% - 48px)",
    height: 54,
    margin: "18px 24px 24px",
    border: "none",
    borderRadius: 999,
    background: "#D2F4FA",
    color: "#006D75",
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
  },
  createBox: {
    margin: "18px 24px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },                          
  createInput: {
    width: "100%",
    height: 48,
    border: "1px solid #ddd",
    borderRadius: 14,
    padding: "0 14px",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  },
  createActions: {
    display: "flex",
    gap: 8,
  },
  cancelCreateButton: {
    flex: 1,
    height: 44,
    border: "1px solid #ddd",
    borderRadius: 14,
    background: "#fff",
    color: "#555",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  confirmCreateButton: {
    flex: 1,
    height: 44,
    border: "none",
    borderRadius: 14,
    background: "#D2F4FA",
    color: "#006D75",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },
};