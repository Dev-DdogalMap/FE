import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";

export default function OAuthSuccessPage() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const verifyLogin = async () => {
      const isAuthenticated = await checkAuth();

      if (!isAuthenticated) {
        alert("로그인에 실패했습니다.");
        navigate("/login", { replace: true });
        return;
      }

      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
      
      sessionStorage.removeItem("redirectAfterLogin");

      navigate(redirectPath, { replace: true });
    };

    verifyLogin();
  }, [checkAuth, navigate]);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] items-center justify-center bg-white px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF7A00]" />
          <p className="text-sm font-medium text-gray-600">
            로그인 처리 중...
          </p>
        </div>
      </div>
    </div>
  );
}