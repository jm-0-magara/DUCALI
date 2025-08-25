"use client";

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'icon';
}

export function ThemeToggle({ className = '', variant = 'button' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg transition-colors ${className}`}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-muted-gold/60 hover:text-muted-gold" />
        ) : (
          <Moon className="w-5 h-5 text-muted-gold/60 hover:text-muted-gold" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors bg-muted-gold/10 hover:bg-muted-gold/20 text-muted-gold/60 hover:text-muted-gold ${className}`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="text-sm">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span className="text-sm">Dark</span>
        </>
      )}
    </button>
  );
}
