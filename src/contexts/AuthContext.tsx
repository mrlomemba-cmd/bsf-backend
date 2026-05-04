import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as loginService, logout as logoutService, isAuthenticated, getToken } from '../services/authService';
import type { AuthState } from '../types';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: isAuthenticated(),
    token: getToken(),
    loading: false,
    error: null,
  });

  // Re-validate on mount
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: isAuthenticated(),
      token: getToken(),
    }));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const token = await loginService(email, password);
      setState({ isAuthenticated: true, token, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setState((prev) => ({ ...prev, loading: false, error: message, isAuthenticated: false }));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setState({ isAuthenticated: false, token: null, loading: false, error: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
