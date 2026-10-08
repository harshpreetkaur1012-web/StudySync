import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; confirmPassword?: string }) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('studysync_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('studysync_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme to html root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('studysync_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Verify token on mount
  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('studysync_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.auth.getMe();
        setUser(res.user);
      } catch (err) {
        console.error('Session expired or invalid:', err);
        localStorage.removeItem('studysync_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    localStorage.setItem('studysync_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (data: { name: string; email: string; password: string; confirmPassword?: string }) => {
    const res = await api.auth.register(data);
    localStorage.setItem('studysync_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const demoLogin = async () => {
    return login('student@studysync.com', 'student123');
  };

  const logout = () => {
    localStorage.removeItem('studysync_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (updatedData: Partial<User>) => {
    const res = await api.auth.updateProfile(updatedData);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        theme,
        toggleTheme,
        login,
        register,
        demoLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
