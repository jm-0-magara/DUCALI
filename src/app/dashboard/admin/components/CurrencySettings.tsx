"use client";

import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useCurrency, currencies } from '../../../../contexts/CurrencyContext';

export function CurrencySettings() {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencyChange = (currency: typeof currencies[0]) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Website Currency</h3>
          <p className="text-slate-400 text-sm mt-1">
            Choose the default currency for displaying prices across the website
          </p>
        </div>
        <Globe className="text-[#B08D57] h-6 w-6" />
      </div>

      <div className="space-y-4">
        {/* Current Currency Display */}
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Current Currency</p>
              <p className="text-slate-400 text-sm">
                {selectedCurrency.name} ({selectedCurrency.code})
              </p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-lg">
                {selectedCurrency.symbol}
              </p>
              <p className="text-slate-400 text-xs">Symbol</p>
            </div>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-white mb-2">
            Select Currency
          </label>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-left text-white hover:border-slate-500 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{selectedCurrency.symbol}</span>
              <div>
                <p className="font-medium">{selectedCurrency.name}</p>
                <p className="text-slate-400 text-sm">{selectedCurrency.code}</p>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency)}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-600 transition-colors flex items-center justify-between ${
                    selectedCurrency.code === currency.code ? 'bg-slate-600' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{currency.symbol}</span>
                    <div>
                      <p className="text-white font-medium">{currency.name}</p>
                      <p className="text-slate-400 text-sm">{currency.code}</p>
                    </div>
                  </div>
                  {selectedCurrency.code === currency.code && (
                    <Check className="h-5 w-5 text-[#B08D57]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Currency Preview */}
        <div className="bg-slate-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Currency Preview</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Sample Price:</span>
              <span className="text-white font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: selectedCurrency.code,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(15000)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Exchange Rate:</span>
              <span className="text-white font-medium">
                1 KES = {selectedCurrency.rate} {selectedCurrency.code}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            <strong>Note:</strong> Currency changes will affect all price displays across the website. 
            Exchange rates are approximate and may need to be updated regularly for accuracy.
          </p>
        </div>
      </div>
    </div>
  );
}
