// src/components/auth/SignupModal.tsx
"use client";

import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, MapPin, Briefcase, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'customer' | 'artisan',
    specialty: '',
    location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.role === 'artisan' && !formData.specialty) {
      setError('Please specify your specialty');
      return;
    }

    if (formData.role === 'artisan' && !formData.location) {
      setError('Please specify your location');
      return;
    }

    setIsSubmitting(true);

    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      specialty: formData.specialty,
      location: formData.location
    });
    
    if (result.success) {
      setSuccess('Account created successfully! Redirecting...');
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        specialty: '',
        location: ''
      });
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } else {
      setError(result.error || 'Signup failed');
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const locations = [
    'Nairobi', 'Mombasa', 'Nakuru', 'Kisumu', 'Eldoret', 'Thika', 'Machakos', 'Nyeri'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1C] rounded-xl max-w-md w-full p-6 border border-[#B08D57]/20 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#FDF6F0]">Join Ducali</h2>
          <button
            onClick={onClose}
            className="text-[#FDF6F0]/60 hover:text-[#FDF6F0] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-[#FDF6F0] mb-2">
              I want to join as a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'customer' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.role === 'customer'
                    ? 'border-[#B08D57] bg-[#B08D57]/10 text-[#B08D57]'
                    : 'border-[#B08D57]/30 text-[#FDF6F0]/60 hover:border-[#B08D57]/50'
                }`}
              >
                <User className="w-5 h-5 mx-auto mb-1" />
                <div className="text-sm font-medium">Customer</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'artisan' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.role === 'artisan'
                    ? 'border-[#B08D57] bg-[#B08D57]/10 text-[#B08D57]'
                    : 'border-[#B08D57]/30 text-[#FDF6F0]/60 hover:border-[#B08D57]/50'
                }`}
              >
                <Briefcase className="w-5 h-5 mx-auto mb-1" />
                <div className="text-sm font-medium">Artisan</div>
              </button>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-[#FDF6F0] mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FDF6F0]/60 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#1D2D50] border border-[#B08D57]/30 rounded-lg text-[#FDF6F0] placeholder-[#FDF6F0]/40 focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57]"
                placeholder="Enter your full name"
              />
            </div>
          </div>

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

          {/* Artisan-specific fields */}
          {formData.role === 'artisan' && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#FDF6F0] mb-2">
                  Specialty
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FDF6F0]/60 w-5 h-5" />
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#1D2D50] border border-[#B08D57]/30 rounded-lg text-[#FDF6F0] placeholder-[#FDF6F0]/40 focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57]"
                    placeholder="e.g., Custom Wedding Dresses, Furniture Making"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#FDF6F0] mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FDF6F0]/60 w-5 h-5" />
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#1D2D50] border border-[#B08D57]/30 rounded-lg text-[#FDF6F0] focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57]"
                  >
                    <option value="">Select your location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Password Fields */}
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
                placeholder="Create a password"
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

          <div>
            <label className="block text-sm font-medium text-[#FDF6F0] mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FDF6F0]/60 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-3 bg-[#1D2D50] border border-[#B08D57]/30 rounded-lg text-[#FDF6F0] placeholder-[#FDF6F0]/40 focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57]"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FDF6F0]/60 hover:text-[#FDF6F0] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#6E1414] text-[#FDF6F0] py-3 px-4 rounded-lg hover:bg-[#6E1414]/80 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Switch to Login */}
          <div className="text-center pt-4 border-t border-[#B08D57]/20">
            <p className="text-[#FDF6F0]/60 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#B08D57] hover:text-[#B08D57]/80 transition-colors font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}