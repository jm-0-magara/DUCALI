// src/components/dashboard/DashboardSidebar.tsx
import React from 'react';
import { User, MenuItem } from '../../types';

interface DashboardSidebarProps {
  user: User;
  menuItems: MenuItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardSidebar({ user, menuItems, activeTab, onTabChange }: DashboardSidebarProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-[#626F47] rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-3">
          {user.profileImage || user.name.charAt(0)}
        </div>
        <h3 className="text-white font-semibold">{user.name}</h3>
        <p className="text-slate-400 text-sm">
          {user.role === 'artisan' ? user.specialty : `Member since ${new Date(user.joinDate).toLocaleDateString()}`}
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-[#626F47] text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}