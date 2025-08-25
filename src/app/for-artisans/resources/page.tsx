"use client";

import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../components/Footer';
import { BookOpen, Video, FileText, Download, ExternalLink, Play, CheckCircle, Clock, Users, TrendingUp, Shield, DollarSign, Camera, Edit3, MessageCircle, Star } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'template' | 'tool';
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  icon: React.ReactNode;
  link: string;
  featured?: boolean;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Getting Started Guide',
    description: 'Complete step-by-step guide to set up your artisan profile, upload portfolio, and start receiving orders.',
    type: 'guide',
    duration: '15 min read',
    difficulty: 'beginner',
    category: 'Profile Setup',
    icon: <BookOpen className="w-6 h-6" />,
    link: '/resources/getting-started',
    featured: true
  },
  {
    id: '2',
    title: 'Professional Photography Tips',
    description: 'Learn how to take high-quality photos of your work that will attract more customers and increase sales.',
    type: 'video',
    duration: '12 min',
    difficulty: 'beginner',
    category: 'Portfolio',
    icon: <Camera className="w-6 h-6" />,
    link: '/resources/photography-tips'
  },
  {
    id: '3',
    title: 'Pricing Strategy Guide',
    description: 'Master the art of pricing your services competitively while ensuring profitability and customer satisfaction.',
    type: 'guide',
    duration: '20 min read',
    difficulty: 'intermediate',
    category: 'Business',
    icon: <DollarSign className="w-6 h-6" />,
    link: '/resources/pricing-strategy',
    featured: true
  },
  {
    id: '4',
    title: 'Customer Communication Templates',
    description: 'Professional email and message templates to help you communicate effectively with customers.',
    type: 'template',
    duration: '5 min read',
    difficulty: 'beginner',
    category: 'Communication',
    icon: <MessageCircle className="w-6 h-6" />,
    link: '/resources/communication-templates'
  },
  {
    id: '5',
    title: 'Portfolio Optimization Workshop',
    description: 'Advanced techniques to showcase your work professionally and stand out from the competition.',
    type: 'video',
    duration: '25 min',
    difficulty: 'intermediate',
    category: 'Portfolio',
    icon: <Edit3 className="w-6 h-6" />,
    link: '/resources/portfolio-optimization'
  },
  {
    id: '6',
    title: 'Business Growth Strategies',
    description: 'Proven strategies to scale your artisan business, increase orders, and build a loyal customer base.',
    type: 'guide',
    duration: '30 min read',
    difficulty: 'advanced',
    category: 'Business',
    icon: <TrendingUp className="w-6 h-6" />,
    link: '/resources/business-growth'
  },
  {
    id: '7',
    title: 'Quality Control Checklist',
    description: 'Comprehensive checklist to ensure your work meets the highest standards before delivery.',
    type: 'template',
    duration: '10 min read',
    difficulty: 'intermediate',
    category: 'Quality',
    icon: <CheckCircle className="w-6 h-6" />,
    link: '/resources/quality-checklist'
  },
  {
    id: '8',
    title: 'Customer Service Excellence',
    description: 'Learn how to provide exceptional customer service that leads to repeat business and positive reviews.',
    type: 'video',
    duration: '18 min',
    difficulty: 'intermediate',
    category: 'Customer Service',
    icon: <Star className="w-6 h-6" />,
    link: '/resources/customer-service'
  },
  {
    id: '9',
    title: 'Legal & Safety Guidelines',
    description: 'Important information about legal requirements, safety standards, and protecting your business.',
    type: 'guide',
    duration: '25 min read',
    difficulty: 'intermediate',
    category: 'Legal',
    icon: <Shield className="w-6 h-6" />,
    link: '/resources/legal-guidelines'
  },
  {
    id: '10',
    title: 'Time Management Tools',
    description: 'Tools and techniques to manage your time effectively and complete orders on schedule.',
    type: 'tool',
    duration: '15 min read',
    difficulty: 'beginner',
    category: 'Productivity',
    icon: <Clock className="w-6 h-6" />,
    link: '/resources/time-management'
  },
  {
    id: '11',
    title: 'Collaboration Opportunities',
    description: 'How to collaborate with other artisans, form partnerships, and expand your network.',
    type: 'guide',
    duration: '20 min read',
    difficulty: 'intermediate',
    category: 'Networking',
    icon: <Users className="w-6 h-6" />,
    link: '/resources/collaboration'
  },
  {
    id: '12',
    title: 'Marketing Your Services',
    description: 'Effective marketing strategies to promote your services and attract more customers.',
    type: 'video',
    duration: '22 min',
    difficulty: 'advanced',
    category: 'Marketing',
    icon: <TrendingUp className="w-6 h-6" />,
    link: '/resources/marketing-strategies'
  }
];

