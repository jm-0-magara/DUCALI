"use client";

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  X, 
  Save,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { adminSettingsService, CurrencySettings as CurrencySettingsType } from '../../../../lib/adminSettingsService';

export function CurrencySettings() {
  const [settings, setSettings] = useState<CurrencySettingsType>({
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'KES'],
    exchangeRates: {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      KES: 110.5
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCurrency, setNewCurrency] = useState('');
  const [newRate, setNewRate] = useState('');

  useEffect(() => {
    const fetchCurrencySettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const currencySettings = await adminSettingsService.getCurrencySettings();
        setSettings(currencySettings);
      } catch (error) {
        console.error('Error fetching currency settings:', error);
        setError('Failed to load currency settings. Using default values.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencySettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      await adminSettingsService.updateCurrencySettings(settings);
      
      // Show success message
      setError(null);
    } catch (error) {
      console.error('Error saving currency settings:', error);
      setError('Failed to save currency settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCurrency = () => {
    if (!newCurrency || !newRate) return;
    
    const currency = newCurrency.toUpperCase();
    const rate = parseFloat(newRate);
    
    if (isNaN(rate) || rate <= 0) {
      setError('Please enter a valid exchange rate');
      return;
    }
    
    if (settings.supportedCurrencies.includes(currency)) {
      setError('Currency already exists');
      return;
    }
    
    setSettings(prev => ({
      ...prev,
      supportedCurrencies: [...prev.supportedCurrencies, currency],
      exchangeRates: {
        ...prev.exchangeRates,
        [currency]: rate
      }
    }));
    
    setNewCurrency('');
    setNewRate('');
    setError(null);
  };

  const handleRemoveCurrency = (currency: string) => {
    if (currency === settings.defaultCurrency) {
      setError('Cannot remove default currency');
      return;
    }
    
    setSettings(prev => ({
      ...prev,
      supportedCurrencies: prev.supportedCurrencies.filter(c => c !== currency),
      exchangeRates: Object.fromEntries(
        Object.entries(prev.exchangeRates).filter(([key]) => key !== currency)
      )
    }));
    setError(null);
  };

  const handleRateChange = (currency: string, rate: string) => {
    const numRate = parseFloat(rate);
    if (isNaN(numRate) || numRate <= 0) return;
    
    setSettings(prev => ({
      ...prev,
      exchangeRates: {
        ...prev.exchangeRates,
        [currency]: numRate
      }
    }));
  };

  if (loading) {
    return (
      <div className="bg-card/20 rounded-xl p-6 border border-border/5 backdrop-blur-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-accent-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/20 rounded-xl p-6 border border-border/5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CreditCard className="w-6 h-6 text-accent-gold mr-3" />
          <h2 className="text-xl font-semibold text-white">Currency Settings</h2>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-accent-gold text-charcoal-black rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-gold/90 transition-colors flex items-center"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center text-red-400">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Default Currency */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-gray mb-2">
          Default Currency
        </label>
        <select
          value={settings.defaultCurrency}
          onChange={(e) => setSettings(prev => ({ ...prev, defaultCurrency: e.target.value }))}
          className="w-full px-4 py-2 bg-slate-gray/3 border border-slate-gray/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold/20"
        >
          {settings.supportedCurrencies.map(currency => (
            <option key={currency} value={currency}>
              {currency} ({getCurrencySymbol(currency)})
            </option>
          ))}
        </select>
      </div>

      {/* Exchange Rates */}
      <div className="mb-6">
        <h3 className="text-white font-medium mb-4">Exchange Rates (USD = 1.00)</h3>
        <div className="space-y-3">
          {settings.supportedCurrencies.map(currency => (
            <div key={currency} className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-gray mb-1">
                  {currency} ({getCurrencySymbol(currency)})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.exchangeRates[currency] || 0}
                  onChange={(e) => handleRateChange(currency, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-gray/3 border border-slate-gray/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold/20"
                />
              </div>
              
              {currency !== settings.defaultCurrency && (
                <button
                  onClick={() => handleRemoveCurrency(currency)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Remove currency"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add New Currency */}
      <div className="border-t border-border/5 pt-6">
        <h3 className="text-white font-medium mb-4">Add New Currency</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-gray mb-1">
              Currency Code
            </label>
            <input
              type="text"
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value.toUpperCase())}
              placeholder="e.g., CAD"
              className="w-full px-3 py-2 bg-slate-gray/3 border border-slate-gray/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold/20"
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-gray mb-1">
              Exchange Rate (USD = 1.00)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="e.g., 1.25"
              className="w-full px-3 py-2 bg-slate-gray/3 border border-slate-gray/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold/20"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleAddCurrency}
              disabled={!newCurrency || !newRate}
              className="px-4 py-2 bg-accent-gold text-charcoal-black rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-gold/90 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    KES: 'KSh',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    BRL: 'R$',
    MXN: '$',
    ZAR: 'R'
  };
  
  return symbols[currency] || currency;
}
