import { AuthProvider } from "@/shared/auth/AuthContext";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./router/router";
import SplashScreen from "@/pages/splash/SplashScreen";
import { useEffect, useState } from "react";

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem("hasSeenSplash") !== "true";
  });

  useEffect(() => {
    if (!showSplash) return;

    sessionStorage.setItem("hasSeenSplash", "true");

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}