import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { registerAuthFailureHandler } from "../services/api.js";
import * as authService from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On page load the in-memory token is gone, so try to restore the session via the refresh cookie.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await authService.refreshToken();
        const me = await authService.getCurrentUser();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    registerAuthFailureHandler(() => setUser(null));
  }, []);

  const login = useCallback(async (credentials) => {
    const loggedIn = await authService.loginUser(credentials);
    setUser(loggedIn);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logoutUser();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, initializing, isAuthenticated: !!user, login, logout }),
    [user, initializing, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
