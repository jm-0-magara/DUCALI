"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, DollarSign, Calendar, Tag, Eye, MessageCircle, Star } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../components/Footer';
import { orderService, Project } from '../../lib/orderService';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';

export default function ProjectsPage() {
  const { user, isAuthenticated, isArtisan } = useAuth();
  const { formatCurrency } = useCurrency();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 1000000 });
  const [showFilters, setShowFilters] = useState(false);

  const CATEGORIES = [
    'All Categories',
    'Fashion & Apparel',
    'Home & Garden',
    'Food & Catering',
    'Digital Services',
    'Art & Crafts',
    'Beauty & Wellness',
    'Events & Entertainment',
    'Other'
  ];

  const LOCATIONS = [
    'All Locations',
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Thika',
    'Other'
  ];

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const availableProjects = await orderService.getAvailableProjects();
      setProjects(availableProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' || project.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All Locations' || 
      (project.location && project.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    const matchesBudget = project.budget.min >= budgetRange.min && project.budget.max <= budgetRange.max;

    return matchesSearch && matchesCategory && matchesLocation && matchesBudget;
  });

  const handleApplyToProject = async (projectId: string) => {
    if (!isAuthenticated) {
      // TODO: Show login modal
      alert('Please log in to apply to projects');
      return;
    }

    if (!isArtisan) {
      alert('Only artisans can apply to projects');
      return;
    }

    // TODO: Implement project application logic
    console.log('Applying to project:', projectId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  if (!isAuthenticated || !isArtisan) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Restricted
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This page is only available for registered artisans.
            </p>
            <a
              href="/browse"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Artisans Instead
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Available <span className="text-blue-600">Projects</span>
              </h1>
              <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                Find projects that match your skills and start earning
              </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg flex items-center gap-2"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>

              {/* Filters */}
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700 mb-8`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {LOCATIONS.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Budget Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={budgetRange.min}
                        onChange={(e) => setBudgetRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={budgetRange.max}
                        onChange={(e) => setBudgetRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000000 }))}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All Categories');
                        setSelectedLocation('All Locations');
                        setBudgetRange({ min: 0, max: 1000000 });
                      }}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Results Summary */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {loading ? 'Loading projects...' : `${filteredProjects.length} projects found`}
              </h2>
              {error && (
                <p className="text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
                  >
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {project.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </div>

                    {/* Project Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Project Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {formatCurrency(project.budget.min)} - {formatCurrency(project.budget.max)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{project.timeline}</span>
                      </div>
                      {project.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{project.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplyToProject(project.id)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Apply Now
                      </button>
                      <button
                        onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                        className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No projects found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search criteria or check back later for new projects.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
