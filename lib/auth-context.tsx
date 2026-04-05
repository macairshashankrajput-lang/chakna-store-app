/**
 * Authentication Context
 * Manages user authentication state, role-based routing, and Firebase integration
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  deliveryLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  referralCode?: string;
  createdAt: string;
}

export interface AuthState {
  isLoading: boolean;
  isSignout: boolean;
  user: User | null;
  userToken: string | null;
  error: string | null;
}

export type AuthAction =
  | { type: 'RESTORE_TOKEN'; payload: { token: string | null; user: User | null } }
  | { type: 'SIGN_IN_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'SIGN_UP_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  isLoading: true,
  isSignout: false,
  user: null,
  userToken: null,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        isLoading: false,
        userToken: action.payload.token,
        user: action.payload.user,
      };
    case 'SIGN_IN_SUCCESS':
      return {
        ...state,
        isSignout: false,
        userToken: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case 'SIGN_UP_SUCCESS':
      return {
        ...state,
        isSignout: false,
        userToken: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        userToken: null,
        user: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  restoreToken: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore token on app launch
  const restoreToken = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      dispatch({ type: 'RESTORE_TOKEN', payload: { token, user } });
    } catch (e) {
      console.error('Failed to restore token:', e);
      dispatch({ type: 'RESTORE_TOKEN', payload: { token: null, user: null } });
    }
  }, []);

  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });

      // TODO: Integrate with Firebase Authentication
      // For now, using mock implementation
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email,
        name: email.split('@')[0],
        phone: '',
        role: 'customer',
        createdAt: new Date().toISOString(),
      };

      const mockToken = 'token_' + Date.now();

      await AsyncStorage.setItem('userToken', mockToken);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));

      dispatch({
        type: 'SIGN_IN_SUCCESS',
        payload: { token: mockToken, user: mockUser },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const signUp = useCallback(async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });

      // TODO: Integrate with Firebase Authentication
      // For now, using mock implementation
      const mockUser: User = {
        ...userData,
        id: 'user_' + Date.now(),
        createdAt: new Date().toISOString(),
      };

      const mockToken = 'token_' + Date.now();

      await AsyncStorage.setItem('userToken', mockToken);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));

      dispatch({
        type: 'SIGN_UP_SUCCESS',
        payload: { token: mockToken, user: mockUser },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // TODO: Integrate with Firebase Authentication
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = {
    state,
    signIn,
    signUp,
    signOut,
    restoreToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
