import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { SESSION_KEY } from "@/utils/storage";

/**
 * DEMONSTRATION AUTHENTICATION ONLY — credentials are checked in the browser.
 * This is not production security; replace with a real auth API.
 */
export const DEMO_CREDENTIALS = { email: "admin@example.com", password: "admin123" };

const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const login = useCallback((email, password) => {
    const ok = email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
    if (!ok) return { ok: false, error: "Invalid email or password." };
    const next = { email: DEMO_CREDENTIALS.email, name: "Admin User", role: "Super Admin", loggedInAt: new Date().toISOString() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setSession(next);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, isAuthenticated: Boolean(session), login, logout }), [session, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
