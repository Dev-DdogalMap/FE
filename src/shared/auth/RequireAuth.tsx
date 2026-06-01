import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RequireAuth() {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">(
    "loading"
  );

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
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
  }, []);

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