// src/components/auth/LoginModal.tsx
"use client";

import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  darkMode?: boolean;
}

export default function LoginModal({ isOpen, onClose, onSwitchToSignup, darkMode = true }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth();

  // Real-time validation
  const validateField = (name: string, value: string) => {
    const errors: {[key: string]: string} = {};
    
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        }
        break;
        
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        }
        break;
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    const allErrors: {[key: string]: string} = {};
    
    Object.keys(formData).forEach(key => {
      const fieldErrors = validateField(key, formData[key as keyof typeof formData]);
      Object.assign(allErrors, fieldErrors);
    });

    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      setError('Please fix the errors below');
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({});

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      // Reset form
      setFormData({ email: '', password: '' });
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear general error when user starts typing
    if (error) setError('');
    
    // Real-time validation
    const fieldErrors = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      ...fieldErrors
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl max-w-md w-full border shadow-2xl ${
        darkMode 
          ? 'bg-slate-900 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4">
          <div>
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-cream' : 'text-slate-900'
            }`}>
              Welcome back
            </h2>
            <p className={`text-sm mt-1 ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Sign in to your account to continue
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              darkMode 
                ? 'text-slate-400 hover:text-cream hover:bg-slate-800' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />d
          </button>
        </div>

        {/* Social Login Section */}
        <div className="px-6 pb-6">
          <div className="space-y-3">
            <button className="w-full bg-white text-slate-900 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-3 font-medium shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            <div className="relative">
              <div className={`absolute inset-0 flex items-center ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 ${
                  darkMode ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'
                }`}>
                  Or continue with
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* Email Field */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-slate-500' : 'text-slate-400'
              }`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl placeholder:transition-colors focus:outline-none focus:ring-2 focus:ring-muted-gold/20 focus:border-muted-gold ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-600 text-cream placeholder-slate-500 focus:bg-slate-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
                placeholder="Enter your email address"
              />
              {validationErrors.email && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-slate-500' : 'text-slate-400'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl placeholder:transition-colors focus:outline-none focus:ring-2 focus:ring-muted-gold/20 focus:border-muted-gold ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-600 text-cream placeholder-slate-500 focus:bg-slate-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  darkMode ? 'text-slate-500 hover:text-cream' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {validationErrors.password && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.password}</span>
                </div>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-muted-gold bg-slate-100 border-slate-300 rounded focus:ring-muted-gold focus:ring-2"
              />
              <span className={`text-sm ${
                darkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="text-sm text-muted-gold hover:text-muted-gold/80 transition-colors font-medium"
            >
              Forgot password?
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-500 text-sm font-medium">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-500 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Demo Credentials */}
          <div className={`rounded-xl p-4 ${
            darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-50 border border-slate-200'
          }`}>
            <p className={`text-sm font-semibold mb-3 ${
              darkMode ? 'text-cream' : 'text-slate-900'
            }`}>
              🚀 Demo Credentials
            </p>
            <div className={`space-y-2 text-xs ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span><strong>Artisan:</strong> sarah@example.com (any password)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span><strong>Customer:</strong> john@example.com (any password)</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-muted-gold text-white py-4 px-6 rounded-xl hover:bg-muted-gold/90 transition-all duration-200 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In to Your Account'
            )}
          </button>

          {/* Switch to Signup */}
          <div className={`text-center pt-4 border-t ${
            darkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <p className={`text-sm ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Don&#39;t have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-muted-gold hover:text-muted-gold/80 transition-colors font-semibold"
              >
                Create one now
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}