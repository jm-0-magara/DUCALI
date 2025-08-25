"use client";

import React, { useState } from 'react';
import { Smartphone, CreditCard, DollarSign, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { paymentService } from '../../lib/paymentService';
import { useCurrency } from '../../contexts/CurrencyContext';
import toast from 'react-hot-toast';

type PaymentMethod = 'mpesa' | 'stripe';

export default function TestPaymentsPage() {
  const { formatCurrency } = useCurrency();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('254708374149');
  const [amount, setAmount] = useState('100');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>('');

  const handlePayment = async () => {
    if (!phoneNumber || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('Initiating payment...');

    const processingToast = toast.loading('Processing payment...', {
      duration: Infinity,
    });

    try {
      let paymentResult;

      if (paymentMethod === 'mpesa') {
        toast.success('Initiating M-Pesa payment...', { id: processingToast });
        setPaymentStatus('Initiating M-Pesa payment...');
        
        paymentResult = await paymentService.createMpesaPayment({
          phoneNumber,
          amount: Number(amount),
          orderId: `test_order_${Date.now()}`,
          customerId: 'test_customer',
          artisanId: 'test_artisan'
        });
        
        setCheckoutRequestId(paymentResult.data?.CheckoutRequestID || '');
        
        if (paymentResult.data?.CheckoutRequestID?.startsWith('mock_')) {
          toast.success('Mock payment initiated! Waiting for confirmation...', { id: processingToast });
          setPaymentStatus('Mock payment initiated! Waiting for confirmation...');
          
          toast('💡 Development Mode: This is a mock payment. In production, you would receive an STK push on your phone.', {
            duration: 5000,
            icon: '💡'
          });
          
          await waitForPaymentConfirmation(paymentResult.data?.CheckoutRequestID, processingToast);
        } else {
          toast.success('M-Pesa payment initiated! Please check your phone for STK push and enter your PIN.', { id: processingToast });
          setPaymentStatus('M-Pesa payment initiated! Please check your phone for STK push and enter your PIN.');
          
          await waitForPaymentConfirmation(paymentResult.data?.CheckoutRequestID, processingToast);
        }
      } else if (paymentMethod === 'stripe') {
        toast.success('Redirecting to secure payment...', { id: processingToast });
        setPaymentStatus('Redirecting to secure payment...');
        
        paymentResult = await paymentService.createStripePaymentIntent(Number(amount), 'kes');
        toast.success('Payment intent created successfully!', { id: processingToast });
        setPaymentStatus('Payment intent created successfully!');
      }

      toast.success('Payment processed successfully!', { id: processingToast });
      setPaymentStatus('Payment processed successfully!');
      
    } catch (err: any) {
      console.error('Payment error:', err);
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setPaymentStatus(`Error: ${errorMessage}`);
      toast.error(errorMessage, { id: processingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  const waitForPaymentConfirmation = async (checkoutRequestId: string, processingToast: string) => {
    let attempts = 0;
    const maxAttempts = 30;
    const isMockPayment = checkoutRequestId.startsWith('mock_');
    
    while (attempts < maxAttempts) {
      try {
        setPaymentStatus(`Checking payment status... (${attempts + 1}/${maxAttempts})`);
        
        const response = await fetch(`/api/payments/mpesa/status?checkoutRequestId=${checkoutRequestId}`);
        const statusData = await response.json();
        
        if (statusData.status === 'confirmed') {
          toast.success('Payment confirmed!', { id: processingToast });
          setPaymentStatus('Payment confirmed!');
          return;
        } else if (statusData.status === 'failed') {
          throw new Error('Payment failed. Please try again.');
        }
        
        await new Promise(resolve => setTimeout(resolve, 10000));
        attempts++;
        
        const timeRemaining = Math.ceil((maxAttempts - attempts) * 10 / 60);
        const paymentType = isMockPayment ? 'Mock M-Pesa' : 'M-Pesa';
        
        toast.loading(
          `Waiting for ${paymentType} confirmation... (${attempts}/${maxAttempts}) - ${timeRemaining} min remaining`, 
          { id: processingToast }
        );
        
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
    
    const paymentType = isMockPayment ? 'Mock M-Pesa' : 'M-Pesa';
    throw new Error(`${paymentType} confirmation timed out. Please check your payment and try again.`);
  };

  const handleCheckStatus = async () => {
    if (!checkoutRequestId) {
      toast.error('No checkout request ID to check');
      return;
    }

    try {
      setPaymentStatus('Checking payment status...');
      const response = await fetch(`/api/payments/mpesa/status?checkoutRequestId=${checkoutRequestId}`);
      const statusData = await response.json();
      
      setPaymentStatus(`Status: ${statusData.status}`);
      toast.success(`Payment status: ${statusData.status}`);
    } catch (error) {
      console.error('Error checking status:', error);
      setPaymentStatus('Error checking payment status');
      toast.error('Failed to check payment status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Payment Testing Page
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Test M-Pesa and Stripe payments using the website logic
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Payment Details
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Payment Method
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mpesa"
                  checked={paymentMethod === 'mpesa'}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="mr-2"
                />
                <Smartphone className="w-5 h-5 text-green-500 mr-2" />
                M-Pesa
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="mr-2"
                />
                <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
                Stripe
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Amount (KES)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          {paymentMethod === 'mpesa' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="254XXXXXXXXX"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your M-Pesa registered phone number
              </p>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={isProcessing || !amount || (paymentMethod === 'mpesa' && !phoneNumber)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5" />
                Pay {formatCurrency(Number(amount))} KES
              </>
            )}
          </button>
        </div>

        {paymentStatus && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Payment Status
            </h3>
            <div className="flex items-center gap-2">
              {paymentStatus.includes('Error') ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : paymentStatus.includes('confirmed') || paymentStatus.includes('successfully') ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              )}
              <span className="text-slate-700 dark:text-slate-300">{paymentStatus}</span>
            </div>
          </div>
        )}

        {checkoutRequestId && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Checkout Request ID
            </h3>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded text-sm font-mono">
                {checkoutRequestId}
              </code>
              <button
                onClick={handleCheckStatus}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Check Status
              </button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-400 mb-2">
            Development Notes
          </h3>
          <ul className="text-blue-800 dark:text-blue-300 text-sm space-y-1">
            <li>• M-Pesa payments are mocked in development mode</li>
            <li>• No real STK push will be sent to your phone</li>
            <li>• Mock payments are automatically confirmed after 30 seconds</li>
            <li>• Use this page to test the payment flow logic</li>
            <li>• Check the browser console for detailed logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
