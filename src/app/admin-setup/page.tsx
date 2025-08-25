"use client";

import React, { useState } from 'react';
import { Shield, User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSetupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: 'Admin user created successfully!' });
        setFormData({ email: '', password: '', name: '' });
      } else {
        setResult({ success: false, message: data.error || 'Failed to create admin user' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">Admin Setup</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create admin credentials for DUCALI
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-border placeholder-muted-foreground text-foreground bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-border placeholder-muted-foreground text-foreground bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-border placeholder-muted-foreground text-foreground bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter a strong password"
                  minLength={6}
                />
              </div>
            </div>
          </div>

          {/* Result Message */}
          {result && (
            <div className={`p-4 rounded-lg flex items-center space-x-3 ${
              result.success 
                ? 'bg-emerald-500/10 border border-emerald-500/20' 
                : 'bg-destructive/10 border border-destructive/20'
            }`}>
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-destructive" />
              )}
              <span className={`text-sm ${
                result.success ? 'text-emerald-600' : 'text-destructive'
              }`}>
                {result.message}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Admin...' : 'Create Admin User'}
          </button>

          {/* Info */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-primary text-sm">
              <strong>Note:</strong> This creates an admin user with full access to the admin dashboard. 
              Keep your credentials secure and only use this for development/testing.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
