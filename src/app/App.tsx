import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "@/shared/auth/AuthContext";
import SplashScreen from "@/pages/splash/SplashScreen";

import { router } from "./router/router";

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

  return (
    <AuthProvider>
      {showSplash ? <SplashScreen /> : <RouterProvider router={router} />}
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}