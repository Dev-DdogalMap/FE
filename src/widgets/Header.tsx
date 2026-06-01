import { Bell, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { useAuth } from "@/shared/auth/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, isLoading, checkAuth } = useAuth();
  const isChatRoute = location.pathname.startsWith("/chat");

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      await checkAuth();
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <header className="sticky top-0 z-[9999] h-16 bg-white px-4">
      {isChatRoute ? (
        <div className="relative flex h-full items-center justify-between">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700"
            aria-label="메뉴"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            to="/chat"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-black tracking-tight text-[#ff4b0b]"
          >
            또갈지도°
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700"
            aria-label="알림"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="relative flex h-full items-center justify-center">
          <Link
            to="/"
            className="absolute left-1/2 top-1/2 z-[10000] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            aria-label="홈으로 이동"
          >
            <img src={logo} alt="또갈지도" className="h-8 w-auto" />
          </Link>

          {!isLoading &&
            (isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="absolute right-0 top-1/2 z-[10000] -translate-y-1/2 rounded-full bg-[#FF6B00] px-3.5 py-1.5 text-sm font-bold text-white active:scale-[0.98]"
              >
                로그아웃
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="absolute right-0 top-1/2 z-[10000] -translate-y-1/2 rounded-full bg-[#FF6B00] px-3.5 py-1.5 text-sm font-bold text-white active:scale-[0.98]"
              >
                로그인
              </button>
            ))}
        </div>
      )}
    </header>
  );
}
