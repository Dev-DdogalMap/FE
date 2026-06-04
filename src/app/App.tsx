import { AuthProvider } from "@/shared/auth/AuthContext";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./router/router";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}