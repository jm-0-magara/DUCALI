"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate relative to KSHS
}

export const currencies: Currency[] = [
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.007 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.0065 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.0055 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', rate: 25.5 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', rate: 17.2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 10.8 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', rate: 0.085 },
];

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
  convertCurrency: (amount: number, fromCurrency?: Currency) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => {
    // Try to get from localStorage, default to KSHS
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedCurrency');
      if (saved) {
        const parsed = JSON.parse(saved);
        return currencies.find(c => c.code === parsed.code) || currencies[0];
      }
    }
    return currencies[0]; // KSHS is the first currency
  });

  useEffect(() => {
    // Save to localStorage whenever currency changes
    localStorage.setItem('selectedCurrency', JSON.stringify(selectedCurrency));
  }, [selectedCurrency]);

  const formatCurrency = (amount: number): string => {
    const convertedAmount = convertCurrency(amount);
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(convertedAmount);
  };

  const convertCurrency = (amount: number, fromCurrency?: Currency): number => {
    const sourceCurrency = fromCurrency || currencies[0]; // Default to KSHS
    const sourceRate = sourceCurrency.rate;
    const targetRate = selectedCurrency.rate;
    
    // Convert to KSHS first, then to target currency
    const amountInKSHS = amount / sourceRate;
    return amountInKSHS * targetRate;
  };

  const value = {
    selectedCurrency,
    setSelectedCurrency,
    formatCurrency,
    convertCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
