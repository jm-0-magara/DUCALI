"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Mic } from 'lucide-react';

interface MobileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (query: string) => void;
  suggestions?: string[];
  className?: string;
}

export default function MobileSearchBar({
  value,
  onChange,
  placeholder = "Search artisans...",
  onSearch,
  suggestions = [],
  className = ""
}: MobileSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShowSuggestions(isFocused && suggestions.length > 0);
  }, [isFocused, suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicks
              setTimeout(() => setIsFocused(false), 150);
            }}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] focus:ring-2 focus:ring-[#A4B465]/20 transition-all touch-manipulation text-base"
          />
          
          {value && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          <button
            type="button"
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors touch-manipulation"
            title="Voice search"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors touch-manipulation border-b border-slate-600 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400" />
                <span>{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
