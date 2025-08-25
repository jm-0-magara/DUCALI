"use client";

import React, { useState } from 'react';
import { Smartphone, DollarSign, CheckCircle } from 'lucide-react';
import MpesaPaymentModal from '../../components/payments/MpesaPaymentModal';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';

export default function TestMpesaPage() {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentSuccess(paymentId);
    console.log('M-Pesa payment completed:', paymentId);
  };

  const testOrder = {
    id: 'test_order_123',
    artisanId: 'test_artisan_456',
    amount: 5000, // 5000 KES
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
          <Smartphone className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">M-Pesa Payment Test</h1>
          <p className="text-slate-400 mb-6">Please log in to test M-Pesa payments</p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Login Required
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-green-500/20 rounded-full px-6 py-3 mb-4">
            <Smartphone className="w-6 h-6 text-green-500" />
            <span className="text-green-400 font-medium">M-Pesa Payment Test</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Test M-Pesa Integration</h1>
          <p className="text-slate-400 text-lg">
            Experience seamless mobile money payments with M-Pesa
          </p>
        </div>

        {/* Success Message */}
        {paymentSuccess && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-1">Payment Successful!</h3>
                <p className="text-green-300">Payment ID: {paymentSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {/* Test Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* M-Pesa Test Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Smartphone className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">M-Pesa Payment</h3>
                <p className="text-slate-400 text-sm">Mobile Money</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Amount:</span>
                <span className="text-2xl font-bold text-white">{formatCurrency(testOrder.amount)} KES</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Order ID:</span>
                <span className="text-white font-mono">{testOrder.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Payment Method:</span>
                <span className="text-green-400 font-medium">M-Pesa STK Push</span>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Smartphone className="w-5 h-5" />
              Pay with M-Pesa
            </button>
          </div>

          {/* Features Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">M-Pesa Features</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Instant STK Push</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Secure PIN Entry</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Real-time Notifications</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Escrow Protection</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Transaction Tracking</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">Test Instructions</h4>
              <ol className="text-blue-300 text-sm space-y-1">
                <li>1. Click "Pay with M-Pesa"</li>
                <li>2. Enter your phone number</li>
                <li>3. Check your phone for STK Push</li>
                <li>4. Enter your M-Pesa PIN</li>
                <li>5. Confirm payment</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">About M-Pesa Integration</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-green-400 font-medium mb-2">Security</h4>
              <p className="text-slate-400 text-sm">
                All payments are secured with M-Pesa's encryption and held in escrow until order completion.
              </p>
            </div>
            <div>
              <h4 className="text-green-400 font-medium mb-2">Convenience</h4>
              <p className="text-slate-400 text-sm">
                No need for cards or bank accounts. Just use your mobile phone to make instant payments.
              </p>
            </div>
            <div>
              <h4 className="text-green-400 font-medium mb-2">Reliability</h4>
              <p className="text-slate-400 text-sm">
                M-Pesa is Kenya's most trusted mobile money platform with millions of users.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* M-Pesa Payment Modal */}
      <MpesaPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        orderId={testOrder.id}
        artisanId={testOrder.artisanId}
        amount={testOrder.amount}
        currency="KES"
        darkMode={true}
      />
    </div>
  );
}
