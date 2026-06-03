import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { API_BASE_URL } from "@/shared/config/api";
import { getStoredAccessToken } from "@/shared/auth/token";

type User = {
  userId: number;
};

type AuthContextValue = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  accessToken: string | null;
  checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const token = getStoredAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "GET",
        credentials: "include",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      if (!response.ok) {
        setUser(null);
        return false;
      }

      const data = await response.json();
      setUser(data);

      // 토큰 가져오기
      const tokenResponse = await fetch(`${API_BASE_URL}/api/chat-rooms/auth/token`, {
        method: "GET",
        credentials: "include",
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        setAccessToken(tokenData.accessToken); // 메모리에 저장
      }

      return true;
    } catch (error) {
      console.error(error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, accessToken, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서 사용해야 합니다.");
  }

  return context;
}
