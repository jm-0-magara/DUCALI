"use client";

import React, { useState } from 'react';
import { X, Send, DollarSign, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { QuoteRequest, QuoteResponseData } from '../../lib/quoteService';

interface QuoteResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteRequest: QuoteRequest;
  darkMode?: boolean;
}

export default function QuoteResponseModal({
  isOpen,
  onClose,
  quoteRequest,
  darkMode = true
}: QuoteResponseModalProps) {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();

  const [formData, setFormData] = useState<QuoteResponseData>({
    quote: 0,
    currency: 'KES',
    message: '',
    timeline: '',
    terms: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (formData.quote <= 0) {
      setError('Please enter a valid quote amount');
      return false;
    }
    if (!formData.message.trim()) {
      setError('Please provide a message explaining your quote');
      return false;
    }
    if (!formData.timeline.trim()) {
      setError('Please specify the timeline for the project');
      return false;
    }
    if (!formData.terms.trim()) {
      setError('Please provide terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/quotes/${quoteRequest.id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Quote response sent successfully! The customer will be notified.');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to send quote response');
      }
    } catch (error: any) {
      console.error('Error sending quote response:', error);
      setError('Failed to send quote response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${
        darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
      } rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Respond to Quote Request</h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                {quoteRequest.projectTitle}
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

        {/* Project Details */}
        <div className="p-6 border-b border-slate-700">
          <h3 className="font-semibold mb-3">Project Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Type:</span>
              <p className="font-medium">{quoteRequest.projectType}</p>
            </div>
            <div>
              <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Location:</span>
              <p className="font-medium">{quoteRequest.location}</p>
            </div>
            <div>
              <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Budget Range:</span>
              <p className="font-medium">
                {formatCurrency(quoteRequest.budget.min)} - {formatCurrency(quoteRequest.budget.max)} {quoteRequest.budget.currency}
              </p>
            </div>
            <div>
              <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Timeline:</span>
              <p className="font-medium">{quoteRequest.timeline}</p>
            </div>
          </div>
          <div className="mt-3">
            <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Description:</span>
            <p className="text-sm mt-1">{quoteRequest.projectDescription}</p>
          </div>
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

        {/* Quote Response Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Quote Amount */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Your Quote Amount *
            </label>
            <div className="relative">
              <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <input
                type="number"
                value={formData.quote}
                onChange={(e) => handleInputChange('quote', Number(e.target.value))}
                placeholder="0"
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
              Customer budget: {formatCurrency(quoteRequest.budget.min)} - {formatCurrency(quoteRequest.budget.max)} {quoteRequest.budget.currency}
            </p>
          </div>

          {/* Timeline */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Project Timeline *
            </label>
            <div className="relative">
              <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                  darkMode
                    ? 'bg-slate-800 border-slate-600 text-white focus:border-green-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-green-500'
                }`}
              >
                <option value="">Select timeline</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="2-4 weeks">2-4 weeks</option>
                <option value="1-2 months">1-2 months</option>
                <option value="2-3 months">2-3 months</option>
                <option value="3+ months">3+ months</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Message to Customer *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Explain your quote, approach, and why you're the best choice for this project..."
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                darkMode
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-green-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-green-500'
              }`}
            />
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Terms and Conditions *
            </label>
            <textarea
              value={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.value)}
              placeholder="Include payment terms, warranty, materials, and any other important conditions..."
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                darkMode
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-green-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-green-500'
              }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Sending Response...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Quote Response
              </>
            )}
          </button>

          {/* Terms */}
          <p className={`text-xs text-center ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            By sending this response, you agree to honor the terms and conditions specified above.
          </p>
        </form>
      </div>
    </div>
  );
}
