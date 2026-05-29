import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { AuthProvider } from "@/shared/auth/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}