import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

export interface AdminSettings {
  platformName: string;
  platformDescription: string;
  contactEmail: string;
  supportPhone: string;
  commissionRate: number;
  maxFileSize: number;
  autoApproveArtisans: boolean;
  requireVerification: boolean;
  enableNotifications: boolean;
  maintenanceMode: boolean;
  currency: string;
  timezone: string;
  language: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CurrencySettings {
  defaultCurrency: string;
  supportedCurrencies: string[];
  exchangeRates: Record<string, number>;
  updatedAt?: Date;
}

class AdminSettingsService {
  private settingsCollection = 'admin_settings';
  private settingsDocId = 'platform_settings';

  // Get platform settings
  async getPlatformSettings(): Promise<AdminSettings> {
    try {
      if (!db) throw new Error('Database not initialized');

      const settingsRef = doc(db, this.settingsCollection, this.settingsDocId);
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        return {
          platformName: data.platformName || 'Ducali',
          platformDescription: data.platformDescription || 'Connecting artisans with customers worldwide',
          contactEmail: data.contactEmail || 'admin@ducali.com',
          supportPhone: data.supportPhone || '+1234567890',
          commissionRate: data.commissionRate || 10,
          maxFileSize: data.maxFileSize || 10,
          autoApproveArtisans: data.autoApproveArtisans || false,
          requireVerification: data.requireVerification || true,
          enableNotifications: data.enableNotifications || true,
          maintenanceMode: data.maintenanceMode || false,
          currency: data.currency || 'USD',
          timezone: data.timezone || 'UTC',
          language: data.language || 'English',
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        };
      } else {
        // Return default settings if no document exists
        const defaultSettings: AdminSettings = {
          platformName: 'Ducali',
          platformDescription: 'Connecting artisans with customers worldwide',
          contactEmail: 'admin@ducali.com',
          supportPhone: '+1234567890',
          commissionRate: 10,
          maxFileSize: 10,
          autoApproveArtisans: false,
          requireVerification: true,
          enableNotifications: true,
          maintenanceMode: false,
          currency: 'USD',
          timezone: 'UTC',
          language: 'English'
        };

        // Create the default settings document
        await this.updatePlatformSettings(defaultSettings);
        return defaultSettings;
      }
    } catch (error) {
      console.error('Error getting platform settings:', error);
      throw error;
    }
  }

  // Update platform settings
  async updatePlatformSettings(settings: Partial<AdminSettings>): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      const settingsRef = doc(db, this.settingsCollection, this.settingsDocId);
      
      const updateData = {
        ...settings,
        updatedAt: serverTimestamp()
      };

      // Check if document exists
      const settingsDoc = await getDoc(settingsRef);
      
      if (settingsDoc.exists()) {
        await updateDoc(settingsRef, updateData);
      } else {
        await setDoc(settingsRef, {
          ...updateData,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating platform settings:', error);
      throw error;
    }
  }

  // Get currency settings
  async getCurrencySettings(): Promise<CurrencySettings> {
    try {
      if (!db) throw new Error('Database not initialized');

      const currencyRef = doc(db, this.settingsCollection, 'currency_settings');
      const currencyDoc = await getDoc(currencyRef);

      if (currencyDoc.exists()) {
        const data = currencyDoc.data();
        return {
          defaultCurrency: data.defaultCurrency || 'USD',
          supportedCurrencies: data.supportedCurrencies || ['USD', 'EUR', 'GBP', 'KES'],
          exchangeRates: data.exchangeRates || {
            USD: 1,
            EUR: 0.85,
            GBP: 0.73,
            KES: 110.5
          },
          updatedAt: data.updatedAt?.toDate()
        };
      } else {
        // Return default currency settings
        const defaultCurrencySettings: CurrencySettings = {
          defaultCurrency: 'USD',
          supportedCurrencies: ['USD', 'EUR', 'GBP', 'KES'],
          exchangeRates: {
            USD: 1,
            EUR: 0.85,
            GBP: 0.73,
            KES: 110.5
          }
        };

        // Create the default currency settings document
        await this.updateCurrencySettings(defaultCurrencySettings);
        return defaultCurrencySettings;
      }
    } catch (error) {
      console.error('Error getting currency settings:', error);
      throw error;
    }
  }

  // Update currency settings
  async updateCurrencySettings(settings: Partial<CurrencySettings>): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      const currencyRef = doc(db, this.settingsCollection, 'currency_settings');
      
      const updateData = {
        ...settings,
        updatedAt: serverTimestamp()
      };

      // Check if document exists
      const currencyDoc = await getDoc(currencyRef);
      
      if (currencyDoc.exists()) {
        await updateDoc(currencyRef, updateData);
      } else {
        await setDoc(currencyRef, {
          ...updateData,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating currency settings:', error);
      throw error;
    }
  }

  // Check if platform is in maintenance mode
  async isMaintenanceMode(): Promise<boolean> {
    try {
      const settings = await this.getPlatformSettings();
      return settings.maintenanceMode;
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
      return false;
    }
  }

  // Get commission rate
  async getCommissionRate(): Promise<number> {
    try {
      const settings = await this.getPlatformSettings();
      return settings.commissionRate;
    } catch (error) {
      console.error('Error getting commission rate:', error);
      return 10; // Default commission rate
    }
  }

  // Get supported currencies
  async getSupportedCurrencies(): Promise<string[]> {
    try {
      const currencySettings = await this.getCurrencySettings();
      return currencySettings.supportedCurrencies;
    } catch (error) {
      console.error('Error getting supported currencies:', error);
      return ['USD', 'EUR', 'GBP', 'KES'];
    }
  }

  // Convert currency
  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      const currencySettings = await this.getCurrencySettings();
      const rates = currencySettings.exchangeRates;
      
      // Convert to USD first, then to target currency
      const usdAmount = amount / (rates[fromCurrency] || 1);
      return usdAmount * (rates[toCurrency] || 1);
    } catch (error) {
      console.error('Error converting currency:', error);
      return amount; // Return original amount if conversion fails
    }
  }
}

export const adminSettingsService = new AdminSettingsService();

