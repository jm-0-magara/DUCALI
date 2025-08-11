"use client";

import React, { useState } from 'react';
import { createAdminUser } from '../../lib/create-admin';

export default function AdminSetup() {
  const [formData, setFormData] = useState({
    email: 'admin@ducali.com',
    password: 'admin123',
    name: 'Admin User'
  });
  const [result, setResult] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult('Creating admin user...');
    
    const response = await createAdminUser(
      formData.email,
      formData.password,
      formData.name
    );
    
    if (response.success) {
      setResult('✅ Admin user created successfully! You can now login with these credentials.');
    } else {
      setResult(`❌ Failed to create admin user: ${response.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Setup</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Admin User
          </button>
        </form>
        
        {result && (
          <div className="mt-6 p-4 bg-slate-700 rounded-lg">
            <p className="text-white">{result}</p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            ⚠️ This page is for development/testing only. Remove in production.
          </p>
        </div>
      </div>
    </div>
  );
}
