"use client";

import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { paymentService } from '../../lib/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  orderId: string;
  artisanId: string;
  amount: number;
  currency?: string;
  darkMode?: boolean;
}

type PaymentMethod = 'stripe' | 'mpesa' | 'paypal';

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  orderId,
  artisanId,
  amount,
  currency = 'USD',
  darkMode = true
}: PaymentModalProps) {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentIntent, setPaymentIntent] = useState<any>(null);

  // Stripe Elements state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
      setPaymentIntent(null);
    }
  }, [isOpen]);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setError('');
  };

  const validateForm = () => {
    if (paymentMethod === 'mpesa' && !phoneNumber.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (paymentMethod === 'stripe') {
      if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) {
        setError('Please fill in all card details');
        return false;
      }
    }
    return true;
  };

  const handleStripePayment = async () => {
    try {
      setIsProcessing(true);
      setError('');

      // Create payment record
      const payment = await paymentService.createPayment({
        orderId,
        customerId: user!.id,
        artisanId,
        amount,
        currency,
        paymentMethod: 'stripe',
        paymentType: 'full',
      });

      // Create Stripe payment intent
      const intent = await paymentService.createStripePaymentIntent(amount, currency);
      setPaymentIntent(intent);

      // Update payment with transaction ID
      await paymentService.updatePaymentStatus(payment.id, 'processing', intent.id);

      // Simulate payment processing (in real app, this would be handled by Stripe Elements)
      setTimeout(() => {
        setSuccess('Payment processed successfully!');
        setTimeout(() => {
          onSuccess(payment.id);
          onClose();
        }, 2000);
      }, 2000);

    } catch (error: any) {
      console.error('Stripe payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMpesaPayment = async () => {
    try {
      setIsProcessing(true);
      setError('');

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
          phoneNumber,
          amount,
          orderId,
          customerId: user!.id,
          artisanId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('STK Push sent! Please check your phone and enter M-Pesa PIN.');
        // In a real app, you'd poll for payment status
        setTimeout(() => {
          setSuccess('Payment completed successfully!');
          setTimeout(() => {
            onSuccess(payment.id);
            onClose();
          }, 2000);
        }, 5000);
      } else {
        setError(result.error || 'M-Pesa payment failed');
      }

    } catch (error: any) {
      console.error('M-Pesa payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (paymentMethod === 'stripe') {
      await handleStripePayment();
    } else if (paymentMethod === 'mpesa') {
      await handleMpesaPayment();
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
          <div>
            <h2 className="text-xl font-bold">Complete Payment</h2>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
              {formatCurrency(amount)} {currency}
            </p>
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

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Payment Method Selection */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Payment Method
            </label>
                         <div className="space-y-3">
               <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                 paymentMethod === 'mpesa'
                   ? darkMode 
                     ? 'border-green-500 bg-green-500/10' 
                     : 'border-green-500 bg-green-50'
                   : darkMode 
                     ? 'border-slate-600 hover:border-slate-500' 
                     : 'border-slate-200 hover:border-slate-300'
               }`}>
                 <input
                   type="radio"
                   name="paymentMethod"
                   value="mpesa"
                   checked={paymentMethod === 'mpesa'}
                   onChange={() => handlePaymentMethodChange('mpesa')}
                   className="text-green-500"
                 />
                 <Smartphone className="w-5 h-5" />
                 <span>M-Pesa (Recommended)</span>
               </label>

               <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                 paymentMethod === 'stripe'
                   ? darkMode 
                     ? 'border-blue-500 bg-blue-500/10' 
                     : 'border-blue-500 bg-blue-50'
                   : darkMode 
                     ? 'border-slate-600 hover:border-slate-500' 
                     : 'border-slate-200 hover:border-slate-300'
               }`}>
                 <input
                   type="radio"
                   name="paymentMethod"
                   value="stripe"
                   checked={paymentMethod === 'stripe'}
                   onChange={() => handlePaymentMethodChange('stripe')}
                   className="text-blue-500"
                 />
                 <CreditCard className="w-5 h-5" />
                 <span>Credit/Debit Card</span>
               </label>
             </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === 'stripe' && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-cream' : 'text-slate-700'
                }`}>
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    darkMode ? 'text-cream' : 'text-slate-700'
                  }`}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    darkMode ? 'text-cream' : 'text-slate-700'
                  }`}>
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'mpesa' && (
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-cream' : 'text-slate-700'
              }`}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 0712345678"
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-green-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-green-500'
                }`}
              />
              <p className={`text-xs mt-2 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                You'll receive an M-Pesa prompt on your phone
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              paymentMethod === 'stripe'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${formatCurrency(amount)} ${currency}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
