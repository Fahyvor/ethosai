import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { getToken, setToken, getUser, setUser, clearAuth } from '../lib/auth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: string;
    organization?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setCurrentUser] = useState<User | null>(getUser());
  const [token, setCurrentToken] = useState<string | null>(getToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const existingToken = getToken();
      if (existingToken) {
        try {
          const res = await api.get('/auth/me');
          const userData: User = {
            id: res.data._id || res.data.id,
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
            organization: res.data.organization,
          };
          setUser(userData);
          setCurrentUser(userData);
        } catch {
          clearAuth();
          setCurrentUser(null);
          setCurrentToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    setCurrentToken(receivedToken);
    setCurrentUser(receivedUser);
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    role: string;
    organization?: string;
  }) => {
    const res = await api.post('/auth/register', payload);
    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    setCurrentToken(receivedToken);
    setCurrentUser(receivedUser);
  };

  const logout = () => {
    clearAuth();
    setCurrentToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
