import React, { useState } from 'react';
import { Send, Calendar, DollarSign, MessageCircle } from 'lucide-react';
import { ArtisanProfile } from '../data/artisanData';

interface ContactFormProps {
  artisan: ArtisanProfile;
}

export default function ContactForm({ artisan }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    attachments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        budget: '',
        timeline: '',
        description: '',
        attachments: ''
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-white mb-4">Quote Request Sent!</h3>
              <p className="text-slate-300 mb-6">
                Thank you for your interest! {artisan.name} will review your request and get back to you within {artisan.responseTime}.
              </p>
              <div className="bg-slate-700 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-slate-400">
                  You&#39;ll receive a confirmation email shortly with your request details.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          {/* Contact Info (same as below) */}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Contact Form */}
      <div className="lg:col-span-2">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-6">Get a Custom Quote</h3>
          
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
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465]"
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
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465]"
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
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465]"
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
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465]"
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
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465]"
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
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465]"
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
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465] resize-none"
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
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#626F47] file:text-white hover:file:bg-[#A4B465] transition-colors"
              />
              <p className="text-slate-500 text-xs mt-1">
                Accepted formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB per file)
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#626F47] text-white py-3 px-6 rounded-lg hover:bg-[#A4B465] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Quote Request
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Contact Information Sidebar */}
      <div className="lg:col-span-1">
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
      </div>
    </div>
  );
}