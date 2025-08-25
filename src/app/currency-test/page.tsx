// src/app/currency-test/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { currencyService } from '../../lib/currencyService';
import CurrencyConverter from '../../components/CurrencyConverter';
import { useCurrencyConverter } from '../../components/CurrencyConverter';
import { RefreshCw, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function CurrencyTestPage() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('KES');
  const [toCurrency, setToCurrency] = useState('USD');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const {
    rates,
    loading,
    error,
    loadRates,
    convert,
    format,
    getSymbol,
    getSupportedCurrencies
  } = useCurrencyConverter();

  const supportedCurrencies = getSupportedCurrencies();

  useEffect(() => {
    loadRates('KES');
  }, []);

  const runTests = async () => {
    setIsTesting(true);
    const results = [];

    try {
      // Test 1: Basic conversion
      const conversion1 = await convert(1000, 'KES', 'USD');
      results.push({
        test: 'Basic KES to USD conversion',
        status: 'success',
        result: `${format(1000, 'KES')} = ${format(conversion1.convertedAmount, 'USD')}`,
        rate: conversion1.rate
      });

      // Test 2: African currencies
      const conversion2 = await convert(500, 'KES', 'NGN');
      results.push({
        test: 'KES to Nigerian Naira',
        status: 'success',
        result: `${format(500, 'KES')} = ${format(conversion2.convertedAmount, 'NGN')}`,
        rate: conversion2.rate
      });

      // Test 3: Same currency
      const conversion3 = await convert(1000, 'KES', 'KES');
      results.push({
        test: 'Same currency conversion',
        status: 'success',
        result: `${format(1000, 'KES')} = ${format(conversion3.convertedAmount, 'KES')}`,
        rate: conversion3.rate
      });

      // Test 4: Formatting test
      const formatted = format(1234.56, 'USD');
      results.push({
        test: 'Currency formatting',
        status: 'success',
        result: `1234.56 USD = ${formatted}`,
        rate: null
      });

      // Test 5: Symbol test
      const symbol = getSymbol('EUR');
      results.push({
        test: 'Currency symbol',
        status: 'success',
        result: `EUR symbol = ${symbol}`,
        rate: null
      });

    } catch (error) {
      results.push({
        test: 'Error handling',
        status: 'error',
        result: error instanceof Error ? error.message : 'Unknown error',
        rate: null
      });
    }

    setTestResults(results);
    setIsTesting(false);
  };

  const clearCache = () => {
    currencyService.clearCache();
    alert('Cache cleared!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-blue via-slate-900 to-charcoal-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">💰 Currency Conversion Test</h1>
          <p className="text-slate-300">Testing the free ExchangeRate-API integration with KES as default</p>
        </div>

        {/* API Status */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-gold" />
            API Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">API Provider</div>
              <div className="font-medium">ExchangeRate-API v6</div>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">API Key Status</div>
              <div className="font-medium text-green-400">
                {currencyService.getApiKeyStatus().hasKey ? '✅ Active' : '❌ Missing'}
              </div>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Rate Limits</div>
              <div className="font-medium">1,500 requests/month</div>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Status</div>
              <div className="flex items-center gap-2">
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-yellow-400" />
                ) : error ? (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
                <span className={loading ? 'text-yellow-400' : error ? 'text-red-400' : 'text-green-400'}>
                  {loading ? 'Loading...' : error ? 'Error' : 'Connected'}
                </span>
              </div>
            </div>
          </div>

          {/* API Key Info */}
          <div className="mt-4 p-4 bg-slate-700 rounded-lg">
            <div className="text-sm text-slate-400 mb-2">API Key (Masked)</div>
            <div className="font-mono text-sm text-slate-300">
              {currencyService.getApiKeyStatus().maskedKey}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Using ExchangeRate-API v6 with enhanced features and better rate limits
            </div>
          </div>
        </div>

        {/* Currency Converter */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Live Currency Converter</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
                placeholder="Enter amount"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-2">From Currency</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
              >
                {supportedCurrencies.map(currency => (
                  <option key={currency} value={currency}>
                    {currency} ({getSymbol(currency)})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-2">To Currency</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
              >
                {supportedCurrencies.map(currency => (
                  <option key={currency} value={currency}>
                    {currency} ({getSymbol(currency)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <CurrencyConverter
              amount={amount}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              showDetails={true}
            />
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <div className="flex gap-2">
              <button
                onClick={runTests}
                disabled={isTesting}
                className="px-4 py-2 bg-accent-gold text-charcoal-black rounded-lg font-medium hover:bg-accent-gold/80 transition-colors disabled:opacity-50"
              >
                {isTesting ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running Tests...
                  </div>
                ) : (
                  'Run Tests'
                )}
              </button>
              
              <button
                onClick={clearCache}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
              >
                Clear Cache
              </button>
            </div>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.status === 'success' 
                      ? 'bg-green-900/20 border-green-500/30' 
                      : 'bg-red-900/20 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="font-medium">{result.test}</span>
                  </div>
                  <div className="text-sm text-slate-300">{result.result}</div>
                  {result.rate && (
                    <div className="text-xs text-slate-400 mt-1">
                      Rate: {result.rate.toFixed(4)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cache Status */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Cache Status</h2>
          <div className="bg-slate-700 rounded-lg p-4">
            <pre className="text-sm text-slate-300 overflow-auto">
              {JSON.stringify(currencyService.getCacheStatus(), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
