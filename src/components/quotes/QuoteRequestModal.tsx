"use client";

import React, { useState, useEffect } from 'react';
import { X, Send, FileText, Calendar, MapPin, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  artisanId: string;
  artisanName: string;
  artisanSpecialty: string;
  darkMode?: boolean;
}

interface QuoteRequestData {
  customerId: string;
  artisanId: string;
  projectTitle: string;
  projectDescription: string;
  projectType: string;
  otherCategory: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  attachments: string[];
  additionalRequirements: string;
}

export default function QuoteRequestModal({
  isOpen,
  onClose,
  artisanId,
  artisanName,
  artisanSpecialty,
  darkMode = true
}: QuoteRequestModalProps) {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();

  const [formData, setFormData] = useState<QuoteRequestData>({
    customerId: user?.id || '',
    artisanId,
    projectTitle: '',
    projectDescription: '',
    projectType: '',
    otherCategory: '',
    budget: {
      min: 0,
      max: 0,
      currency: 'KES'
    },
    timeline: '',
    location: '',
    urgency: 'medium',
    attachments: [],
    additionalRequirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        customerId: user.id
      }));
    }
  }, [isOpen, user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBudgetChange = (field: 'min' | 'max', value: number) => {
    setFormData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    if (!formData.projectTitle.trim()) {
      setError('Project title is required');
      return false;
    }
    if (!formData.projectDescription.trim()) {
      setError('Project description is required');
      return false;
    }
    if (!formData.projectType.trim()) {
      setError('Project type is required');
      return false;
    }
    if (formData.projectType === 'other' && !formData.otherCategory.trim()) {
      setError('Please specify the project type');
      return false;
    }
    if (formData.budget.min <= 0 || formData.budget.max <= 0) {
      setError('Please set a valid budget range');
      return false;
    }
    if (formData.budget.min > formData.budget.max) {
      setError('Minimum budget cannot be greater than maximum budget');
      return false;
    }
    if (!formData.timeline.trim()) {
      setError('Timeline is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
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

      // Use otherCategory as projectType if "Other" is selected
      const requestData = {
        ...formData,
        projectType: formData.projectType === 'other' ? formData.otherCategory : formData.projectType
      };

      const response = await fetch('/api/quotes/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Quote request sent successfully! The artisan will respond within 24-48 hours.');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to send quote request');
      }
    } catch (error: any) {
      console.error('Error sending quote request:', error);
      setError('Failed to send quote request. Please try again.');
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
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Request Quote</h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                From {artisanName} • {artisanSpecialty}
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

        {/* Quote Request Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Project Title */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Project Title *
            </label>
            <input
              type="text"
              value={formData.projectTitle}
              onChange={(e) => handleInputChange('projectTitle', e.target.value)}
              placeholder="e.g., Kitchen Renovation, Custom Furniture"
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                darkMode
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Project Type */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Project Type *
            </label>
            <select
              value={formData.projectType}
              onChange={(e) => handleInputChange('projectType', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                darkMode
                  ? 'bg-slate-800 border-slate-600 text-white focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
              }`}
            >
              <option value="">Select project type</option>
              <option value="construction">Construction</option>
              <option value="renovation">Renovation</option>
              <option value="furniture">Furniture Making</option>
              <option value="electrical">Electrical Work</option>
              <option value="plumbing">Plumbing</option>
              <option value="painting">Painting</option>
              <option value="landscaping">Landscaping</option>
              <option value="carpentry">Carpentry</option>
              <option value="masonry">Masonry</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Other Category Input */}
          {formData.projectType === 'other' && (
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-cream' : 'text-slate-700'
              }`}>
                Please Specify *
              </label>
              <input
                type="text"
                value={formData.otherCategory}
                onChange={(e) => handleInputChange('otherCategory', e.target.value)}
                placeholder="Enter your project type"
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  darkMode
                    ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                }`}
              />
            </div>
          )}

          {/* Project Description */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Project Description *
            </label>
            <textarea
              value={formData.projectDescription}
              onChange={(e) => handleInputChange('projectDescription', e.target.value)}
              placeholder="Describe your project in detail. Include specifications, materials, dimensions, etc."
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                darkMode
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Budget Range */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Budget Range (KES) *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs mb-1 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Minimum
                </label>
                <div className="relative">
                  <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <input
                    type="number"
                    value={formData.budget.min}
                    onChange={(e) => handleBudgetChange('min', Number(e.target.value))}
                    placeholder="0"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                      darkMode
                        ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-xs mb-1 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Maximum
                </label>
                <div className="relative">
                  <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <input
                    type="number"
                    value={formData.budget.max}
                    onChange={(e) => handleBudgetChange('max', Number(e.target.value))}
                    placeholder="0"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                      darkMode
                        ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-cream' : 'text-slate-700'
              }`}>
                Timeline *
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
                      ? 'bg-slate-800 border-slate-600 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                  }`}
                >
                  <option value="">Select timeline</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="2-3 months">2-3 months</option>
                  <option value="3+ months">3+ months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-cream' : 'text-slate-700'
              }`}>
                Location *
              </label>
              <div className="relative">
                <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Nairobi, Westlands"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    darkMode
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Project Urgency
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'low', label: 'Low', color: 'green' },
                { value: 'medium', label: 'Medium', color: 'yellow' },
                { value: 'high', label: 'High', color: 'red' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    formData.urgency === option.value
                      ? darkMode
                        ? `border-${option.color}-500 bg-${option.color}-500/10`
                        : `border-${option.color}-500 bg-${option.color}-50`
                      : darkMode
                        ? 'border-slate-600 hover:border-slate-500'
                        : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={option.value}
                    checked={formData.urgency === option.value}
                    onChange={() => handleInputChange('urgency', option.value)}
                    className={`text-${option.color}-500`}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Requirements */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Additional Requirements
            </label>
            <textarea
              value={formData.additionalRequirements}
              onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
              placeholder="Any additional requirements, preferences, or special considerations..."
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                darkMode
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Sending Request...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Quote Request
              </>
            )}
          </button>

          {/* Terms */}
          <p className={`text-xs text-center ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            By sending this request, you agree to our terms of service. The artisan will respond within 24-48 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
