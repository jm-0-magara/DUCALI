// src/components/dashboard/StatusBadge.tsx (Simple Version)
import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  // Simple color mapping without opacity classes
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed': 
        return 'text-green-300 bg-green-800';
      case 'In Progress': 
        return 'text-blue-300 bg-blue-800';
      case 'Pending Quote': 
        return 'text-yellow-300 bg-yellow-800';
      case 'Quote Requested': 
        return 'text-purple-300 bg-purple-800';
      case 'Pending Review': 
        return 'text-orange-300 bg-orange-800';
      case 'Cancelled': 
        return 'text-red-300 bg-red-800';
      default: 
        return 'text-slate-300 bg-slate-700';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(status)} ${className}`}>
      {status}
    </span>
  );
}