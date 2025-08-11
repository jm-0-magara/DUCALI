// src/app/artisan/[id]/components/ContactForm.tsx (Enhanced)
import React, { useState } from 'react';
import { Send, Calendar, DollarSign, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../../contexts';
import { useOrders } from '../../../../contexts/OrderContext';
import { ArtisanProfile } from '../data/artisanData';

interface ContactFormProps {
  artisan: ArtisanProfile;
}

export default function ContactForm({ artisan }: ContactFormProps) {
  const { user, isAuthenticated } = useAuth();
  const { createOrder } = useOrders();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    attachments: ''
  });

  const [orderStatus, setOrderStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');
  const [orderError, setOrderError] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setOrderError('Please sign in to place an order');
      setOrderStatus('error');
      return;
    }

    if (!user) {
      setOrderError('User not found. Please sign in again.');
      setOrderStatus('error');
      return;
    }

    setOrderStatus('creating');
    setOrderError('');

    try {
      const result = await createOrder({
        artisanId: artisan.id.toString(),
        artisanName: artisan.name,
        artisanImage: artisan.image,
        customerId: user.id,
        customerName: user.name,
        service: formData.projectType || 'Custom Order',
        description: formData.description,
        budget: formData.budget,
        timeline: formData.timeline,
        attachments: formData.attachments
      });

      if (result.success && result.orderId) {
        setOrderStatus('success');
        setCreatedOrderId(result.orderId);
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setOrderStatus('idle');
          setFormData({
            name: user.name,
            email: user.email,
            phone: '',
            projectType: '',
            budget: '',
            timeline: '',
            description: '',
            attachments: ''
          });
        }, 5000);
      } else {
        setOrderStatus('error');
        setOrderError(result.error || 'Failed to create order');
      }
    } catch {
      setOrderStatus('error');
      setOrderError('An unexpected error occurred');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (orderStatus === 'error') {
      setOrderStatus('idle');
      setOrderError('');
    }
  };

  // Success state
  if (orderStatus === 'success') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Order Request Created!</h3>
              <p className="text-slate-300 mb-6">
                Your order request has been sent to {artisan.name}. They will review your request and send you a quote within {artisan.responseTime}.
              </p>
              <div className="bg-slate-700 rounded-lg p-4 max-w-md mx-auto mb-6">
                <p className="text-sm text-slate-400">Order ID</p>
                <p className="text-lg font-mono text-[#A4B465]">{createdOrderId}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.location.href = '/dashboard/customer'}
                  className="bg-[#626F47] text-white px-6 py-2 rounded-lg hover:bg-[#A4B465] transition-colors"
                >
                  View in Dashboard
                </button>
                <button
                  onClick={() => setOrderStatus('idle')}
                  className="border border-slate-600 text-slate-300 px-6 py-2 rounded-lg hover:border-[#A4B465] hover:text-[#A4B465] transition-colors"
                >
                  Create Another Order
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <ContactInfo artisan={artisan} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Contact Form */}
      <div className="lg:col-span-2">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-6">Request Custom Quote</h3>
          
          {!isAuthenticated && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-300 font-medium">Sign in required</p>
                  <p className="text-yellow-400 text-sm">Please sign in to request a quote from this artisan.</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={!isAuthenticated}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465] disabled:opacity-50"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!isAuthenticated}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465] disabled:opacity-50"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isAuthenticated}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465] disabled:opacity-50"
                  placeholder="+254 XXX XXX XXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Type *
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  required
                  disabled={!isAuthenticated}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465] disabled:opacity-50"
                >
                  <option value="">Select project type</option>
                  {artisan.services.map((service, index) => (
                    <option key={index} value={service.name}>{service.name}</option>
                  ))}
                  <option value="other">Other (please specify)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Budget Range
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  disabled={!isAuthenticated}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465] disabled:opacity-50"
                >
                  <option value="">Select budget range</option>
                  <option value="under-100">Under $100</option>
                  <option value="100-300">$100 - $300</option>
                  <option value="300-500">$300 - $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-plus">$1,000+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Timeline
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  disabled={!isAuthenticated}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465] disabled:opacity-50"
                >
                  <option value="">Select timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="1-2-weeks">1-2 weeks</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="2-3-months">2-3 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                disabled={!isAuthenticated}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465] resize-none disabled:opacity-50"
                placeholder="Describe your project in detail. Include any specific requirements, preferences, or inspiration you have..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Reference Images/Files
              </label>
              <input
                type="file"
                name="attachments"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                disabled={!isAuthenticated}
                className="w-full px-4 py-2 bg-[#1C1C1C] border border-[#B08D57]/30 rounded-lg text-[#FDF6F0] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6E1414] file:text-[#FDF6F0] hover:file:bg-[#6E1414]/80 transition-colors disabled:opacity-50"
              />
              <p className="text-slate-500 text-xs mt-1">
                Accepted formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB per file)
              </p>
            </div>

            {/* Error Message */}
            {orderStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{orderError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isAuthenticated || orderStatus === 'creating'}
              className="w-full bg-[#6E1414] text-[#FDF6F0] py-3 px-6 rounded-lg hover:bg-[#6E1414]/80 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {orderStatus === 'creating' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Order...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {isAuthenticated ? 'Send Quote Request' : 'Sign In to Order'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Contact Information Sidebar */}
      <div className="lg:col-span-1">
        <ContactInfo artisan={artisan} />
      </div>
    </div>
  );
}

// Separate component for the sidebar info
function ContactInfo({ artisan }: { artisan: ArtisanProfile }) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
      <h4 className="text-xl font-bold text-white mb-4">Why Choose {artisan.name}?</h4>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#626F47] p-2 rounded-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">Quick Response</p>
            <p className="text-slate-400 text-sm">Usually replies within {artisan.responseTime}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-[#626F47] p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">Experienced</p>
            <p className="text-slate-400 text-sm">{artisan.experience} in the field</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-[#626F47] p-2 rounded-lg">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">Fair Pricing</p>
            <p className="text-slate-400 text-sm">Starting {artisan.price}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4">
        <h5 className="text-white font-medium mb-2">What Happens Next?</h5>
        <ol className="text-slate-400 text-sm space-y-2">
          <li className="flex gap-2">
            <span className="bg-[#A4B465] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
            <span>You submit your project details</span>
          </li>
          <li className="flex gap-2">
            <span className="bg-[#A4B465] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
            <span>{artisan.name} reviews your request</span>
          </li>
          <li className="flex gap-2">
            <span className="bg-[#A4B465] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
            <span>You receive a custom quote</span>
          </li>
          <li className="flex gap-2">
            <span className="bg-[#A4B465] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
            <span>Start your project together</span>
          </li>
        </ol>
      </div>
    </div>
  );
}