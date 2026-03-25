import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  publicUserId: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  kycTier: number;
  status: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData?: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        // Check for stored user data
        const userDataStr = await AsyncStorage.getItem('user_data');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUser(userData);
        } else if (token.startsWith('demo_token_')) {
          // Demo mode - create default user
          setUser({
            id: '1',
            publicUserId: 'NERRA-DEMO',
            email: 'user@nerra.app',
            firstName: 'Demo',
            lastName: 'User',
            kycTier: 0,
            status: 'active',
          });
        }
      }
    } catch (error) {
      console.log('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string, userData?: User) => {
    if (userData) {
      setUser(userData);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } else if (token.startsWith('demo_token_')) {
      // Demo mode user
      const demoUser: User = {
        id: '1',
        publicUserId: 'NERRA-DEMO-' + Date.now(),
        email: 'user@nerra.app',
        firstName: 'User',
        lastName: 'Name',
        kycTier: 0,
        status: 'active',
      };
      setUser(demoUser);
      await AsyncStorage.setItem('user_data', JSON.stringify(demoUser));
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await AsyncStorage.removeItem('user_data');
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    AsyncStorage.setItem('user_data', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
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