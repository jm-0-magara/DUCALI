// src/lib/currencyService.ts
export interface CurrencyRate {
  currency: string;
  rate: number;
  lastUpdated: Date;
}

export interface CurrencyConversion {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  timestamp: Date;
}

class CurrencyService {
  private baseUrl = 'https://v6.exchangerate-api.com/v6';
  private apiKey = '85e1cd1aebf814f83b18d540';
  private cache: Map<string, { rates: Record<string, number>; timestamp: number }> = new Map();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  /**
   * Get exchange rates for a base currency
   */
  async getExchangeRates(baseCurrency: string = 'KES'): Promise<Record<string, number>> {
    try {
      const cacheKey = `rates_${baseCurrency}`;
      const cached = this.cache.get(cacheKey);
      
      // Check if we have valid cached data
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.rates;
      }

      const response = await fetch(`${this.baseUrl}/${this.apiKey}/latest/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rates: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.result !== 'success') {
        throw new Error(`API Error: ${data['error-type'] || 'Unknown error'}`);
      }
      
      if (!data.conversion_rates) {
        throw new Error('API Response missing conversion_rates');
      }
      
      // Cache the rates properly
      this.cache.set(cacheKey, {
        rates: data.conversion_rates,
        timestamp: Date.now()
      });

      return data.conversion_rates;

    } catch (error) {
      console.error('❌ Error fetching exchange rates:', error);
      
      // Return fallback rates for common currencies
      return this.getFallbackRates(baseCurrency);
    }
  }

  /**
   * Convert amount from one currency to another
   */
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<CurrencyConversion> {
    try {
      // If same currency, return original amount
      if (fromCurrency === toCurrency) {
        return {
          from: fromCurrency,
          to: toCurrency,
          amount,
          convertedAmount: amount,
          rate: 1,
          timestamp: new Date()
        };
      }

      const rates = await this.getExchangeRates(fromCurrency);
      
      const rate = rates[toCurrency];

      if (!rate) {
        throw new Error(`Exchange rate not found for ${toCurrency}. Available currencies: ${Object.keys(rates).slice(0, 10).join(', ')}...`);
      }

      const convertedAmount = amount * rate;

      return {
        from: fromCurrency,
        to: toCurrency,
        amount,
        convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
        rate,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('❌ Error converting currency:', error);
      throw error;
    }
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): string[] {
    return [
      'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD',
      'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR',
      'NGN', 'GHS', 'KES', 'UGX', 'TZS', 'ZMW', 'MWK', 'BWP', 'NAD', 'SZL'
    ];
  }

  /**
   * Get currency symbol
   */
  getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'AUD': 'A$',
      'CAD': 'C$',
      'CHF': 'CHF',
      'CNY': '¥',
      'SEK': 'kr',
      'NZD': 'NZ$',
      'MXN': '$',
      'SGD': 'S$',
      'HKD': 'HK$',
      'NOK': 'kr',
      'KRW': '₩',
      'TRY': '₺',
      'RUB': '₽',
      'INR': '₹',
      'BRL': 'R$',
      'ZAR': 'R',
      'NGN': '₦',
      'GHS': 'GH₵',
      'KES': 'KSh',
      'UGX': 'USh',
      'TZS': 'TSh',
      'ZMW': 'ZK',
      'MWK': 'MK',
      'BWP': 'P',
      'NAD': 'N$',
      'SZL': 'E'
    };
    
    return symbols[currency] || currency;
  }

  /**
   * Format currency amount with symbol
   */
  formatCurrency(amount: number, currency: string): string {
    const symbol = this.getCurrencySymbol(currency);
    
    // Format based on currency
    switch (currency) {
      case 'USD':
      case 'EUR':
      case 'GBP':
      case 'CAD':
      case 'AUD':
      case 'NZD':
        return `${symbol}${amount.toFixed(2)}`;
      
      case 'JPY':
      case 'KRW':
        return `${symbol}${Math.round(amount)}`;
      
      case 'NGN':
      case 'GHS':
      case 'KES':
      case 'UGX':
      case 'TZS':
      case 'ZMW':
      case 'MWK':
      case 'BWP':
      case 'NAD':
      case 'SZL':
        return `${symbol}${amount.toFixed(2)}`;
      
      default:
        return `${symbol}${amount.toFixed(2)}`;
    }
  }

  /**
   * Get fallback rates for offline/error scenarios
   */
  private getFallbackRates(baseCurrency: string): Record<string, number> {
    const fallbackRates: Record<string, Record<string, number>> = {
      'USD': {
        'EUR': 0.85,
        'GBP': 0.73,
        'JPY': 110.0,
        'AUD': 1.35,
        'CAD': 1.25,
        'CHF': 0.92,
        'CNY': 6.45,
        'SEK': 8.65,
        'NZD': 1.42,
        'MXN': 20.0,
        'SGD': 1.35,
        'HKD': 7.78,
        'NOK': 8.45,
        'KRW': 1150.0,
        'TRY': 8.5,
        'RUB': 75.0,
        'INR': 74.0,
        'BRL': 5.2,
        'ZAR': 14.5,
        'NGN': 410.0,
        'GHS': 6.0,
        'KES': 110.0,
        'UGX': 3500.0,
        'TZS': 2300.0,
        'ZMW': 18.0,
        'MWK': 800.0,
        'BWP': 11.0,
        'NAD': 14.5,
        'SZL': 14.5
      },
      'KES': {
        'USD': 0.0091,
        'EUR': 0.0077,
        'GBP': 0.0066,
        'JPY': 1.0,
        'AUD': 0.0123,
        'CAD': 0.0114,
        'CHF': 0.0084,
        'CNY': 0.0586,
        'SEK': 0.0786,
        'NZD': 0.0129,
        'MXN': 0.1818,
        'SGD': 0.0123,
        'HKD': 0.0707,
        'NOK': 0.0768,
        'KRW': 10.45,
        'TRY': 0.0773,
        'RUB': 0.6818,
        'INR': 0.6727,
        'BRL': 0.0473,
        'ZAR': 0.1318,
        'NGN': 3.7273,
        'GHS': 0.0545,
        'UGX': 31.82,
        'TZS': 20.91,
        'ZMW': 0.1636,
        'MWK': 7.2727,
        'BWP': 0.1,
        'NAD': 0.1318,
        'SZL': 0.1318
      }
    };

    return fallbackRates[baseCurrency] || { [baseCurrency]: 1 };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { size: number; entries: Array<{ key: string; timestamp: number; ratesCount: number }> } {
    const entries = Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      timestamp: value.timestamp,
      ratesCount: Object.keys(value.rates).length
    }));

    return {
      size: this.cache.size,
      entries
    };
  }

  /**
   * Get API key status (masked for security)
   */
  getApiKeyStatus(): { hasKey: boolean; maskedKey: string } {
    const hasKey = !!this.apiKey;
    const maskedKey = hasKey ? `${this.apiKey.substring(0, 8)}...${this.apiKey.substring(this.apiKey.length - 4)}` : 'None';
    
    return { hasKey, maskedKey };
  }
}

// Export singleton instance
export const currencyService = new CurrencyService();
