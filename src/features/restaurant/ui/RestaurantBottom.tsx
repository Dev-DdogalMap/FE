import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import BookmarkCategoryModal from "@/features/bookmark/ui/BookmarkCategoryModal";

const RestaurantBottom = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const { isLoggedIn, isLoading } = useAuth();

  const bookmarkButtonRef = useRef<HTMLButtonElement | null>(null);

  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [bookmarkAnchorRect, setBookmarkAnchorRect] = useState<DOMRect | null>(
    null
  );

  const numericRestaurantId = restaurantId ? Number(restaurantId) : null;

  const handleBookmarkClick = () => {
    if (!numericRestaurantId || Number.isNaN(numericRestaurantId)) {
      alert("음식점 정보를 찾을 수 없습니다.");
      return;
    }

    if (isLoading) return;

    if (!isLoggedIn) {
      alert("찜하기는 로그인이 필요합니다.");
      sessionStorage.setItem("redirectAfterLogin", `/restaurants/${restaurantId}`);
      navigate("/login");
      return;
    }

    setBookmarkAnchorRect(
      bookmarkButtonRef.current?.getBoundingClientRect() ?? null
    );
    setIsBookmarkModalOpen(true);
  };

  const handleVisitClick = () => {
    if (!restaurantId) {
      alert("음식점 정보를 찾을 수 없습니다.");
      return;
    }

    const visitPath = `/restaurants/${restaurantId}/visit`;

    if (isLoading) return;

    if (!isLoggedIn) {
      alert("방문 인증은 로그인이 필요합니다.");
      sessionStorage.setItem("redirectAfterLogin", visitPath);
      navigate("/login");
      return;
    }

    navigate(visitPath);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
        <div className="w-full max-w-[430px] bg-white">
          <div className="flex gap-4 p-5">
            <button
              ref={bookmarkButtonRef}
              type="button"
              onClick={handleBookmarkClick}
              disabled={isLoading}
              className="h-12 flex-1 rounded-2xl border border-[#ff6b00] font-semibold text-[#ff6b00] disabled:border-gray-300 disabled:text-gray-300"
            >
              찜하기
            </button>

            <button
              type="button"
              onClick={handleVisitClick}
              disabled={isLoading}
              className="h-12 flex-1 rounded-2xl bg-[#ff6b00] font-semibold text-white disabled:bg-gray-300"
            >
              방문 인증
            </button>
          </div>
        </div>
      </div>

      <BookmarkCategoryModal
        isOpen={isBookmarkModalOpen}
        restaurantId={numericRestaurantId}
        anchorRect={bookmarkAnchorRect}
        onClose={() => setIsBookmarkModalOpen(false)}
      />
    </>
  );
};

export default RestaurantBottom;