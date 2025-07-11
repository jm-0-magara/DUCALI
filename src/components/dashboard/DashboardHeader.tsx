// src/components/dashboard/DashboardHeader.tsx
import React from 'react';
import Link from 'next/link';
import { User } from '../../types';

interface DashboardHeaderProps {
  user: User;
  logout: () => void;
}

export function DashboardHeader({ user, logout }: DashboardHeaderProps) {
  return (
    <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-[#A4B465]">Ducali</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-300">
              {user.role === 'customer' ? 'Customer' : 'Artisan'} Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white font-medium">{user.name}</div>
              <div className="text-slate-400 text-sm capitalize">
                {user.role === 'artisan' ? user.specialty : user.role}
              </div>
            </div>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}