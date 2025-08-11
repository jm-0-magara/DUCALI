// src/components/auth/LoginModal.tsx
"use client";

import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1C] rounded-xl max-w-md w-full p-6 border border-[#B08D57]/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#FDF6F0]">Welcome Back</h2>
          <button
            onClick={onClose}
            className="text-[#FDF6F0]/60 hover:text-[#FDF6F0] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-[#FDF6F0] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FDF6F0]/60 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#1D2D50] border border-[#B08D57]/30 rounded-lg text-[#FDF6F0] placeholder-[#FDF6F0]/40 focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57]"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-[#FDF6F0] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FDF6F0]/60 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-3 bg-[#1D2D50] border border-[#B08D57]/30 rounded-lg text-[#FDF6F0] placeholder-[#FDF6F0]/40 focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57]"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FDF6F0]/60 hover:text-[#FDF6F0] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Demo Credentials */}
          <div className="bg-[#1D2D50] rounded-lg p-3">
            <p className="text-[#FDF6F0] text-sm font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-[#FDF6F0]/60">
              <p><strong>Artisan:</strong> sarah@example.com (any password)</p>
              <p><strong>Customer:</strong> john@example.com (any password)</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#6E1414] text-[#FDF6F0] py-3 px-4 rounded-lg hover:bg-[#6E1414]/80 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              className="text-[#B08D57] hover:text-[#B08D57]/80 transition-colors text-sm"
            >
              Forgot your password?
            </button>
          </div>

          {/* Switch to Signup */}
          <div className="text-center pt-4 border-t border-[#B08D57]/20">
            <p className="text-[#FDF6F0]/60 text-sm">
              Don&#39;t have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-[#B08D57] hover:text-[#B08D57]/80 transition-colors font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}