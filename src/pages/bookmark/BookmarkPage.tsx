import {
  createBookmarkCategory,
  deleteBookmarkCategory,
  deleteBookmarkFromCategory,
  getBookmarkCategories,
  getBookmarksByCategory
} from "@/features/bookmark/api/bookmarkApi";
import type {
  BookmarkCategory,
  BookmarkRestaurant,
} from "@/features/bookmark/model/bookmarkTypes";
import { useAuth } from "@/shared/auth/AuthContext";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

export default function BookmarkPage() {
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const navigate = useNavigate();
  const { accessToken, refreshAccessToken, isLoggedIn, isLoading: authLoading } =
    useAuth();

  const [categories, setCategories] = useState<BookmarkCategory[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkRestaurant[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectedTitle =
    categories.find((c) => c.bookmarkCategoryId === selectedCategoryId)
      ?.bookmarkCategoryName ?? "카테고리";

  useEffect(() => {
    if (authLoading || !isLoggedIn) return;

    async function loadData() {
      try {
        setIsLoading(true);

        const categoryData = await getBookmarkCategories({
          accessToken,
          refreshAccessToken,
        });

        setCategories(categoryData);

        const firstCategory = categoryData[0];

        if (!firstCategory) {
          setSelectedCategoryId(null);
          setBookmarks([]);
          return;
        }

        setSelectedCategoryId(firstCategory.bookmarkCategoryId);

        const bookmarkData = await getBookmarksByCategory({
          bookmarkCategoryId: firstCategory.bookmarkCategoryId,
          accessToken,
          refreshAccessToken,
        });

        setBookmarks(bookmarkData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [authLoading, isLoggedIn, accessToken, refreshAccessToken]);

  async function handleCreateCategory() {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      alert("카테고리명을 입력해주세요.");
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

      setCategories((prev) => [...prev, createdCategory]);
      setNewCategoryName("");
      setIsCreateCategoryOpen(false);
    } catch (error) {
      console.error(error);
      alert("카테고리 생성에 실패했어요.");
    } finally {
      setIsCreatingCategory(false);
    }
  }

  async function handleDeleteCategory(categoryId: number) {
    const targetCategory = categories.find(
      (category) => category.bookmarkCategoryId === categoryId
    );

    if (!targetCategory) return;

    if (targetCategory.isDefault) {
      alert("기본 카테고리는 삭제할 수 없어요.");
      return;
    }

    const confirmed = window.confirm(
      `"${targetCategory.bookmarkCategoryName}" 카테고리를 삭제할까요?\n안에 저장된 맛집도 함께 삭제돼요.`
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);

      await deleteBookmarkCategory({
        bookmarkCategoryId: categoryId,
        accessToken,
        refreshAccessToken,
      });

      const nextCategories = categories.filter(
        (category) => category.bookmarkCategoryId !== categoryId
      );

      setCategories(nextCategories);

      const wasSelected = selectedCategoryId === categoryId;
      const nextSelectedCategory = wasSelected
        ? nextCategories[0]
        : nextCategories.find(
          (category) => category.bookmarkCategoryId === selectedCategoryId
        );

      if (!nextSelectedCategory) {
        setSelectedCategoryId(null);
        setBookmarks([]);
        return;
      }

      setSelectedCategoryId(nextSelectedCategory.bookmarkCategoryId);

      try {
        const bookmarkData = await getBookmarksByCategory({
          bookmarkCategoryId: nextSelectedCategory.bookmarkCategoryId,
          accessToken,
          refreshAccessToken,
        });

        setBookmarks(bookmarkData);
      } catch (error) {
        console.error(error);
        setBookmarks([]);
      }
    } catch (error) {
      console.error(error);
      alert("카테고리 삭제에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectCategory(categoryId: number) {

  try {
    setSelectedCategoryId(categoryId);
    setIsLoading(true);

    const data = await getBookmarksByCategory({
      bookmarkCategoryId: categoryId,
      accessToken,
      refreshAccessToken,
    });

    setBookmarks(data);
  } catch (error) {
    console.error(error);
    } 
    finally {
    setIsLoading(false);
    }
  }

  async function handleDeleteRestaurant(restaurantId: number) {
  if (!selectedCategoryId) {
    alert("카테고리를 선택해주세요.");
    return;
  }

  const confirmed = window.confirm("이 맛집을 현재 카테고리에서 삭제할까요?");
  if (!confirmed) return;

  try {
    await deleteBookmarkFromCategory({
      bookmarkCategoryId: selectedCategoryId,
      restaurantId,
      accessToken,
      refreshAccessToken,
    });

    setBookmarks((prev) =>
      prev.filter((bookmark) => bookmark.restaurantId !== restaurantId)
    );

    setCategories((prev) =>
      prev.map((category) =>
        category.bookmarkCategoryId === selectedCategoryId
          ? {
              ...category,
              bookmarkCount: Math.max(0, category.bookmarkCount - 1),
            }
          : category
      )
    );
  } catch (error) {
    console.error(error);
    alert("맛집 삭제에 실패했어요.");
    }
  }



  if (authLoading) {
    return <main style={styles.center}>로그인 확인 중...</main>;
  }

  if (!isLoggedIn) {
    return <main style={styles.center}>로그인이 필요해요.</main>;
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <button type="button" style={styles.iconButton} onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1 style={styles.title}>나의 맛집</h1>
        <div style={styles.headerRight}>
        </div>
      </header>

      <section style={styles.folderHeader}>
        <h2 style={styles.folderTitle}>카테고리</h2>
        <button
          type="button"
          style={styles.addFolderButton}
          onClick={() => setIsCreateCategoryOpen(true)}
        >
          + 카테고리
        </button>
      </section>

      <section style={styles.folderList}>

        {categories.map((category) => (
          <FolderCard
            key={category.bookmarkCategoryId}
            name={category.bookmarkCategoryName}
            count={category.bookmarkCount}
            active={selectedCategoryId === category.bookmarkCategoryId}
            isDefault={category.isDefault}
            onClick={() => handleSelectCategory(category.bookmarkCategoryId)}
            onDelete={() => handleDeleteCategory(category.bookmarkCategoryId)}
          />
        ))}
      </section>

      <section style={styles.listHeader}>
        <h2 style={styles.listTitle}>
          {selectedTitle} <span>{bookmarks.length}</span>
        </h2>
        <button type="button" style={styles.sortButton}>
          최근 추가순⌄
        </button>
      </section>

      {isLoading ? (
        <div style={styles.emptyBox}>불러오는 중...</div>
      ) : bookmarks.length === 0 ? (
        <div style={styles.emptyBox}>저장된 맛집이 없어요.</div>
      ) : (
        <section style={styles.restaurantList}>
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.bookmarkId}
              style={styles.restaurantCard}
              onClick={() => navigate(`/restaurants/${bookmark.restaurantId}`)}
            >
              <button
                type="button"
                style={styles.restaurantDeleteButton}
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteRestaurant(bookmark.restaurantId);
                }}
                aria-label="맛집 삭제"
              >
                ×
              </button>
              <img
                src={bookmark.imageUrl ?? DEFAULT_IMAGE}
                alt={bookmark.restaurantName}
                style={styles.restaurantImage}
              />

              <div style={styles.restaurantInfo}>
                <h3 style={styles.restaurantName}>{bookmark.restaurantName}</h3>

                <p style={styles.ratingLine}>
                  <span style={styles.star}>★</span> 4.6{" "}
                  <span style={styles.reviewCount}>(312)</span>
                </p>

                <div style={styles.tagRow}>
                  <span style={styles.greenTag}>혼밥 가능</span>
                  <span style={styles.greenTag}>웨이팅 적음</span>
                
                </div>

                <p style={styles.locationLine}>⌖ {bookmark.address}</p>
              </div>

              <div style={styles.scoreBox}>
                <strong style={styles.scorePercent}>98%</strong>
                <span style={styles.scoreLabel}>찐맛집 지수</span>
              </div>
              </div>
          ))}
        </section>
      )}

      {/* TODO: BookmarkMapPage연결 */}
      <button type="button" onClick={() => navigate(`/bookmark-map/${selectedCategoryId}`)} style={styles.mapButton}>
        🗺️ {selectedTitle} 지도 보기 ›
      </button>

      {isCreateCategoryOpen &&
        createPortal(
          <div
            style={styles.createCategoryOverlay}
            onClick={() => setIsCreateCategoryOpen(false)}
          >
            <section
              style={styles.createCategoryModal}
              onClick={(event) => event.stopPropagation()}
            >
              <h2 style={styles.createCategoryTitle}>새 카테고리 만들기</h2>
              <p style={styles.createCategoryDescription}>
                저장하고 싶은 맛집을 분류할 카테고리명을 입력해주세요.
              </p>

              <input
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="예: 또갈 곳, 데이트 맛집"
                maxLength={100}
                style={styles.createCategoryInput}
              />

              <div style={styles.createCategoryActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setIsCreateCategoryOpen(false)}
                >
                  취소
                </button>

                <button
                  type="button"
                  style={styles.confirmButton}
                  disabled={isCreatingCategory}
                  onClick={handleCreateCategory}
                >
                  {isCreatingCategory ? "생성 중..." : "생성"}
                </button>
              </div>
            </section>
          </div>,
          document.body
        )}
    </main>
  );
}