const categories = [
  'All Resources',
  'Profile Setup',
  'Portfolio',
  'Business',
  'Communication',
  'Quality',
  'Customer Service',
  'Legal',
  'Productivity',
  'Networking',
  'Marketing'
];

export default function ArtisanResources() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('All Resources');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('all');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredResources = resources.filter(resource => {
    const categoryMatch = selectedCategory === 'All Resources' || resource.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="w-4 h-4" />;
      case 'video': return <Play className="w-4 h-4" />;
      case 'template': return <FileText className="w-4 h-4" />;
      case 'tool': return <Download className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300`}
         style={{
           background: darkMode 
             ? 'linear-gradient(to bottom right, #1C1C1C, #1D2D50, #1C1C1C)'
             : 'linear-gradient(to bottom right, #1D2D50, #B08D57, #6E1414)'
         }}>
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <BookOpen className="w-16 h-16 text-[#B08D57] mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Artisan Resources
            </h1>
            <p className="text-xl text-[#FDF6F0]/80 max-w-3xl mx-auto leading-relaxed">
              Access comprehensive guides, tools, and educational content designed to help you succeed on Ducali. 
              From getting started to scaling your business, we've got everything you need to thrive.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <BookOpen className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">50+</div>
              <div className="text-[#FDF6F0]/70">Resources</div>
            </div>
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <Video className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">15+</div>
              <div className="text-[#FDF6F0]/70">Video Tutorials</div>
            </div>
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <FileText className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">25+</div>
              <div className="text-[#FDF6F0]/70">Templates</div>
            </div>
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <Users className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">1000+</div>
              <div className="text-[#FDF6F0]/70">Artisans Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#B08D57] text-[#1C1C1C]'
                      : 'bg-[#1C1C1C]/50 text-[#FDF6F0]/70 hover:text-[#FDF6F0] hover:bg-[#1C1C1C]/70'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 bg-[#1C1C1C]/50 text-[#FDF6F0] rounded-lg border border-[#B08D57]/20 focus:outline-none focus:border-[#B08D57]"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {resources.filter(r => r.featured).map((resource) => (
              <div 
                key={resource.id}
                className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20 hover:border-[#B08D57]/40 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-[#B08D57] group-hover:text-[#A4B465] transition-colors">
                    {resource.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(resource.type)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)} bg-opacity-20`}>
                      {resource.difficulty}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-white font-semibold text-lg mb-2">{resource.title}</h3>
                <p className="text-[#FDF6F0]/70 text-sm mb-4">{resource.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-[#FDF6F0]/60 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {resource.duration}
                  </div>
                  <button className="text-[#B08D57] hover:text-[#A4B465] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">All Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div 
                key={resource.id}
                className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20 hover:border-[#B08D57]/40 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-[#B08D57] group-hover:text-[#A4B465] transition-colors">
                    {resource.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(resource.type)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)} bg-opacity-20`}>
                      {resource.difficulty}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-white font-semibold text-lg mb-2">{resource.title}</h3>
                <p className="text-[#FDF6F0]/70 text-sm mb-4">{resource.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-[#FDF6F0]/60 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {resource.duration}
                  </div>
                  <button className="text-[#B08D57] hover:text-[#A4B465] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#B08D57]/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Personalized Help?
            </h2>
            <p className="text-[#FDF6F0]/80 mb-6 text-lg">
              Our artisan support team is here to help you succeed. Get personalized guidance, 
              answer your questions, and receive expert advice tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-[#B08D57] text-[#1C1C1C] font-semibold rounded-lg hover:bg-[#A4B465] transition-colors">
                Contact Support
              </button>
              <button className="px-8 py-3 border border-[#B08D57] text-[#FDF6F0] font-semibold rounded-lg hover:bg-[#B08D57]/10 transition-colors">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
