// src/components/auth/SignupModal.tsx
"use client";

import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, MapPin, Briefcase, Loader2, AlertCircle, CheckCircle, Check, X as XIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  darkMode?: boolean;
}

export default function SignupModal({ isOpen, onClose, onSwitchToLogin, darkMode = true }: SignupModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const { signup } = useAuth();

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    Object.values(checks).forEach(check => {
      if (check) strength++;
    });

    return { strength, checks };
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'text-red-500';
    if (strength <= 3) return 'text-orange-500';
    if (strength <= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
        } else if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])/.test(value)) {
          errors.password = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          errors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          errors.password = 'Password must contain at least one number';
        } else if (!/(?=.*[^A-Za-z0-9])/.test(value)) {
          errors.password = 'Password must contain at least one special character';
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;
        
      case 'firstName':
        if (!value.trim()) {
          errors.firstName = 'First name is required';
        } else if (value.trim().length < 2) {
          errors.firstName = 'First name must be at least 2 characters';
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          errors.lastName = 'Last name is required';
        } else if (value.trim().length < 2) {
          errors.lastName = 'Last name must be at least 2 characters';
        }
        break;
        
      case 'specialty':
        if (formData.role === 'artisan' && !value.trim()) {
          errors.specialty = 'Specialty is required for artisans';
        }
        break;
        
      case 'location':
        if (formData.role === 'artisan' && !value) {
          errors.location = 'Location is required for artisans';
        }
        break;
    }
    
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    // Comprehensive validation
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

    const result = await signup({
      name: `${formData.firstName} ${formData.lastName}`,
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
        firstName: '',
        lastName: '',
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

  const locations = [
    'Nairobi', 'Mombasa', 'Nakuru', 'Kisumu', 'Eldoret', 'Thika', 'Machakos', 'Nyeri'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl max-w-md w-full border shadow-2xl max-h-[90vh] overflow-y-auto ${
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
                              Join <span className="font-playfair">Ducali</span>
            </h2>
            <p className={`text-sm mt-1 ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Create your account to get started
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
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Social Signup Section */}
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
          {/* Account Type */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              I want to join as a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'customer' })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.role === 'customer'
                    ? 'border-muted-gold bg-muted-gold/10 text-muted-gold shadow-md'
                    : `border-slate-300 hover:border-muted-gold/50 hover:shadow-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-semibold">Customer</div>
                <div className="text-xs opacity-75">Find artisans</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'artisan' })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.role === 'artisan'
                    ? 'border-muted-gold bg-muted-gold/10 text-muted-gold shadow-md'
                    : `border-slate-300 hover:border-muted-gold/50 hover:shadow-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`
                }`}
              >
                <Briefcase className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-semibold">Artisan</div>
                <div className="text-xs opacity-75">Offer services</div>
              </button>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-cream' : 'text-slate-700'
              }`}>
                First Name
              </label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  darkMode ? 'text-slate-500' : 'text-slate-400'
                }`} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl placeholder:transition-colors focus:outline-none focus:ring-2 focus:ring-muted-gold/20 focus:border-muted-gold ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-600 text-cream placeholder-slate-500 focus:bg-slate-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                  placeholder="First name"
                />
                {validationErrors.firstName && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.firstName}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-cream' : 'text-slate-700'
              }`}>
                Last Name
              </label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  darkMode ? 'text-slate-500' : 'text-slate-400'
                }`} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl placeholder:transition-colors focus:outline-none focus:ring-2 focus:ring-muted-gold/20 focus:border-muted-gold ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-600 text-cream placeholder-slate-500 focus:bg-slate-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                  placeholder="Last name"
                />
                {validationErrors.lastName && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.lastName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

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

          {/* Artisan-specific fields */}
          {formData.role === 'artisan' && (
            <>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-cream' : 'text-slate-700'
                }`}>
                  Specialty
                </label>
                <div className="relative">
                  <Briefcase className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl placeholder:transition-colors focus:outline-none focus:ring-2 focus:ring-muted-gold/20 focus:border-muted-gold ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-600 text-cream placeholder-slate-500 focus:bg-slate-700' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                    }`}
                    placeholder="e.g., Custom Wedding Dresses, Furniture Making"
                  />
                  {validationErrors.specialty && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{validationErrors.specialty}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-cream' : 'text-slate-700'
                }`}>
                  Location
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-muted-gold/20 focus:border-muted-gold ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-600 text-cream focus:bg-slate-700' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                    }`}
                  >
                    <option value="">Select your location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  {validationErrors.location && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{validationErrors.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Password Field with Strength Indicator */}
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
                placeholder="Create a strong password"
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
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-3 space-y-3">
                {/* Strength Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${getStrengthColor(passwordStrength.strength)}`}>
                      {getStrengthText(passwordStrength.strength)}
                    </span>
                    <span className={`text-xs ${getStrengthColor(passwordStrength.strength)}`}>
                      {passwordStrength.strength}/5
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength <= 2 ? 'bg-red-500' :
                        passwordStrength.strength <= 3 ? 'bg-orange-500' :
                        passwordStrength.strength <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="space-y-2">
                  <p className={`text-xs font-medium ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Password requirements:
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {[
                      { key: 'length', label: 'At least 8 characters', met: passwordStrength.checks.length },
                      { key: 'lowercase', label: 'One lowercase letter', met: passwordStrength.checks.lowercase },
                      { key: 'uppercase', label: 'One uppercase letter', met: passwordStrength.checks.uppercase },
                      { key: 'number', label: 'One number', met: passwordStrength.checks.number },
                      { key: 'special', label: 'One special character', met: passwordStrength.checks.special }
                    ].map((requirement) => (
                      <div key={requirement.key} className="flex items-center gap-2">
                        {requirement.met ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <XIcon className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs ${
                          requirement.met 
                            ? 'text-green-600' 
                            : darkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {requirement.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {validationErrors.password && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{validationErrors.password}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-slate-500' : 'text-slate-400'
              }`} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl placeholder:transition-colors focus:outline-none focus:ring-2 focus:ring-muted-gold/20 focus:border-muted-gold ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-600 text-cream placeholder-slate-500 focus:bg-slate-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  darkMode ? 'text-slate-500 hover:text-cream' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{validationErrors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-4 h-4 mt-1 text-muted-gold bg-slate-100 border-slate-300 rounded focus:ring-muted-gold focus:ring-2"
            />
            <label className={`text-sm leading-relaxed ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              I agree to the{' '}
              <button type="button" className="text-muted-gold hover:text-muted-gold/80 font-medium">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-muted-gold hover:text-muted-gold/80 font-medium">
                Privacy Policy
              </button>
            </label>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-muted-gold text-white py-4 px-6 rounded-xl hover:bg-muted-gold/90 transition-all duration-200 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Your Account'
            )}
          </button>

          {/* Switch to Login */}
          <div className={`text-center pt-4 border-t ${
            darkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <p className={`text-sm ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-muted-gold hover:text-muted-gold/80 transition-colors font-semibold"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}