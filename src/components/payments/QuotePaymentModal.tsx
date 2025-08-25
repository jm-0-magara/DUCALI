"use client";

import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { QuoteRequest } from '../../lib/quoteService';
import { paymentService } from '../../lib/paymentService';
import { notificationService } from '../../lib/notificationService';
import toast from 'react-hot-toast';

interface QuotePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteRequest: QuoteRequest;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

type PaymentMethod = 'mpesa' | 'stripe' | 'paypal';

export default function QuotePaymentModal({
  isOpen,
  onClose,
  quoteRequest,
  onPaymentSuccess,
  onPaymentError
}: QuotePaymentModalProps) {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quoteAmount = quoteRequest.artisanResponse?.quote || 0;
  const currency = quoteRequest.artisanResponse?.currency || 'KES';

  const handlePayment = async () => {
    if (!user?.id) {
      setError('You must be logged in to make a payment');
      toast.error('You must be logged in to make a payment');
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Show processing toast
    const processingToast = toast.loading('Processing payment...', {
      duration: Infinity,
    });

    try {
      let paymentResult;

      switch (paymentMethod) {
        case 'mpesa':
          if (!phoneNumber) {
            throw new Error('Phone number is required for M-Pesa payment');
          }
          
          // Show M-Pesa specific toast
          toast.success('Initiating M-Pesa payment...', { id: processingToast });
          
          paymentResult = await paymentService.createMpesaPayment({
            phoneNumber,
            amount: quoteAmount,
            orderId: quoteRequest.id,
            customerId: user.id,
            artisanId: quoteRequest.artisanId
          });
          
          // Check if it's a mock payment (development mode)
          if (paymentResult.data?.CheckoutRequestID?.startsWith('mock_')) {
            toast.success('Mock payment initiated! Waiting for confirmation...', { id: processingToast });
            
            // Show development note about STK push
            toast('💡 Development Mode: This is a mock payment. In production, you would receive an STK push on your phone.', {
              duration: 5000,
              icon: '💡'
            });
            
            // For mock payments, wait for confirmation (simulates real M-Pesa experience)
            await waitForPaymentConfirmation(paymentResult.data?.CheckoutRequestID, processingToast);
          } else {
            // For real M-Pesa payments, show waiting message
            toast.success('M-Pesa payment initiated! Please check your phone for STK push and enter your PIN.', { id: processingToast });
            
            // Wait for payment confirmation
            await waitForPaymentConfirmation(paymentResult.data?.CheckoutRequestID, processingToast);
          }
          
          // Send notification to customer
          await notificationService.sendMpesaPaymentConfirmation(user.id, {
            amount: quoteAmount,
            phoneNumber,
            transactionId: paymentResult.data?.CheckoutRequestID || paymentResult.data?.MerchantRequestID || 'pending',
            orderId: quoteRequest.id,
          });
          break;

        case 'stripe':
          toast.success('Redirecting to secure payment...', { id: processingToast });
          paymentResult = await paymentService.createStripePaymentIntent(quoteAmount, currency.toLowerCase());
          // In a real implementation, you'd redirect to Stripe Checkout or use Stripe Elements
          toast.success('Payment intent created successfully!', { id: processingToast });
          
          // Send notification to customer
          await notificationService.sendStripePaymentConfirmation(user.id, {
            amount: quoteAmount,
            currency,
            paymentIntentId: paymentResult.id || 'pending',
            orderId: quoteRequest.id,
          });
          break;

        case 'paypal':
          // PayPal implementation would go here
          throw new Error('PayPal payment not yet implemented');
          break;

        default:
          throw new Error('Invalid payment method');
      }

      // Show final success message
      toast.success('Payment processed successfully!', { id: processingToast });
      
      // Notify parent component
      onPaymentSuccess(paymentResult.id || 'payment-success');
      
    } catch (err: any) {
      console.error('Payment error:', err);
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onPaymentError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage, { id: processingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to wait for M-Pesa payment confirmation
  const waitForPaymentConfirmation = async (checkoutRequestId: string, processingToast: string) => {
    let attempts = 0;
    const maxAttempts = 30; // Wait up to 5 minutes (30 * 10 seconds)
    const isMockPayment = checkoutRequestId.startsWith('mock_');
    
    while (attempts < maxAttempts) {
      try {
        // Check payment status
        const response = await fetch(`/api/payments/mpesa/status?checkoutRequestId=${checkoutRequestId}`);
        const statusData = await response.json();
        
        if (statusData.status === 'confirmed') {
          toast.success('Payment confirmed! Accepting quote...', { id: processingToast });
          await acceptQuoteAfterPayment(checkoutRequestId);
          return;
        } else if (statusData.status === 'failed') {
          throw new Error('Payment failed. Please try again.');
        }
        
        // Wait 10 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 10000));
        attempts++;
        
        // Update toast message to show waiting status
        const timeRemaining = Math.ceil((maxAttempts - attempts) * 10 / 60);
        const paymentType = isMockPayment ? 'Mock M-Pesa' : 'M-Pesa';
        
        toast.loading(
          `Waiting for ${paymentType} confirmation... (${attempts}/${maxAttempts}) - ${timeRemaining} min remaining`, 
          { id: processingToast }
        );
        
        // For mock payments, provide additional feedback
        if (isMockPayment && attempts === 1) {
          toast('💡 Mock payment tip: Payment will be confirmed automatically after 30 seconds for testing purposes.', {
            duration: 5000,
            icon: '💡'
          });
        }
        
      } catch (error) {
        console.error('Error checking payment status:', error);
        attempts++;
      }
    }
    
    // If we reach here, payment confirmation timed out
    const paymentType = isMockPayment ? 'Mock M-Pesa' : 'M-Pesa';
    throw new Error(`${paymentType} confirmation timed out. Please check your payment and try again.`);
  };

  // Function to accept quote after payment confirmation
  const acceptQuoteAfterPayment = async (paymentId: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('📝 Accepting quote after payment:', {
        quoteId: quoteRequest.id,
        customerId: user.id,
        paymentId: paymentId
      });

      const response = await fetch(`/api/quotes/${quoteRequest.id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.id,
          paymentId: paymentId,
          paymentStatus: 'confirmed'
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('❌ Quote acceptance failed:', result);
        throw new Error(result.error || 'Failed to accept quote');
      }

      console.log('✅ Quote accepted successfully:', result);
      toast.success('Quote accepted successfully!');
      
    } catch (error) {
      console.error('❌ Error accepting quote:', error);
      throw new Error('Payment successful but failed to accept quote. Please contact support.');
    }
  };

  const paymentMethods = [
    {
      id: 'mpesa' as PaymentMethod,
      name: 'M-Pesa',
      icon: Smartphone,
      description: 'Pay with mobile money',
      popular: true
    },
    {
      id: 'stripe' as PaymentMethod,
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay with card',
      popular: false
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      icon: CreditCard,
      description: 'Pay with PayPal',
      popular: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Complete Payment
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Secure payment for your quote request
          </p>
        </div>

        {/* Quote Summary */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-900 dark:text-white mb-3">
            Quote Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Project:</span>
              <span className="text-slate-900 dark:text-white font-medium">
                {quoteRequest.projectTitle}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Artisan ID:</span>
              <span className="text-slate-900 dark:text-white">
                {quoteRequest.artisanId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Timeline:</span>
              <span className="text-slate-900 dark:text-white">
                {quoteRequest.artisanResponse?.timeline}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-900 dark:text-white">Total Amount:</span>
              <span className="text-green-600 dark:text-green-400">
                {formatCurrency(quoteAmount)} {currency}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-900 dark:text-white mb-4">
            Choose Payment Method
          </h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === method.id
                    ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="sr-only"
                />
                <method.icon className="w-5 h-5 text-slate-600 dark:text-slate-400 mr-3" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {method.name}
                    </span>
                    {method.popular && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 text-xs rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {method.description}
                  </p>
                </div>
                {paymentMethod === method.id && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        {paymentMethod === 'mpesa' && (
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">
              M-Pesa Payment Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="254XXXXXXXXX"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your M-Pesa registered phone number
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white">
                Secure Payment
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Your payment is protected by bank-level security. Funds are held securely until the project is completed.
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === 'mpesa' && !phoneNumber)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  Pay {formatCurrency(quoteAmount)} {currency}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
