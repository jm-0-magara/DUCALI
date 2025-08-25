"use client";

import React, { useState, useEffect } from 'react';
import { X, Smartphone, Loader2, CheckCircle, AlertCircle, Phone, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { paymentService } from '../../lib/paymentService';

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  orderId: string;
  artisanId: string;
  amount: number;
  currency?: string;
  darkMode?: boolean;
}

export default function MpesaPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  orderId,
  artisanId,
  amount,
  currency = 'KES',
  darkMode = true
}: MpesaPaymentModalProps) {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
      setStep('input');
      setPhoneNumber('');
    }
  }, [isOpen]);

  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid Kenyan phone number
    if (cleanPhone.length === 9 && cleanPhone.startsWith('7')) {
      return '254' + cleanPhone;
    } else if (cleanPhone.length === 10 && cleanPhone.startsWith('07')) {
      return '254' + cleanPhone.slice(1);
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('254')) {
      return cleanPhone;
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('+254')) {
      return cleanPhone.slice(1);
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    const formattedPhone = validatePhoneNumber(phoneNumber);
    if (!formattedPhone) {
      setError('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      setStep('processing');

      // Create payment record
      const payment = await paymentService.createPayment({
        orderId,
        customerId: user!.id,
        artisanId,
        amount,
        currency: 'KES',
        paymentMethod: 'mpesa',
        paymentType: 'full',
      });

      // Initiate M-Pesa payment
      const response = await fetch('/api/payments/mpesa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          amount,
          orderId,
          customerId: user!.id,
          artisanId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('STK Push sent! Please check your phone and enter M-Pesa PIN.');
        setStep('success');
        
        // Simulate payment completion (in real app, you'd poll for status)
        setTimeout(() => {
          setSuccess('Payment completed successfully!');
          setTimeout(() => {
            onSuccess(payment.id);
            onClose();
          }, 2000);
        }, 5000);
      } else {
        setError(result.error || 'M-Pesa payment failed');
        setStep('input');
      }

    } catch (error: any) {
      console.error('M-Pesa payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setStep('input');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${
        darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
      } rounded-2xl max-w-md w-full`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Smartphone className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">M-Pesa Payment</h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                {formatCurrency(amount)} {currency}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-400">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Processing State */}
        {step === 'processing' && (
          <div className="p-6 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Please check your phone for the M-Pesa prompt and enter your PIN
            </p>
          </div>
        )}

        {/* Success State */}
        {step === 'success' && (
          <div className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Your payment has been processed successfully
            </p>
          </div>
        )}

        {/* Payment Form */}
        {step === 'input' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* M-Pesa Info */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-green-600">M-Pesa Mobile Money</span>
              </div>
              <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                Fast, secure, and convenient mobile money payment
              </p>
            </div>

            {/* Phone Number Input */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-cream' : 'text-slate-700'
              }`}>
                Phone Number
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., 0712345678"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-green-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-green-500'
                  }`}
                />
              </div>
              <p className={`text-xs mt-2 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Enter your M-Pesa registered phone number
              </p>
            </div>

            {/* Security Notice */}
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
                <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                  Secure Payment
                </span>
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Your payment is secured by M-Pesa's encryption and held in escrow until order completion
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  Pay {formatCurrency(amount)} KES with M-Pesa
                </>
              )}
            </button>

            {/* Terms */}
            <p className={`text-xs text-center ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              By proceeding, you agree to our payment terms and conditions
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
