import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppUser = {
  name: string;
  email: string;
  hasPaid: boolean;
};

type AuthContextType = {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, hasPaid: boolean) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "prototype_users";
const CURRENT_USER_KEY = "prototype_current_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login: AuthContextType["login"] = async (email, password) => {
    // Password is not validated in prototype; only email lookup
    const raw = localStorage.getItem(USERS_KEY);
    const users: Array<AppUser & { password?: string }> = raw ? JSON.parse(raw) : [];
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return false;
    const nextUser: AppUser = { name: found.name, email: found.email, hasPaid: !!found.hasPaid };
    setUser(nextUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
    return true;
  };

  const signup: AuthContextType["signup"] = async (name, email, password, hasPaid) => {
    const raw = localStorage.getItem(USERS_KEY);
    const users: Array<AppUser & { password?: string }> = raw ? JSON.parse(raw) : [];
    // avoid duplicates in prototype
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }
    users.push({ name, email, hasPaid, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const value = useMemo(() => ({ user, login, signup, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
