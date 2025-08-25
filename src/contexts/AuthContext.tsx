// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, SignupData } from '../types';
import { PLATFORM_SETTINGS } from '../data';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  updateUserProfile, 
  onAuthStateChange,
  User as FirebaseUser
} from '../lib/firebase-auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Computed properties
  const isAuthenticated = !!user;
  const isArtisan = user?.role === 'artisan';
  const isCustomer = user?.role === 'customer';
  const isAdmin = user?.role === 'admin';

  // Listen to Firebase auth state changes
  useEffect(() => {
    console.log('Setting up Firebase auth state listener...');
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      
      if (firebaseUser) {
        console.log('Firebase user details:', firebaseUser);
        // Convert Firebase user to our User interface
        const convertedUser: User = {
          id: firebaseUser.id,
          email: firebaseUser.email,
          name: firebaseUser.name,
          role: firebaseUser.role,
          joinDate: firebaseUser.createdAt.toISOString(),
          verified: true, // Firebase users are verified by default
          profileImage: firebaseUser.profileImage || null,
          ...(firebaseUser.role === 'artisan' && {
            specialty: '',
            location: firebaseUser.location || '',
            portfolio: []
          }),
          ...(firebaseUser.role === 'customer' && {
            orders: []
          })
        };
        console.log('Converted user:', convertedUser);
        setUser(convertedUser);
        localStorage.setItem(PLATFORM_SETTINGS.localStorageKeys.user, JSON.stringify(convertedUser));
      } else {
        console.log('No Firebase user, clearing local state');
        setUser(null);
        localStorage.removeItem(PLATFORM_SETTINGS.localStorageKeys.user);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', email);
      const user = await loginUser(email, password);
      console.log('Login successful, user:', user);
      
      // Convert Firebase user to our User interface
      const convertedUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        joinDate: user.createdAt.toISOString(),
        verified: true, // Firebase users are verified by default
        profileImage: user.profileImage || null,
        ...(user.role === 'artisan' && {
          specialty: '',
          location: user.location || '',
          portfolio: []
        }),
        ...(user.role === 'customer' && {
          orders: []
        })
      };
      
      // Immediately set the user state for better UX
      setUser(convertedUser);
      localStorage.setItem(PLATFORM_SETTINGS.localStorageKeys.user, JSON.stringify(convertedUser));
      
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting signup with:', userData.email);
      const newUser = await registerUser(userData.email, userData.password, userData.name, userData.role);
      console.log('Signup successful, user created:', newUser);
      
      // Convert Firebase user to our User interface
      const convertedUser: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        joinDate: newUser.createdAt.toISOString(),
        verified: true, // Firebase users are verified by default
        profileImage: newUser.profileImage || null,
        ...(newUser.role === 'artisan' && {
          specialty: userData.specialty || '',
          location: newUser.location || '',
          portfolio: []
        }),
        ...(newUser.role === 'customer' && {
          orders: []
        })
      };
      
      // Immediately set the user state for better UX
      setUser(convertedUser);
      localStorage.setItem(PLATFORM_SETTINGS.localStorageKeys.user, JSON.stringify(convertedUser));
      
      return { success: true };
    } catch (err: any) {
      console.error('Signup error:', err);
      return { success: false, error: err.message || 'Signup failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem(PLATFORM_SETTINGS.localStorageKeys.user);
      
      // Redirect to homepage after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfileImage = async (profileImageUrl: string) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      // Update the user's profile image in Firebase
      await updateUserProfile(user.id, { profileImage: profileImageUrl });
      
      // Update local state
      const updatedUser = { ...user, profileImage: profileImageUrl };
      setUser(updatedUser);
      localStorage.setItem(PLATFORM_SETTINGS.localStorageKeys.user, JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile image:', error);
      return { success: false, error: error.message || 'Failed to update profile image' };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateProfileImage,
    isAuthenticated: !!user,
    isArtisan: user?.role === 'artisan',
    isCustomer: user?.role === 'customer',
    isAdmin: user?.role === 'admin'
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