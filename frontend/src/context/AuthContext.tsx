import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  tier: 'free' | 'premium' | 'business';
  usageCountToday: number;
  maxQuotaToday: number;
}

export interface ProcessingHistoryItem {
  id: string;
  toolName: string;
  fileName: string;
  fileSize: number;
  timestamp: string;
  status: 'completed' | 'failed';
}

interface AuthContextType {
  user: User | null;
  history: ProcessingHistoryItem[];
  login: (email: string, role?: 'user' | 'admin') => void;
  register: (name: string, email: string) => void;
  logout: () => void;
  upgradeToPro: () => void;
  addHistoryItem: (toolName: string, fileName: string, fileSize: number) => void;
  clearHistory: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('simplepdf_user') || localStorage.getItem('iloveyoupdf_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [history, setHistory] = useState<ProcessingHistoryItem[]>(() => {
    const saved = localStorage.getItem('simplepdf_history') || localStorage.getItem('iloveyoupdf_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('simplepdf_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('simplepdf_user');
      localStorage.removeItem('iloveyoupdf_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('simplepdf_history', JSON.stringify(history));
  }, [history]);

  const login = (email: string, role: 'user' | 'admin' = 'user') => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      tier: 'free',
      usageCountToday: 0,
      maxQuotaToday: 15,
    };
    setUser(newUser);

    // Sync with backend database in background
    ApiService.loginUser(email)
      .then((res) => {
        if (res && res.user) {
          setUser({
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            tier: res.user.tier,
            usageCountToday: res.user.usageToday || 0,
            maxQuotaToday: res.user.tier === 'free' ? 15 : 9999,
          });
        }
      })
      .catch((err) => console.warn('[AuthContext] Backend sync offline, using local session:', err));
  };

  const register = (name: string, email: string) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'user',
      tier: 'free',
      usageCountToday: 0,
      maxQuotaToday: 15,
    };
    setUser(newUser);

    // Sync with backend database in background
    ApiService.registerUser(name, email)
      .then((res) => {
        if (res && res.user) {
          setUser({
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            tier: res.user.tier,
            usageCountToday: res.user.usageToday || 0,
            maxQuotaToday: 15,
          });
        }
      })
      .catch((err) => console.warn('[AuthContext] Backend sync offline, using local session:', err));
  };

  const logout = () => {
    setUser(null);
  };

  const upgradeToPro = () => {
    if (!user) return;
    setUser({
      ...user,
      tier: 'premium',
      maxQuotaToday: 9999,
    });

    // Notify backend
    ApiService.upgradeTier(user.id, 'premium')
      .then(() => console.log('[AuthContext] Cloud subscription upgraded to Pro.'))
      .catch((err) => console.warn('[AuthContext] Backend tier upgrade offline:', err));
  };

  const addHistoryItem = (toolName: string, fileName: string, fileSize: number) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const item: ProcessingHistoryItem = {
      id: `hist_${Date.now()}`,
      toolName,
      fileName,
      fileSize,
      timestamp: `Today, ${timeStr}`,
      status: 'completed',
    };
    setHistory((prev) => [item, ...prev]);
    if (user) {
      setUser((prev) => (prev ? { ...prev, usageCountToday: prev.usageCountToday + 1 } : null));
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        history,
        login,
        register,
        logout,
        upgradeToPro,
        addHistoryItem,
        clearHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
