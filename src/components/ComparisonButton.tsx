"use client";

import React, { useState } from 'react';
import { Scale, Check, X } from 'lucide-react';
import { type Artisan } from '../lib/artisanService';

interface ComparisonButtonProps {
  artisan: Artisan;
  isSelected: boolean;
  onToggle: (artisanId: string) => void;
  disabled?: boolean;
}

export default function ComparisonButton({ 
  artisan, 
  isSelected, 
  onToggle, 
  disabled = false 
}: ComparisonButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onToggle(artisan.id);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative p-2 rounded-full transition-all duration-200
        ${isSelected 
          ? 'bg-[#A4B465] text-white shadow-lg' 
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
    >
      {isSelected ? (
        <Check className="w-4 h-4" />
      ) : (
        <Scale className="w-4 h-4" />
      )}
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
          {isSelected ? 'Remove from comparison' : 'Add to comparison'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </button>
  );
}
