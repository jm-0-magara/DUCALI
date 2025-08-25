// src/components/dashboard/DashboardHeader.tsx
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User } from '../../types';
import { Menu, Bell, Search, Settings, LogOut, X, User as UserIcon, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { ProfileImage } from '../OptimizedImage';
import { notificationService } from '../../lib/notificationService';
import { useTheme } from '../../contexts/ThemeContext';

interface DashboardHeaderProps {
  user: User;
  logout: () => void;
  onMenuClick?: () => void;
}

export function DashboardHeader({ user, logout, onMenuClick }: DashboardHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [notifications, setNotifications] = useState<number>(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userNotifications, setUserNotifications] = useState<any[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fetch user notifications
  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const unreadNotifications = await notificationService.getUnreadNotifications(user.id);
        setNotifications(unreadNotifications.length);
        setUserNotifications(unreadNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Set up real-time listener for notifications
    const unsubscribe = notificationService.subscribeToNotifications(user.id, (notifications) => {
      const unreadCount = notifications.filter(n => !n.read).length;
      setNotifications(unreadCount);
      setUserNotifications(notifications.slice(0, 5)); // Show latest 5
    });

    return () => unsubscribe();
  }, [user]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log('Searching for:', searchQuery);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <div className={`${isDark ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-xl border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} shadow-2xl sticky top-0 z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className={`lg:hidden p-2.5 ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} transition-all duration-200 rounded-xl hover:scale-105`}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#A4B465] to-[#626F47] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#A4B465] to-[#626F47] bg-clip-text text-transparent group-hover:from-[#626F47] group-hover:to-[#A4B465] transition-all duration-300">
                  Ducali
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} -mt-1`}>
                  Artisan Platform
                </span>
              </div>
            </Link>
            
            {/* Breadcrumb separator */}
            <div className={`hidden md:flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'} font-medium text-sm`}>
                {user.role === 'admin' ? 'Admin' : user.role === 'customer' ? 'Customer' : 'Artisan'} Dashboard
              </span>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle variant="icon" />
            
            {/* Search */}
            <div className="relative">
              {showSearch ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search artisans, services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`px-4 py-2.5 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50 focus:border-[#A4B465] w-72 transition-all duration-200`}
                  />
                  <button
                    type="submit"
                    className={`p-2.5 ${isDark ? 'bg-[#A4B465] hover:bg-[#626F47]' : 'bg-[#A4B465] hover:bg-[#626F47]'} text-white transition-all duration-200 rounded-xl hover:scale-105`}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className={`p-2.5 ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'} transition-all duration-200 rounded-xl hover:scale-105`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className={`hidden md:flex p-2.5 ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'} transition-all duration-200 rounded-xl hover:scale-105`}
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Notifications */}
            {user.role === 'admin' && (
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2.5 relative ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'} transition-all duration-200 rounded-xl hover:scale-105`}
                >
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full border-2 border-slate-900 flex items-center justify-center animate-pulse">
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className={`absolute right-0 mt-3 w-80 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-2xl shadow-2xl border py-2 z-50 animate-in slide-in-from-top-2 duration-200`}>
                    <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                      <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {userNotifications.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                          <Bell className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No notifications</p>
                        </div>
                      ) : (
                        userNotifications.map((notification) => (
                          <div key={notification.id} className={`px-4 py-3 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} transition-colors cursor-pointer`}>
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.read ? (isDark ? 'bg-slate-600' : 'bg-slate-300') : 'bg-blue-500'
                              }`}></div>
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{notification.title}</p>
                                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'} mt-1`}>{notification.content}</p>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-400'} mt-1`}>
                                  {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Recently'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className={`px-4 py-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                      <Link
                        href="/notifications"
                        className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium flex items-center gap-2`}
                        onClick={() => setShowNotifications(false)}
                      >
                        View all notifications
                        <span className="text-xs">→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Help */}
            <button className={`hidden md:flex p-2.5 ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'} transition-all duration-200 rounded-xl hover:scale-105`}>
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* User profile */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <div className="hidden md:block text-right">
                  <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium text-sm`}>{user.name}</div>
                  <div className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-xs capitalize`}>
                    {user.role === 'artisan' ? user.specialty : user.role}
                  </div>
                </div>
                
                {/* User avatar */}
                {user.profileImage ? (
                  <ProfileImage 
                    src={user.profileImage} 
                    alt={`${user.name}'s profile`}
                    size={40}
                    className="rounded-xl"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-[#A4B465] to-[#626F47] rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className={`absolute right-0 mt-3 w-64 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-2xl shadow-2xl border py-2 z-50 animate-in slide-in-from-top-2 duration-200`}>
                  <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      {user.profileImage ? (
                        <ProfileImage 
                          src={user.profileImage} 
                          alt={`${user.name}'s profile`}
                          size={48}
                          className="rounded-xl"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-[#A4B465] to-[#626F47] rounded-xl flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>{user.name}</div>
                        <div className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm capitalize`}>
                          {user.role === 'artisan' ? user.specialty : user.role}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className={`flex items-center gap-3 px-4 py-2 ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'} transition-colors`}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserIcon className="w-4 h-4" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className={`w-full flex items-center gap-3 px-4 py-2 ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'} transition-colors`}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                  
                  <div className={`px-4 py-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}