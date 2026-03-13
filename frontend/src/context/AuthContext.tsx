import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";

type Role = "employee" | "manager" | "hr" | "super_admin";

type AuthUser = {
  id?: string;
  email: string;
  role: Role;
};

type AuthContextType = {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  login: (payload: { token: string; email: string; role: Role }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_KEY = "valenser_token";

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(token));

  useEffect(() => {
    const run = async (): Promise<void> => {
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      try {
        const me = await authApi.me(token);
        setUser({ id: me.id, email: me.email, role: me.role });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [token]);

  const value = useMemo<AuthContextType>(
    () => ({
      token,
      user,
      loading,
      login: (payload) => {
        localStorage.setItem(TOKEN_KEY, payload.token);
        setToken(payload.token);
        setUser({ email: payload.email, role: payload.role });
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      }
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