function FolderCard({
  name,
  count,
  active,
  isDefault,
  onClick,
  onDelete,
}: {
  name: string;
  count: number;
  active: boolean;
  isDefault: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.folderCard,
        ...(active ? styles.activeFolderCard : {}),
      }}
    >
      {!isDefault && (
        <span
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          style={styles.folderDeleteButton}
        >
          ×
        </span>
      )}

      <span style={{ ...styles.folderIcon, color: active ? "#ff5a00" : "#8b8f98" }}>
        ▭
      </span>
      <strong style={{ color: active ? "#ff5a00" : "#111" }}>{name}</strong>
      <span style={{ color: active ? "#ff5a00" : "#7b8190" }}>{count}</span>
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#fff",
    padding: "18px 18px 96px",
    boxSizing: "border-box",
  },
  center: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#fff",
    color: "#777",
  },
  header: {
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
  },
  headerRight: {
    display: "flex",
    gap: 10,
  },
  iconButton: {
    border: "none",
    background: "transparent",
    fontSize: 30,
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
  },
  folderHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  folderTitle: {
    margin: 0,
    fontSize: 21,
    fontWeight: 900,
  },
  addFolderButton: {
    border: "1px solid #ddd",
    background: "#fff",
    borderRadius: 14,
    padding: "9px 14px",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },
  folderList: {
    display: "flex",
    gap: 12,
    overflowX: "auto",
    paddingBottom: 22,
  },
  folderCard: {
    minWidth: 92,
    height: 96,
    border: "1px solid #dedede",
    borderRadius: 18,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    cursor: "pointer",
    fontSize: 15,
    position: "relative"
  },
  activeFolderCard: {
    border: "1.5px solid #ff5a00",
    background: "#fff7f2",
  },
  folderIcon: {
    fontSize: 28,
    lineHeight: 1,
  },
  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  listTitle: {
    margin: 0,
    fontSize: 21,
    fontWeight: 900,
  },
  sortButton: {
    border: "none",
    background: "transparent",
    color: "#333",
    fontSize: 15,
    cursor: "pointer",
  },
  restaurantList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  restaurantCard: {
  width: "100%",
  minHeight: 0,
  border: "1px solid #eee",
  borderRadius: 16,
  background: "#fff",
  padding: 0,
  display: "grid",
  gridTemplateColumns: "100px 1fr 62px",
  overflow: "hidden",
  cursor: "pointer",
  textAlign: "left",
  position: "relative",
  },

  restaurantImage: {
    width: 100,
    height: "100%",
    objectFit: "cover",
  },

  restaurantInfo: {
    padding: "12px 8px 10px 14px",
    minWidth: 0,
  },

  restaurantName: {
    margin: "0 0 6px",
    fontSize: 16,
    fontWeight: 900,
    color: "#111",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  ratingLine: {
    margin: "0 0 10px",
    fontSize: 15,
    color: "#222",
  },
  star: {
    color: "#ff6b00",
  },
  reviewCount: {
    color: "#7b8190",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  greenTag: {
    background: "#e8f7ed",
    color: "#18864b",
    borderRadius: 7,
    padding: "5px 7px",
    fontSize: 12,
    fontWeight: 700,
  },
  locationLine: {
    margin: 0,
    color: "#7b8190",
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  scoreBox: {
  padding: "12px 8px 10px 0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "#ff5a00",
  },

  scorePercent: {
    fontSize: 15,
    fontWeight: 900,
    lineHeight: 1.1,
  },

  scoreLabel: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1.25,
    wordBreak: "keep-all",
  },
  mapButton: {
    width: "100%",
    height: 58,
    marginTop: 18,
    border: "none",
    borderRadius: 14,
    background: "#fff1e9",
    color: "#ff5a00",
    fontSize: 17,
    fontWeight: 900,
    cursor: "pointer",
  },
  emptyBox: {
    border: "1px solid #eee",
    borderRadius: 18,
    padding: 40,
    textAlign: "center",
    color: "#888",
  },

  restaurantDeleteButton: {
  position: "absolute",
  top: 6,
  right: 6,
  width: 20,
  height: 20,
  border: "none",
  borderRadius: "50%",
  background: "#eeeeee",
  color: "#999",
  fontSize: 14,
  fontWeight: 900,
  lineHeight: "20px",
  cursor: "pointer",
  zIndex: 5,
  },

  createCategoryOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 2147483647,
    background: "rgba(0, 0, 0, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    boxSizing: "border-box",
  },
  createCategoryModal: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 22,
    background: "#fff",
    padding: 22,
    boxSizing: "border-box",
  },
  createCategoryTitle: {
    margin: 0,
    fontSize: 21,
    fontWeight: 900,
    color: "#111",
  },
  createCategoryDescription: {
    margin: "8px 0 18px",
    fontSize: 14,
    lineHeight: 1.45,
    color: "#777",
  },
  createCategoryInput: {
    width: "100%",
    height: 48,
    border: "1px solid #eee",
    borderRadius: 14,
    padding: "0 14px",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box",
  },
  createCategoryActions: {
    display: "flex",
    gap: 10,
    marginTop: 18,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    border: "1px solid #eee",
    borderRadius: 14,
    background: "#fff",
    color: "#666",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },
  confirmButton: {
    flex: 1,
    height: 48,
    border: "none",
    borderRadius: 14,
    background: "#ff5a00",
    color: "#fff",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
  },
  folderDeleteButton: {
    position: "absolute",
    top: 6,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#f5f5f5",
    color: "#999",
    fontSize: 15,
    fontWeight: 900,
    display: "grid",
    placeItems: "center",
  },
};