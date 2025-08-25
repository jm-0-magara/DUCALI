"use client";

import React, { useState } from 'react';
import { Scale, X } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import ComparisonTool from './ComparisonTool';

export default function ComparisonIndicator() {
  const { selectedArtisans, comparisonCount, clearComparison } = useComparison();
  const [showComparisonTool, setShowComparisonTool] = useState(false);

  if (comparisonCount === 0) {
    return null;
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowComparisonTool(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-[#A4B465] text-white rounded-lg hover:bg-[#626F47] transition-colors"
        >
          <Scale className="w-4 h-4" />
          <span className="font-medium">Compare</span>
          <span className="bg-white text-[#A4B465] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {comparisonCount}
          </span>
        </button>
        
        {/* Clear comparison button */}
        <button
          onClick={clearComparison}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          title="Clear all comparisons"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Comparison Tool Modal */}
      {showComparisonTool && (
        <ComparisonTool />
      )}
    </>
  );
}
