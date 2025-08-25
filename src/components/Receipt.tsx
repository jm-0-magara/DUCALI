// src/components/Receipt.tsx
'use client';

import React, { useState } from 'react';
import { Download, Printer, FileText, DollarSign, Calendar, User, Package, CheckCircle } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

interface ReceiptProps {
  order: {
    id: string;
    projectId: string;
    customerId: string;
    artisanId: string;
    amount: number;
    currency: string;
    description: string;
    timeline: string;
    status: string;
    createdAt: Date;
    completedAt?: Date;
    paymentId?: string;
    paidAmount?: number;
  };
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  artisan: {
    name: string;
    email?: string;
    phone?: string;
  };
  onDownload?: () => void;
  onPrint?: () => void;
}

export default function Receipt({ order, customer, artisan, onDownload, onPrint }: ReceiptProps) {
  const { formatCurrency } = useCurrency();
  const [isPrinting, setIsPrinting] = useState(false);

  // Calculate remaining amount
  const totalAmount = order.amount;
  const paidAmount = order.paidAmount || 0;
  const remainingAmount = totalAmount - paidAmount;

  const handlePrint = () => {
    setIsPrinting(true);
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center justify-center mb-2">
          <FileText className="w-8 h-8 text-green-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Receipt</h1>
        </div>
        <p className="text-gray-600">Order #{order.id.slice(-8)}</p>
        <p className="text-sm text-gray-500">Generated on {formatDate(new Date())}</p>
      </div>

      {/* Order Status */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">Order Completed</span>
        </div>
      </div>

      {/* Customer and Artisan Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Customer
          </h3>
          <p className="font-medium">{customer.name}</p>
          {customer.email && <p className="text-sm text-gray-600">{customer.email}</p>}
          {customer.phone && <p className="text-sm text-gray-600">{customer.phone}</p>}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Artisan
          </h3>
          <p className="font-medium">{artisan.name}</p>
          {artisan.email && <p className="text-sm text-gray-600">{artisan.email}</p>}
          {artisan.phone && <p className="text-sm text-gray-600">{artisan.phone}</p>}
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Project:</span>
            <span className="font-medium">{order.description}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Timeline:</span>
            <span className="font-medium">{order.timeline}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Completion Date:</span>
            <span className="font-medium">
              {order.completedAt ? formatDate(order.completedAt) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Payment Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold text-lg">
              {formatCurrency(totalAmount)} {order.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="font-medium text-green-600">
              {formatCurrency(paidAmount)} {order.currency}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between">
              <span className="text-gray-800 font-semibold">Remaining Amount:</span>
              <span className="font-bold text-lg text-blue-600">
                {formatCurrency(remainingAmount)} {order.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      {remainingAmount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Payment Required</h3>
          <p className="text-yellow-700 text-sm">
            Please pay the remaining amount of {formatCurrency(remainingAmount)} {order.currency} to complete your order.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <Printer className="w-4 h-4" />
          {isPrinting ? 'Printing...' : 'Print'}
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Thank you for choosing Ducali for your project!
        </p>
        <p className="text-xs text-gray-400 mt-1">
          This receipt serves as proof of your completed order.
        </p>
      </div>
    </div>
  );
}
