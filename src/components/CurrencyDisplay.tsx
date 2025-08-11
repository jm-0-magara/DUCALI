"use client";

import React from 'react';
import { Globe } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

export function CurrencyDisplay() {
  const { selectedCurrency } = useCurrency();

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Globe className="w-4 h-4 text-slate-400" />
      <span className="text-slate-300">{selectedCurrency.code}</span>
      <span className="text-slate-400">({selectedCurrency.symbol})</span>
    </div>
  );
}
