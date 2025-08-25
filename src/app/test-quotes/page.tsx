"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import QuoteRequestModal from '../../components/quotes/QuoteRequestModal';
import QuoteResponseModal from '../../components/quotes/QuoteResponseModal';
import { QuoteRequest } from '../../lib/quoteService';
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
  Plus,
  User,
  Star
} from 'lucide-react';

// Sample data for testing (fallback if no real data)
const sampleArtisan = {
  id: 'test-artisan-123',
  name: 'John Doe',
  specialty: 'Custom Furniture',
  profileImage: '',
  rating: 4.8,
  reviewCount: 127
};

const sampleQuoteRequests: QuoteRequest[] = [
  {
    id: 'quote-1',
    customerId: 'customer-123',
    artisanId: 'test-artisan-123',
    projectTitle: 'Custom Dining Table',
    projectDescription: 'I need a custom dining table for 6 people, made from mahogany wood with a modern design.',
    projectType: 'furniture',
    budget: { min: 50000, max: 80000, currency: 'KES' },
    timeline: '2-4 weeks',
    location: 'Nairobi, Westlands',
    urgency: 'medium',
    attachments: [],
    additionalRequirements: 'Should be stain-resistant and include matching chairs.',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  },
  {
    id: 'quote-2',
    customerId: 'customer-123',
    artisanId: 'test-artisan-123',
    projectTitle: 'Kitchen Cabinet Renovation',
    projectDescription: 'Complete kitchen cabinet renovation including new doors, handles, and countertop.',
    projectType: 'renovation',
    budget: { min: 150000, max: 250000, currency: 'KES' },
    timeline: '1-2 months',
    location: 'Nairobi, Kilimani',
    urgency: 'high',
    attachments: [],
    additionalRequirements: 'Need to match existing kitchen theme.',
    status: 'responded',
    artisanResponse: {
      quote: 200000,
      currency: 'KES',
      message: 'I can complete this project within 6 weeks. I have extensive experience with kitchen renovations and will use high-quality materials.',
      timeline: '6 weeks',
      terms: '50% deposit required, balance upon completion. 2-year warranty on all work.',
      respondedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
  },
  {
    id: 'quote-3',
    customerId: 'customer-123',
    artisanId: 'test-artisan-123',
    projectTitle: 'Bedroom Wardrobe',
    projectDescription: 'Custom built-in wardrobe for master bedroom with sliding doors and internal organization.',
    projectType: 'furniture',
    budget: { min: 80000, max: 120000, currency: 'KES' },
    timeline: '1-2 months',
    location: 'Nairobi, Lavington',
    urgency: 'low',
    attachments: [],
    additionalRequirements: 'Should include shoe storage and hanging space.',
    status: 'accepted',
    artisanResponse: {
      quote: 95000,
      currency: 'KES',
      message: 'Perfect! I can create a beautiful custom wardrobe that maximizes your space. I\'ll include all the storage features you requested.',
      timeline: '5 weeks',
      terms: '30% deposit, 40% at halfway point, 30% upon completion. 3-year warranty.',
      respondedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Expired
  }
];

export default function TestQuotesPage() {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();

  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(sampleQuoteRequests);
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded' | 'accepted' | 'declined'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

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
    setQuoteRequests(prev => 
      prev.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: 'accepted' as const }
          : quote
      )
    );
  };

  const handleDeclineQuote = async (quoteId: string) => {
    setQuoteRequests(prev => 
      prev.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: 'declined' as const }
          : quote
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Quote System Test Page
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Test the quote request and response functionality
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setShowQuoteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Test Quote Request
            </button>
            
            <button
              onClick={() => {
                setSelectedQuote(sampleQuoteRequests[0]);
                setShowResponseModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Test Quote Response
            </button>
          </div>
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

        {/* Quote Requests List */}
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
                  {quote.status === 'responded' && (
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

        {/* Sample Artisan Info */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Sample Artisan for Testing
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">{sampleArtisan.name}</h4>
              <p className="text-slate-600 dark:text-slate-400">{sampleArtisan.specialty}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {sampleArtisan.rating} ({sampleArtisan.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showQuoteModal && (
        <QuoteRequestModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          artisanId={sampleArtisan.id}
          artisanName={sampleArtisan.name}
          artisanSpecialty={sampleArtisan.specialty}
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
      <Footer />
    </div>
  );
}
