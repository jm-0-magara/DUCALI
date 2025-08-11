"use client";

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface RealTimeIndicatorProps {
  isConnected?: boolean;
  lastUpdate?: Date;
}

export function RealTimeIndicator({ isConnected = true, lastUpdate }: RealTimeIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (lastUpdate) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdate]);

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex items-center space-x-1">
        {isConnected ? (
          <Wifi className="w-3 h-3 text-green-500" />
        ) : (
          <WifiOff className="w-3 h-3 text-red-500" />
        )}
        <span className={`text-xs transition-opacity duration-300 ${
          isConnected ? 'text-green-400' : 'text-red-400'
        }`}>
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>
      
      {isVisible && lastUpdate && (
        <span className="text-xs text-slate-400 animate-pulse">
          Updated {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
