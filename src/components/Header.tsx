// src/components/Header.tsx (Fixed import paths)
import React, { useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts';
import { LoginModal, SignupModal } from './auth';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { user, logout, isAuthenticated, isArtisan, isCustomer } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  const getDashboardLink = () => {
    if (isArtisan) return '/dashboard/artisan';
    if (isCustomer) return '/dashboard/customer';
    return '/dashboard';
  };

  return (
    <>
      <header className={`shadow-lg sticky top-0 z-50 transition-colors duration-300 ${
        darkMode ? 'bg-slate-900/95 backdrop-blur-md' : 'bg-slate-900/95 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold" style={{ color: '#A4B465' }}>
                Ducali
              </Link>
              <div className="text-sm text-slate-400 ml-2">Bespoke Marketplace</div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/browse" className="text-slate-300 hover:text-[#A4B465] transition-colors">
                Browse Artisans
              </Link>
              <Link href="/how-it-works" className="text-slate-300 hover:text-[#A4B465] transition-colors">
                How It Works
              </Link>
              <a href="#" className="text-slate-300 hover:text-[#A4B465] transition-colors">
                For Artisans
              </a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-slate-300 hover:text-[#A4B465] hover:bg-slate-800 transition-all"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-slate-300 hover:text-[#A4B465] transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#626F47] rounded-full flex items-center justify-center text-white text-sm">
                      {user?.profileImage || user?.name.charAt(0)}
                    </div>
                    <span className="hidden sm:block">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-700">
                        <p className="text-white font-medium">{user?.name}</p>
                        <p className="text-slate-400 text-sm capitalize">{user?.role}</p>
                      </div>
                      
                      <Link
                        href={getDashboardLink()}
                        className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>
                      
                      {isArtisan && (
                        <Link
                          href={`/artisan/${user?.id}`}
                          className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Profile
                        </Link>
                      )}
                      
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>
                      
                      <div className="border-t border-slate-700 mt-2">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="text-slate-300 hover:text-[#A4B465] transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setShowSignupModal(true)}
                    className="text-white px-4 py-2 rounded-lg hover:bg-[#626F47] transition-colors" 
                    style={{ backgroundColor: '#626F47' }}
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </header>

      {/* Auth Modals */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={handleCloseModals}
        onSwitchToSignup={handleSwitchToSignup}
      />
      
      <SignupModal 
        isOpen={showSignupModal}
        onClose={handleCloseModals}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}