// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, SignupData } from '../types';
import { mockUsers } from '../data';
import { PLATFORM_SETTINGS } from '../data/constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem(PLATFORM_SETTINGS.localStorageKeys.user);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading saved session:', error);
        localStorage.removeItem(PLATFORM_SETTINGS.localStorageKeys.user);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Find user in mock database
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        return { success: false, error: 'No account found with this email address' };
      }
      
      // In real app, you'd verify password with backend
      // For demo, we'll accept any password except 'wrong'
      if (password === 'wrong') {
        return { success: false, error: 'Invalid password' };
      }
      
      setUser(foundUser);
      localStorage.setItem(PLATFORM_SETTINGS.localStorageKeys.user, JSON.stringify(foundUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists' };
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        joinDate: new Date().toISOString(),
        verified: false,
        ...(userData.role === 'artisan' && {
          specialty: userData.specialty,
          location: userData.location,
          portfolio: []
        }),
        ...(userData.role === 'customer' && {
          orders: []
        })
      };
      
      // Add to mock database
      mockUsers.push(newUser);
      
      setUser(newUser);
      localStorage.setItem(PLATFORM_SETTINGS.localStorageKeys.user, JSON.stringify(newUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(PLATFORM_SETTINGS.localStorageKeys.user);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isArtisan: user?.role === 'artisan',
    isCustomer: user?.role === 'customer'
  };

  return (
    <AuthContext.Provider value={value}>
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