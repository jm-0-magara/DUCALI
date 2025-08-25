// src/components/CurrencyExample.tsx
"use client";

import React, { useState } from 'react';
import CurrencyConverter from './CurrencyConverter';
import { currencyService } from '../lib/currencyService';

interface CurrencyExampleProps {
  price: number;
  originalCurrency: string;
  userCurrency?: string;
  showConversion?: boolean;
}

export default function CurrencyExample({
  price,
  originalCurrency,
  userCurrency = 'KES',
  showConversion = true
}: CurrencyExampleProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-semibold text-white">
          {currencyService.formatCurrency(price, originalCurrency)}
        </span>
        
        {showConversion && originalCurrency !== userCurrency && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-accent-gold hover:text-accent-gold/80 transition-colors"
          >
            {showDetails ? 'Hide' : 'Show'} conversion
          </button>
        )}
      </div>

      {showConversion && originalCurrency !== userCurrency && (
        <div className="mt-2">
          <CurrencyConverter
            amount={price}
            fromCurrency={originalCurrency}
            toCurrency={userCurrency}
            showDetails={showDetails}
            className="text-sm"
          />
        </div>
      )}

      {showConversion && originalCurrency === userCurrency && (
        <div className="text-xs text-slate-400 mt-1">
          Price in your currency
        </div>
      )}
    </div>
  );
}

// Example usage in artisan cards
export function ArtisanPriceCard({ artisan }: { artisan: any }) {
  const [userCurrency, setUserCurrency] = useState('KES');

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">{artisan.name}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Your Currency</label>
          <select
            value={userCurrency}
            onChange={(e) => setUserCurrency(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
          >
            {currencyService.getSupportedCurrencies().map(currency => (
              <option key={currency} value={currency}>
                {currency} ({currencyService.getCurrencySymbol(currency)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Starting Price</label>
          <CurrencyExample
            price={artisan.startingPrice || 100}
            originalCurrency={artisan.currency || 'USD'}
            userCurrency={userCurrency}
            showConversion={true}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Average Project Cost</label>
          <CurrencyExample
            price={artisan.averageCost || 500}
            originalCurrency={artisan.currency || 'USD'}
            userCurrency={userCurrency}
            showConversion={true}
          />
        </div>
      </div>
    </div>
  );
}

// Example usage in portfolio items
export function PortfolioItemPrice({ item }: { item: any }) {
  const [userCurrency, setUserCurrency] = useState('KES');

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">Price</span>
        <select
          value={userCurrency}
          onChange={(e) => setUserCurrency(e.target.value)}
          className="text-xs px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-accent-gold"
        >
          {currencyService.getSupportedCurrencies().slice(0, 10).map(currency => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <CurrencyExample
        price={item.price || 0}
        originalCurrency={item.currency || 'USD'}
        userCurrency={userCurrency}
        showConversion={true}
      />
    </div>
  );
}
