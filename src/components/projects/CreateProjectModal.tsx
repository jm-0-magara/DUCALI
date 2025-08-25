"use client";

import React, { useState } from 'react';
import { X, Upload, DollarSign, Calendar, MapPin, Tag, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { orderService, CreateProjectData } from '../../lib/orderService';
import { useCurrency } from '../../contexts/CurrencyContext';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (projectId: string) => void;
  darkMode?: boolean;
}

const CATEGORIES = [
  'Fashion & Apparel',
  'Home & Garden',
  'Food & Catering',
  'Digital Services',
  'Art & Crafts',
  'Beauty & Wellness',
  'Events & Entertainment',
  'Other'
];

const TIMELINES = [
  '1-2 weeks',
  '1 month',
  '2-3 months',
  '3-6 months',
  '6+ months'
];

export default function CreateProjectModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  darkMode = true 
}: CreateProjectModalProps) {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    otherCategory: '',
    budgetMin: '',
    budgetMax: '',
    timeline: '',
    location: '',
    tags: [] as string[],
    attachments: [] as File[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag.trim()] }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.title.trim()) errors.title = 'Project title is required';
    if (!formData.description.trim()) errors.description = 'Project description is required';
    if (!formData.category) errors.category = 'Please select a project type';
    if (formData.category === 'Other' && !formData.otherCategory.trim()) {
      errors.otherCategory = 'Please specify the project type';
    }
    if (!formData.budgetMin || !formData.budgetMax) errors.budget = 'Budget range is required';
    if (parseFloat(formData.budgetMin) > parseFloat(formData.budgetMax)) {
      errors.budget = 'Minimum budget cannot be higher than maximum budget';
    }
    if (!formData.timeline) errors.timeline = 'Please select a timeline';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;
    if (!user) {
      setError('You must be logged in to create a project');
      return;
    }

    setIsSubmitting(true);

    try {
      const projectData: CreateProjectData = {
        customerId: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category === 'Other' ? formData.otherCategory.trim() : formData.category,
        budget: {
          min: parseFloat(formData.budgetMin),
          max: parseFloat(formData.budgetMax),
          currency: 'KSH'
        },
        timeline: formData.timeline,
        location: formData.location.trim() || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        attachments: [] // TODO: Implement file upload
      };

      const project = await orderService.createProject(projectData);
      
      setSuccess('Project created successfully!');
      setTimeout(() => {
        onSuccess?.(project.id);
        onClose();
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          otherCategory: '',
          budgetMin: '',
          budgetMax: '',
          timeline: '',
          location: '',
          tags: [],
          attachments: []
        });
        setSuccess('');
      }, 2000);

    } catch (error: any) {
      console.error('Error creating project:', error);
      setError(error.message || 'Failed to create project. Please try again.');
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
          <div>
            <h2 className="text-2xl font-bold">Create New Project</h2>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
              Post your project and connect with skilled artisans
            </p>
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

        {/* Form */}
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
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
              } ${validationErrors.title ? 'border-red-500' : ''}`}
              placeholder="e.g., Custom Wedding Dress Design"
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Project Type *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-slate-800 border-slate-600 text-white focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
              } ${validationErrors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Select project type</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {validationErrors.category && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
            )}
            
            {/* Other Category Specification */}
            {formData.category === 'Other' && (
              <div className="mt-3">
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-cream' : 'text-slate-700'
                }`}>
                  Please Specify *
                </label>
                <input
                  type="text"
                  value={formData.otherCategory}
                  onChange={(e) => handleInputChange('otherCategory', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                  } ${validationErrors.otherCategory ? 'border-red-500' : ''}`}
                  placeholder="Please specify your project type..."
                />
                {validationErrors.otherCategory && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.otherCategory}</p>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Project Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                darkMode 
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
              } ${validationErrors.description ? 'border-red-500' : ''}`}
              placeholder="Describe your project in detail. Include specific requirements, preferences, and any reference images or ideas..."
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
            )}
          </div>

          {/* Budget Range */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Budget Range (KSH) *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={formData.budgetMin}
                  onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                  placeholder="Minimum"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                  } ${validationErrors.budget ? 'border-red-500' : ''}`}
                />
              </div>
              <div>
                <input
                  type="number"
                  value={formData.budgetMax}
                  onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                  placeholder="Maximum"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                  } ${validationErrors.budget ? 'border-red-500' : ''}`}
                />
              </div>
            </div>
            {validationErrors.budget && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.budget}</p>
            )}
          </div>

          {/* Timeline */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Timeline *
            </label>
            <select
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-slate-800 border-slate-600 text-white focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
              } ${validationErrors.timeline ? 'border-red-500' : ''}`}
            >
              <option value="">Select timeline</option>
              {TIMELINES.map(timeline => (
                <option key={timeline} value={timeline}>{timeline}</option>
              ))}
            </select>
            {validationErrors.timeline && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.timeline}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Location (Optional)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
              }`}
              placeholder="e.g., Nairobi, Kenya"
            />
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Tags (Optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                    darkMode 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
              }`}
            />
          </div>

          {/* File Attachments */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-cream' : 'text-slate-700'
            }`}>
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                Upload reference images or documents
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  darkMode 
                    ? 'bg-slate-800 text-white hover:bg-slate-700' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Choose Files
              </label>
            </div>
            
            {/* File List */}
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      darkMode ? 'bg-slate-800' : 'bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-lg border transition-colors ${
                darkMode 
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-800' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
