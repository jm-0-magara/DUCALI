"use client";

import React, { useState, useEffect } from 'react';
import { Maximize2, X, Minimize2 } from 'lucide-react';

interface MaximizableChartProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function MaximizableChart({ title, children, className = "" }: MaximizableChartProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMaximize = () => {
    setIsMaximized(true);
  };

  const handleClose = () => {
    setIsMaximized(false);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMaximized) {
        handleClose();
      }
    };

    if (isMaximized) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMaximized]);

  return (
    <>
      <div className={`bg-slate-800 rounded-xl p-6 border border-slate-700 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={handleMaximize}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
            title="Maximize chart"
          >
            <Maximize2 className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </button>
        </div>
        <div className="relative">
          {children}
        </div>
      </div>

      {/* Full Screen Modal */}
      {isMaximized && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div 
            className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-6xl h-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                  title="Minimize"
                >
                  <Minimize2 className="w-5 h-5 text-slate-400 group-hover:text-white" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                  title="Close"
                >
                  <X className="w-6 h-6 text-slate-400 group-hover:text-white" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-hidden">
              <div className="w-full h-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
