import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { API_BASE_URL } from "@/shared/config/api";

type User = {
  userId: number;
  nickname?: string;
  profileImageUrl?: string;
};

type AuthContextValue = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  accessToken: string | null;
  checkAuth: () => Promise<boolean>;
  refreshAccessToken: () => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        setAccessToken(null);
        return null;
      }

      const data = await response.json();

      setAccessToken(data.accessToken);

      setUser({
        userId: data.userId,
        nickname: data.nickname,
        profileImageUrl: data.profileImageUrl,
      });

      return data.accessToken;
    } catch (error) {
      console.error(error);
      setUser(null);
      setAccessToken(null);
      return null;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      const newAccessToken = await refreshAccessToken();

      return !!newAccessToken;
    } finally {
      setIsLoading(false);
    }
  }, [refreshAccessToken]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user && !!accessToken,
        isLoading,
        accessToken,
        checkAuth,
        refreshAccessToken,
        logout,
      }}
    >
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