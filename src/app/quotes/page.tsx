"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { QuoteRequest } from '../../lib/quoteService';
import QuoteRequestModal from '../../components/quotes/QuoteRequestModal';
import QuoteResponseModal from '../../components/quotes/QuoteResponseModal';
import QuotePaymentModal from '../../components/payments/QuotePaymentModal';
import { notificationService } from '../../lib/notificationService';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../components/Footer';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MessageSquare, 
  DollarSign,
  Calendar,
  MapPin,
  Filter,
  Search,
  Plus
} from 'lucide-react';

export default function QuotesPage() {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();

  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded' | 'accepted' | 'declined'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchQuoteRequests();
    }
  }, [user]);

  const fetchQuoteRequests = async () => {
    try {
      setLoading(true);
      const field = user?.role === 'customer' ? 'customerId' : 'artisanId';
      const response = await fetch(`/api/quotes/request?${field}=${user?.id}`);
      const result = await response.json();

      if (result.success) {
        setQuoteRequests(result.quoteRequests);
      } else {
        setError('Failed to fetch quote requests');
      }
    } catch (error) {
      console.error('Error fetching quote requests:', error);
      setError('Failed to fetch quote requests');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quoteRequests.filter(quote => {
    const matchesFilter = filter === 'all' || quote.status === filter;
    const matchesSearch = quote.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.projectType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'responded':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'declined':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'responded':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'accepted':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'declined':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    // Find the quote to show payment modal
    const quote = quoteRequests.find(q => q.id === quoteId);
    if (quote) {
      setSelectedQuote(quote);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    if (!selectedQuote) return;
    
    // Show processing toast
    const processingToast = toast.loading('Finalizing quote acceptance...', {
      duration: Infinity,
    });
    
    try {
      console.log('📝 Processing payment success for quote:', selectedQuote.id);
      
      // The quote acceptance is now handled in the QuotePaymentModal
      // We just need to close the modal and refresh the quotes
      setShowPaymentModal(false);
      setSelectedQuote(null);
      fetchQuoteRequests();
      
      // Show success toast
      toast.success('Quote accepted successfully! Your order is now in progress.', { id: processingToast });
      
      // Show additional notification
      toast.success('Payment confirmed! Artisan has been notified to start work.', {
        duration: 6000,
      });
      
      // Send notification to artisan
      try {
        await notificationService.sendQuoteAcceptedNotification(selectedQuote.artisanId, {
          quoteId: selectedQuote.id,
          customerName: user?.name || 'Customer',
          projectTitle: selectedQuote.projectTitle,
          amount: selectedQuote.artisanResponse?.quote || 0,
          currency: selectedQuote.artisanResponse?.currency || 'KES',
        });
      } catch (error) {
        console.error('Failed to send notification to artisan:', error);
      }
    } catch (error) {
      console.error('Error processing payment success:', error);
      setError('Failed to process payment success');
      toast.error('Failed to process payment success', { id: processingToast });
    }
  };

  const handlePaymentError = (error: string) => {
    setError(error);
    setShowPaymentModal(false);
    toast.error(`Payment failed: ${error}`);
  };

  const handleDeclineQuote = async (quoteId: string) => {
    const processingToast = toast.loading('Declining quote...', {
      duration: Infinity,
    });
    
    try {
      const response = await fetch(`/api/quotes/${quoteId}/decline`, {
        method: 'POST',
      });
      const result = await response.json();

      if (result.success) {
        fetchQuoteRequests();
        toast.success('Quote declined successfully', { id: processingToast });
        
        // Send notification to artisan
        try {
          const quote = quoteRequests.find(q => q.id === quoteId);
          if (quote) {
            await notificationService.sendQuoteDeclinedNotification(quote.artisanId, {
              quoteId: quote.id,
              customerName: user?.name || 'Customer',
              projectTitle: quote.projectTitle,
            });
          }
        } catch (error) {
          console.error('Failed to send notification to artisan:', error);
        }
      } else {
        setError('Failed to decline quote');
        toast.error('Failed to decline quote', { id: processingToast });
      }
    } catch (error) {
      console.error('Error declining quote:', error);
      setError('Failed to decline quote');
      toast.error('Failed to decline quote', { id: processingToast });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Please log in to view your quotes
            </h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {user.role === 'customer' ? 'My Quote Requests' : 'Quote Requests'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {user.role === 'customer' 
                ? 'Track and manage your quote requests to artisans'
                : 'Review and respond to customer quote requests'
              }
            </p>
          </div>
          {user.role === 'customer' && (
            <button
              onClick={() => setShowQuoteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Quote Request
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search quotes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Quote Requests List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading quotes...</p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No quotes found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : user.role === 'customer'
                  ? 'Start by requesting a quote from an artisan'
                  : 'No quote requests have been sent to you yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  {/* Quote Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                          {quote.projectTitle}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          {quote.projectType} • {quote.location}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {getStatusIcon(quote.status)}
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 mb-3 line-clamp-2">
                      {quote.projectDescription}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">
                          {formatCurrency(quote.budget.min)} - {formatCurrency(quote.budget.max)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">{quote.timeline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">{quote.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Artisan Response */}
                    {quote.artisanResponse && (
                      <div className="mt-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-green-800 dark:text-green-400">
                            Quote Response
                          </h4>
                          <span className="text-lg font-bold text-green-800 dark:text-green-400">
                            {formatCurrency(quote.artisanResponse.quote)} {quote.artisanResponse.currency}
                          </span>
                        </div>
                        <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                          {quote.artisanResponse.message}
                        </p>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          Timeline: {quote.artisanResponse.timeline}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {user.role === 'artisan' && quote.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedQuote(quote);
                          setShowResponseModal(true);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Respond
                      </button>
                    )}

                    {user.role === 'customer' && quote.status === 'responded' && (
                      <>
                        <button
                          onClick={() => handleAcceptQuote(quote.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Accept Quote
                        </button>
                        <button
                          onClick={() => handleDeclineQuote(quote.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Decline Quote
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setSelectedQuote(quote);
                        // Show detailed view or modal
                      }}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showQuoteModal && (
        <QuoteRequestModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          artisanId=""
          artisanName=""
          artisanSpecialty=""
          darkMode={true}
        />
      )}

      {showResponseModal && selectedQuote && (
        <QuoteResponseModal
          isOpen={showResponseModal}
          onClose={() => setShowResponseModal(false)}
          quoteRequest={selectedQuote}
          darkMode={true}
        />
      )}

      {showPaymentModal && selectedQuote && (
        <QuotePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          quoteRequest={selectedQuote}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
      <Footer />
    </div>
  );
}
