import React from 'react';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  return (
    <header className={`shadow-lg sticky top-0 z-50 transition-colors duration-300 ${
      darkMode ? 'bg-slate-900/95 backdrop-blur-md' : 'bg-slate-900/95 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold" style={{ color: '#A4B465' }}>Ducali</div>
            <div className="text-sm text-slate-400 ml-2">Bespoke Marketplace</div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/browse" className="text-slate-300 hover:text-[#A4B465] transition-colors">Browse Artisans</Link>
            <Link href="/how-it-works" className="text-slate-300 hover:text-[#A4B465] transition-colors">How It Works</Link>
            <a href="#" className="text-slate-300 hover:text-[#A4B465] transition-colors">For Artisans</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-300 hover:text-[#A4B465] hover:bg-slate-800 transition-all"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="text-slate-300 hover:text-[#A4B465] transition-colors">Sign In</button>
            <button className="text-white px-4 py-2 rounded-lg hover:bg-[#626F47] transition-colors" style={{ backgroundColor: '#626F47' }}>
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}