import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";

const RestaurantBottom = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const { isLoggedIn, isLoading } = useAuth();

  const handleVisitClick = () => {
    if (!restaurantId) {
      alert("음식점 정보를 찾을 수 없습니다.");
      return;
    }

    const visitPath = `/restaurants/${restaurantId}/visit`;

    if (isLoading) {
      return;
    }

    if (!isLoggedIn) {
      alert("방문 인증은 로그인이 필요합니다.");

      sessionStorage.setItem("redirectAfterLogin", visitPath);

      navigate("/login");
      return;
    }

    navigate(visitPath);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-[430px] bg-white">
        <div className="flex gap-4 p-5">
          <button
            type="button"
            className="h-12 flex-1 rounded-2xl border border-[#ff6b00] font-semibold text-[#ff6b00]"
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
  );
};

export default RestaurantBottom;