// src/components/Header.tsx (Enhanced with mobile responsiveness and performance optimizations)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { User, LogOut, Menu, X, Search, Bell, Settings, Heart, ChevronDown, MessageCircle, Loader2, FileText } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';
import CreateProjectModal from './projects/CreateProjectModal';
import { ThemeToggle } from './ThemeToggle';
import { ProfileImage } from './OptimizedImage';
import { notificationService } from '../lib/notificationService';
import { adminSettingsService, AdminSettings as AdminSettingsType } from '../lib/adminSettingsService';

export default function Header() {
  const { user, logout, isAuthenticated, isArtisan, isCustomer, isAdmin } = useAuth();
  const { theme } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Admin settings state
  const [settings, setSettings] = useState<AdminSettingsType>({
    platformName: 'Ducali',
    platformDescription: 'Connecting artisans with customers worldwide',
    contactEmail: 'admin@ducali.com',
    supportPhone: '+1234567890',
    commissionRate: 10,
    maxFileSize: 10,
    autoApproveArtisans: false,
    requireVerification: true,
    enableNotifications: true,
    maintenanceMode: false,
    currency: 'KSH',
    timezone: 'UTC',
    language: 'English'
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Fetch admin settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);
        console.log('🔍 Header: Fetching admin settings from database...');
        
        const platformSettings = await adminSettingsService.getPlatformSettings();
        console.log('✅ Header: Fetched settings:', platformSettings);
        
        setSettings(platformSettings);
      } catch (error) {
        console.error('❌ Header: Error fetching settings:', error);
        // Keep using default settings if fetch fails
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle scroll effect with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  // Memoized handlers for better performance
  const handleSwitchToSignup = useCallback(() => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setShowCreateProjectModal(false);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic
    console.log('Searching for:', searchQuery);
  }, [searchQuery]);

  const getDashboardLink = useMemo(() => {
    if (isAdmin) return '/dashboard/admin';
    if (isArtisan) return '/dashboard/artisan';
    if (isCustomer) return '/dashboard/customer';
    return '/dashboard/customer'; // Default fallback
  }, [isAdmin, isArtisan, isCustomer]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isDark = theme === 'dark';
  
  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? `${isDark ? 'bg-navy-blue/95' : 'bg-white/95'} backdrop-blur-md shadow-xl border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`
          : `${isDark ? 'bg-navy-blue/90' : 'bg-white/90'} backdrop-blur-sm`
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section: Logo */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              <Link href="/" className="group touch-manipulation">
                <span className={`${isDark ? 'text-white' : 'text-navy-blue'} font-playfair font-bold text-xl sm:text-2xl tracking-wide group-hover:text-muted-gold transition-all duration-300`}>
                  {settings.platformName}
                </span>
              </Link>
            </div>

            {/* Center Section: Search - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search artisans, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 sm:px-5 py-2 pl-10 sm:pl-12 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/15' : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-white'} border rounded-xl focus:outline-none focus:border-muted-gold/50 text-sm font-medium`}
                />
                <Search className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/60' : 'text-slate-500'}`} />
              </form>
            </div>

            {/* Right Section: Navigation & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-6">
                <Link href="/browse" className={`${isDark ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-navy-blue'} transition-colors font-medium text-sm touch-manipulation`}>
                  Browse Artisans
                </Link>
                {isCustomer && (
                  <button
                    onClick={() => setShowCreateProjectModal(true)}
                    className={`${isDark ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-navy-blue'} transition-colors font-medium text-sm touch-manipulation`}
                  >
                    Post Project
                  </button>
                )}
                {isArtisan && (
                  <Link href="/projects" className={`${isDark ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-navy-blue'} transition-colors font-medium text-sm touch-manipulation`}>
                    Find Projects
                  </Link>
                )}
                <Link href="/how-it-works" className={`${isDark ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-navy-blue'} transition-colors font-medium text-sm touch-manipulation`}>
                  How It Works
                </Link>
                <Link href="/for-artisans" className={`${isDark ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-navy-blue'} transition-colors font-medium text-sm touch-manipulation`}>
                  For Artisans
                </Link>
              </nav>

              {/* Theme Toggle */}
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <div className="relative dropdown-container">
                    <NotificationBell />


                  </div>

                  {/* Favorites */}
                  <Link href="/favorites" className={`p-2 ${isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-navy-blue hover:bg-slate-100'} transition-all duration-300 rounded-lg touch-manipulation`}>
                    <Heart className="w-4 h-4" />
                  </Link>

                  {/* Messages */}
                  <Link href="/messages" className={`p-2 ${isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-navy-blue hover:bg-slate-100'} transition-all duration-300 rounded-lg touch-manipulation`}>
                    <MessageCircle className="w-4 h-4" />
                  </Link>

                  {/* Quotes */}
                  <Link href="/quotes" className={`p-2 ${isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-navy-blue hover:bg-slate-100'} transition-all duration-300 rounded-lg touch-manipulation`}>
                    <FileText className="w-4 h-4" />
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className={`flex items-center space-x-2 px-2 sm:px-3 py-2 ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} rounded-lg transition-all duration-300 font-medium touch-manipulation`}
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-muted-gold rounded-full flex items-center justify-center overflow-hidden">
                        <ProfileImage 
                          src={user?.profileImage || ''} 
                          alt="Profile"
                          size={isMobile ? 24 : 28}
                        />
                      </div>
                      <span className="hidden sm:block font-medium text-sm">{user?.name || 'User'}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {userDropdownOpen && (
                      <div className={`absolute right-0 mt-2 w-48 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-xl border py-2 z-50 animate-in slide-in-from-top-2 duration-200`}>
                        <div className={`px-3 py-2 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'} truncate`}>{user?.name || 'User'}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} truncate`}>{user?.email}</p>
                        </div>
                        
                        <Link
                          href={getDashboardLink}
                          className={`flex items-center px-3 py-2 text-sm ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'} transition-colors touch-manipulation`}
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User className="w-3 h-3 mr-2" />
                          Dashboard
                        </Link>
                        
                        <Link
                          href="/profile"
                          className={`flex items-center px-3 py-2 text-sm ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'} transition-colors touch-manipulation`}
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Settings className="w-3 h-3 mr-2" />
                          Settings
                        </Link>
                        
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className={`flex items-center w-full px-3 py-2 text-sm ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'} transition-colors touch-manipulation`}
                        >
                          <LogOut className="w-3 h-3 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Sign In and Get Started buttons */}
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className={`px-3 sm:px-4 py-2 ${isDark ? 'text-white hover:text-muted-gold border-white/30 hover:border-white/60 hover:bg-white/10' : 'text-navy-blue hover:text-muted-gold border-slate-300 hover:border-muted-gold hover:bg-slate-50'} transition-all duration-300 font-medium text-sm border rounded-lg touch-manipulation`}
                  >
                    <span className="hidden sm:inline">Sign In</span>
                    <span className="sm:hidden">Sign In</span>
                  </button>
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="px-3 sm:px-4 py-2 bg-muted-gold text-charcoal-black font-semibold rounded-lg hover:bg-muted-gold/80 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm touch-manipulation"
                  >
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Start</span>
                  </button>
                </>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 ${isDark ? 'text-white hover:text-muted-gold' : 'text-slate-700 hover:text-navy-blue'} transition-colors touch-manipulation`}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`lg:hidden ${isDark ? 'bg-navy-blue/95' : 'bg-white/95'} backdrop-blur-md border-t ${isDark ? 'border-muted-gold/10' : 'border-slate-200'} animate-in slide-in-from-top-2 duration-300`}>
            <div className="px-4 sm:px-6 py-6 space-y-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search artisans, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-3 pl-12 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/15' : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-white'} border rounded-xl focus:outline-none focus:border-muted-gold/50 text-base font-medium`}
                />
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/60' : 'text-slate-500'}`} />
              </form>

              <nav className="space-y-4">
                <Link 
                  href="/browse" 
                  className={`block ${isDark ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-navy-blue'} transition-colors py-3 font-semibold text-lg touch-manipulation`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Artisans
                </Link>
                <Link 
                  href="/how-it-works" 
                  className={`block ${isDark ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-navy-blue'} transition-colors py-3 font-semibold text-lg touch-manipulation`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link 
                  href="/for-artisans" 
                  className="block text-white/90 hover:text-white transition-colors py-3 font-semibold text-lg touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For Artisans
                </Link>
              </nav>
              
              {isAuthenticated && (
                <div className="space-y-2">
                  <Link 
                    href="/favorites" 
                    className="flex items-center text-white/80 hover:text-white transition-colors py-2 touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4 mr-3" />
                    Favorites
                  </Link>
                  <Link 
                    href="/messages" 
                    className="flex items-center text-white/80 hover:text-white transition-colors py-2 touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageCircle className="w-4 h-4 mr-3" />
                    Messages
                  </Link>
                  <Link 
                    href="/quotes" 
                    className="flex items-center text-white/80 hover:text-white transition-colors py-2 touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Quotes
                  </Link>
                  <Link 
                    href="/notifications" 
                    className="flex items-center text-white/80 hover:text-white transition-colors py-2 touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Bell className="w-4 h-4 mr-3" />
                    Notifications
                  </Link>
                </div>
              )}
              
              <div className="pt-6 border-t border-muted-gold/10 space-y-6">
                {/* Theme Toggle for Mobile */}
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      href={getDashboardLink}
                      className="flex items-center justify-center space-x-3 px-6 py-3 bg-muted-gold/10 hover:bg-muted-gold/20 text-white rounded-xl transition-all duration-300 w-full font-semibold text-base touch-manipulation"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-3 px-6 py-3 bg-wine-red/10 hover:bg-wine-red/20 text-white rounded-xl transition-all duration-300 w-full font-semibold text-base touch-manipulation"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 text-white border border-white/30 rounded-xl font-semibold text-base hover:bg-white/10 transition-all duration-300 touch-manipulation"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setShowSignupModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 bg-muted-gold text-charcoal-black rounded-xl font-semibold text-base hover:bg-muted-gold/80 transition-all duration-300 touch-manipulation"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleCloseModals}
          onSwitchToSignup={handleSwitchToSignup}
        />
      )}
      
      {showSignupModal && (
        <SignupModal
          isOpen={showSignupModal}
          onClose={handleCloseModals}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
      
      {showCreateProjectModal && (
        <CreateProjectModal
          isOpen={showCreateProjectModal}
          onClose={handleCloseModals}
          onSuccess={(projectId) => {
            console.log('Project created:', projectId);
            // TODO: Redirect to project page or show success message
          }}
          darkMode={isDark}
        />
      )}
    </>
  );
}