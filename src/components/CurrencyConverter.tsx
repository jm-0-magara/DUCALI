// src/components/CurrencyConverter.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { currencyService, type CurrencyConversion } from '../lib/currencyService';
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

interface CurrencyConverterProps {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  onConversionChange?: (conversion: CurrencyConversion) => void;
  showDetails?: boolean;
  className?: string;
}

export default function CurrencyConverter({
  amount,
  fromCurrency,
  toCurrency,
  onConversionChange,
  showDetails = false,
  className = ''
}: CurrencyConverterProps) {
  const [conversion, setConversion] = useState<CurrencyConversion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const convertCurrency = async () => {
    if (!amount || amount <= 0) {
      setConversion(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await currencyService.convertCurrency(amount, fromCurrency, toCurrency);
      setConversion(result);
      setLastUpdated(new Date());
      onConversionChange?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert currency');
      console.error('Currency conversion error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Convert when props change
  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  if (!amount || amount <= 0) {
    return null;
  }

  if (fromCurrency === toCurrency) {
    return (
      <div className={`text-sm text-slate-400 ${className}`}>
        {currencyService.formatCurrency(amount, fromCurrency)}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-red-400 text-sm ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <span>Conversion error</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-slate-400 text-sm ${className}`}>
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span>Converting...</span>
      </div>
    );
  }

  if (!conversion) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">
          {currencyService.formatCurrency(amount, fromCurrency)}
        </span>
        <ArrowRight className="w-3 h-3 text-slate-500" />
        <span className="font-medium">
          {currencyService.formatCurrency(conversion.convertedAmount, toCurrency)}
        </span>
      </div>
      
      {showDetails && (
        <div className="mt-1 text-xs text-slate-500">
          <span>Rate: 1 {fromCurrency} = {conversion.rate.toFixed(4)} {toCurrency}</span>
          {lastUpdated && (
            <span className="ml-2">
              • Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Hook for easy currency conversion
export function useCurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRates = async (baseCurrency: string = 'KES') => {
    setLoading(true);
    setError(null);

    try {
      const rates = await currencyService.getExchangeRates(baseCurrency);
      setRates(rates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rates');
    } finally {
      setLoading(false);
    }
  };

  const convert = async (amount: number, from: string, to: string) => {
    try {
      return await currencyService.convertCurrency(amount, from, to);
    } catch (err) {
      throw err;
    }
  };

  const format = (amount: number, currency: string) => {
    return currencyService.formatCurrency(amount, currency);
  };

  const getSymbol = (currency: string) => {
    return currencyService.getCurrencySymbol(currency);
  };

  const getSupportedCurrencies = () => {
    return currencyService.getSupportedCurrencies();
  };

  return {
    rates,
    loading,
    error,
    loadRates,
    convert,
    format,
    getSymbol,
    getSupportedCurrencies
  };
}
