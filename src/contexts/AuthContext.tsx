import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/types/vistoria';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: Record<string, { password: string; profile: UserProfile }> = {
  'master': {
    password: 'master123',
    profile: {
      id: '1',
      publicId: 'USR-MASTER-001',
      displayName: 'Administrador Master',
      role: 'master',
    },
  },
  'consultora': {
    password: 'cons123',
    profile: {
      id: '2',
      publicId: 'USR-CONS-001',
      displayName: 'Maria Consultora',
      role: 'consultora',
    },
  },
  'eventos': {
    password: 'eventos123',
    profile: {
      id: '3',
      publicId: 'USR-EVT-001',
      displayName: 'João Eventos',
      role: 'eventos',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('sos_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('sos_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = MOCK_USERS[username.toLowerCase()];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.profile);
      localStorage.setItem('sos_user', JSON.stringify(mockUser.profile));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sos_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
