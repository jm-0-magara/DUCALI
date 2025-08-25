import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Home, Users, Heart, MessageCircle, Settings, LogOut, User, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface MobileNavigationProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function MobileNavigation({ darkMode, toggleDarkMode }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { user, logout, isAuthenticated, isArtisan, isCustomer, isAdmin } = useAuth();
  const router = useRouter();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [router]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = useCallback(async () => {
    await logout();
    setIsOpen(false);
    router.push('/');
  }, [logout, router]);

  const getDashboardLink = useCallback(() => {
    if (isAdmin) return '/dashboard/admin';
    if (isArtisan) return '/dashboard/artisan';
    if (isCustomer) return '/dashboard/customer';
    return '/dashboard';
  }, [isAdmin, isArtisan, isCustomer]);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'browse', label: 'Browse Artisans', icon: Users, href: '/browse' },
    { id: 'how-it-works', label: 'How It Works', icon: Star, href: '/how-it-works' },
  ];

  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: User, href: getDashboardLink() },
    { id: 'favorites', label: 'Favorites', icon: Heart, href: '/dashboard/customer?tab=favorites' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, href: '/dashboard/customer?tab=messages' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/customer?tab=settings' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg transition-colors touch-manipulation"
        style={{
          backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          color: '#FDF6F0'
        }}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div 
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right duration-300"
            style={{
              backgroundColor: darkMode ? 'rgba(28, 28, 28, 0.98)' : 'rgba(29, 45, 80, 0.98)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-600">
              <h2 className="text-lg sm:text-xl font-bold text-white">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors touch-manipulation"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="p-4 sm:p-6">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-lg text-white hover:bg-slate-700 transition-colors touch-manipulation"
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium text-base sm:text-lg">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="my-4 sm:my-6 border-t border-slate-600" />

              {/* User Section */}
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-700 rounded-lg">
                    <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{user?.name || 'User'}</p>
                      <p className="text-slate-400 text-sm truncate">
                        {isAdmin ? 'Admin' : isArtisan ? 'Artisan' : 'Customer'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="flex items-center gap-3 p-3 sm:p-4 rounded-lg text-white hover:bg-slate-700 transition-colors touch-manipulation"
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-base sm:text-lg">{item.label}</span>
                      </Link>
                    ))}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-3 sm:p-4 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors touch-manipulation w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium text-base sm:text-lg">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-[#A4B465] text-white rounded-lg hover:bg-[#626F47] transition-colors touch-manipulation"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium text-base sm:text-lg">Login</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2 p-3 sm:p-4 border border-[#A4B465] text-[#A4B465] rounded-lg hover:bg-[#A4B465]/10 transition-colors touch-manipulation"
                  >
                    <span className="font-medium text-base sm:text-lg">Sign Up</span>
                  </Link>
                </div>
              )}

              {/* Divider */}
              <div className="my-4 sm:my-6 border-t border-slate-600" />

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-between w-full p-3 sm:p-4 rounded-lg text-white hover:bg-slate-700 transition-colors touch-manipulation"
              >
                <span className="font-medium text-base sm:text-lg">Dark Mode</span>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-[#A4B465]' : 'bg-slate-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    darkMode ? 'transform translate-x-6' : 'transform translate-x-1'
                  }`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
