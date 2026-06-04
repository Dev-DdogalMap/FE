import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";

export default function RequireAuth() {
  const location = useLocation();
  const { checkAuth } = useAuth();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">(
    "loading"
  );

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) {
          setStatus("unauthenticated");
          return;
        }

        setStatus("authenticated");
      } catch (error) {
        console.error(error);
        setStatus("unauthenticated");
      }
    };

    checkLogin();
  }, [checkAuth]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-gray-500">로그인 확인 중...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
