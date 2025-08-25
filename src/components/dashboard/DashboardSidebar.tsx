// src/components/dashboard/DashboardSidebar.tsx
import React, { useState, useEffect } from 'react';
import { User, MenuItem } from '../../types';
import { X, Crown, Star, TrendingUp, Activity } from 'lucide-react';
import { ProfileImage } from '../OptimizedImage';
import { useTheme } from '../../contexts/ThemeContext';

interface DashboardSidebarProps {
  user: User;
  menuItems: MenuItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
}

export function DashboardSidebar({ user, menuItems, activeTab, onTabChange, onClose }: DashboardSidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={`h-full ${isDark ? 'bg-slate-900/90' : 'bg-white/90'} backdrop-blur-xl rounded-3xl border ${isDark ? 'border-slate-800/50' : 'border-slate-200/50'} shadow-2xl p-6 overflow-y-auto transition-all duration-300`}>
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end mb-6">
        <button 
          onClick={onClose}
          className={`p-2.5 ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'} transition-all duration-200 rounded-xl hover:scale-105`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="text-center mb-8">
        <div className="relative mx-auto mb-4 group">
          {user.profileImage ? (
            <div className="relative">
              <ProfileImage 
                src={user.profileImage} 
                alt={`${user.name}'s profile`}
                size={88}
                className="mx-auto rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="w-22 h-22 bg-gradient-to-br from-[#A4B465] to-[#626F47] rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
        
        <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-xl mb-2`}>{user.name}</h3>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mb-3`}>
          {user.role === 'artisan' ? user.specialty : `Member since ${new Date(user.joinDate).toLocaleDateString()}`}
        </p>
        
        {/* Role Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A4B465]/10 to-[#626F47]/10 text-[#A4B465] rounded-2xl text-sm font-semibold border border-[#A4B465]/20">
          {user.role === 'admin' && <Crown className="w-4 h-4" />}
          {user.role === 'artisan' && <Star className="w-4 h-4" />}
          {user.role === 'customer' && <Activity className="w-4 h-4" />}
          {user.role === 'admin' ? 'Administrator' : user.role === 'artisan' ? 'Artisan' : 'Customer'}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-3 mb-8">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const isHovered = hoveredItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-[#A4B465]/20 to-[#626F47]/20 text-white shadow-lg border border-[#A4B465]/30 transform scale-[1.02]'
                  : `${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'} hover:transform hover:scale-[1.02]`
              }`}
            >
              <div className="flex items-center gap-4 px-4 py-4">
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#A4B465]/20 text-[#A4B465] shadow-lg' 
                    : `${isDark ? 'bg-slate-800/50 text-slate-400 group-hover:bg-slate-700/50 group-hover:text-slate-300' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-700'}`
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold flex items-center justify-between">
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[24px] flex items-center justify-center animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <div className={`text-xs mt-1 ${
                      isActive ? 'text-[#A4B465]/70' : isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#A4B465] to-[#626F47] rounded-l-full shadow-lg"></div>
              )}
              
              {/* Hover effect */}
              {isHovered && !isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#A4B465]/5 to-[#626F47]/5 rounded-2xl"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className={`p-5 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50/80'} rounded-2xl border ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'} backdrop-blur-sm`}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className={`w-4 h-4 ${isDark ? 'text-[#A4B465]' : 'text-[#626F47]'}`} />
          <h4 className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold text-sm`}>Quick Stats</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Active Users</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'} font-semibold text-sm`}>1,247</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Pending Tasks</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-500 font-semibold text-sm">12</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>System Health</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-500 font-semibold text-sm">Excellent</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-2">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Performance</span>
            <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'} font-medium`}>94%</span>
          </div>
          <div className={`w-full h-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
            <div className="h-full bg-gradient-to-r from-[#A4B465] to-[#626F47] rounded-full transition-all duration-1000 ease-out" style={{ width: '94%' }}></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Ducali Platform v1.0
        </div>
        <div className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-500'} mt-1`}>
          © 2024 All rights reserved
        </div>
      </div>
    </div>
  );
}