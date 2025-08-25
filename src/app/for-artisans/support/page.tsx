"use client";

import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../components/Footer';
import { MessageCircle, Phone, Mail, Clock, HelpCircle, FileText, Users, Zap, CheckCircle, ExternalLink, Send, Search, BookOpen, Video, MessageSquare } from 'lucide-react';

interface SupportCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: SupportArticle[];
}

interface SupportArticle {
  id: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
}

interface ContactMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  contact: string;
  availability: string;
  responseTime: string;
}

const supportCategories: SupportCategory[] = [
  {
    id: '1',
    title: 'Getting Started',
    description: 'Learn how to set up your profile and start receiving orders',
    icon: <BookOpen className="w-6 h-6" />,
    articles: [
      {
        id: '1',
        title: 'How to Create Your Artisan Profile',
        description: 'Step-by-step guide to setting up your professional profile',
        readTime: '5 min read',
        category: 'Getting Started'
      },
      {
        id: '2',
        title: 'Uploading Your Portfolio',
        description: 'Best practices for showcasing your work effectively',
        readTime: '8 min read',
        category: 'Getting Started'
      },
      {
        id: '3',
        title: 'Setting Your Pricing',
        description: 'How to price your services competitively',
        readTime: '6 min read',
        category: 'Getting Started'
      }
    ]
  },
  {
    id: '2',
    title: 'Orders & Payments',
    description: 'Everything you need to know about managing orders and getting paid',
    icon: <Zap className="w-6 h-6" />,
    articles: [
      {
        id: '4',
        title: 'Managing Incoming Orders',
        description: 'How to accept, decline, and manage order requests',
        readTime: '7 min read',
        category: 'Orders & Payments'
      },
      {
        id: '5',
        title: 'Payment Processing & Withdrawals',
        description: 'Understanding payment timelines and withdrawal options',
        readTime: '10 min read',
        category: 'Orders & Payments'
      },
      {
        id: '6',
        title: 'Commission Rates Explained',
        description: 'How our commission structure works and how to qualify for lower rates',
        readTime: '12 min read',
        category: 'Orders & Payments'
      }
    ]
  },
  {
    id: '3',
    title: 'Customer Communication',
    description: 'Best practices for communicating with customers',
    icon: <MessageSquare className="w-6 h-6" />,
    articles: [
      {
        id: '7',
        title: 'Professional Communication Tips',
        description: 'How to communicate effectively with customers',
        readTime: '6 min read',
        category: 'Customer Communication'
      },
      {
        id: '8',
        title: 'Handling Customer Inquiries',
        description: 'Responding to questions and concerns professionally',
        readTime: '8 min read',
        category: 'Customer Communication'
      },
      {
        id: '9',
        title: 'Managing Customer Expectations',
        description: 'Setting clear expectations and avoiding misunderstandings',
        readTime: '7 min read',
        category: 'Customer Communication'
      }
    ]
  },
  {
    id: '4',
    title: 'Quality & Reviews',
    description: 'Maintaining quality standards and managing reviews',
    icon: <CheckCircle className="w-6 h-6" />,
    articles: [
      {
        id: '10',
        title: 'Quality Control Guidelines',
        description: 'Standards and best practices for delivering quality work',
        readTime: '9 min read',
        category: 'Quality & Reviews'
      },
      {
        id: '11',
        title: 'Managing Customer Reviews',
        description: 'How to handle reviews and maintain your rating',
        readTime: '8 min read',
        category: 'Quality & Reviews'
      },
      {
        id: '12',
        title: 'Dealing with Disputes',
        description: 'Resolving issues with customers professionally',
        readTime: '10 min read',
        category: 'Quality & Reviews'
      }
    ]
  }
];

const contactMethods: ContactMethod[] = [
  {
    id: '1',
    name: 'Live Chat Support',
    description: 'Get instant help from our support team',
    icon: <MessageCircle className="w-6 h-6" />,
    contact: 'Start Chat',
    availability: '24/7',
    responseTime: 'Instant'
  },
  {
    id: '2',
    name: 'Phone Support',
    description: 'Speak directly with our support specialists',
    icon: <Phone className="w-6 h-6" />,
    contact: '+254 700 123 456',
    availability: 'Mon-Fri, 8AM-6PM EAT',
    responseTime: 'Immediate'
  },
  {
    id: '3',
    name: 'Email Support',
    description: 'Send us a detailed message and get a comprehensive response',
    icon: <Mail className="w-6 h-6" />,
    contact: 'artisans@ducali.com',
    availability: '24/7',
    responseTime: 'Within 4 hours'
  }
];

export default function ArtisanSupport() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [showChat, setShowChat] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredArticles = supportCategories.flatMap(category => 
    category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const allArticles = supportCategories.flatMap(category => category.articles);

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
            <HelpCircle className="w-16 h-16 text-[#B08D57] mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Artisan Support
            </h1>
            <p className="text-xl text-[#FDF6F0]/80 max-w-3xl mx-auto leading-relaxed">
              We're here to help you succeed. Get the support you need to grow your business, 
              resolve issues quickly, and maximize your earnings on Ducali.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#FDF6F0]/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles, guides, and solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#1C1C1C]/50 backdrop-blur-sm border border-[#B08D57]/20 rounded-xl text-[#FDF6F0] placeholder-[#FDF6F0]/60 focus:outline-none focus:border-[#B08D57]"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <Clock className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-[#FDF6F0]/70">Support Available</div>
            </div>
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <MessageCircle className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">&lt;4h</div>
              <div className="text-[#FDF6F0]/70">Response Time</div>
            </div>
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <FileText className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">100+</div>
              <div className="text-[#FDF6F0]/70">Help Articles</div>
            </div>
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <Users className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">98%</div>
              <div className="text-[#FDF6F0]/70">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-[#FDF6F0]/80 text-lg">
              Multiple ways to reach our support team. We're here to help you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method) => (
              <div 
                key={method.id}
                className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20 hover:border-[#B08D57]/40 transition-all duration-300"
              >
                <div className="text-[#B08D57] mb-4">
                  {method.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{method.name}</h3>
                <p className="text-[#FDF6F0]/70 text-sm mb-4">{method.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#FDF6F0]/60 text-sm">Contact</span>
                    <span className="text-white text-sm font-medium">{method.contact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#FDF6F0]/60 text-sm">Available</span>
                    <span className="text-white text-sm">{method.availability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#FDF6F0]/60 text-sm">Response</span>
                    <span className="text-white text-sm">{method.responseTime}</span>
                  </div>
                </div>

                <button 
                  className="w-full mt-4 py-2 bg-[#B08D57] text-[#1C1C1C] font-medium rounded-lg hover:bg-[#A4B465] transition-colors"
                  onClick={() => method.id === '1' && setShowChat(true)}
                >
                  {method.id === '1' ? 'Start Chat' : 'Contact Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Help Center</h2>
            <p className="text-[#FDF6F0]/80 text-lg">
              Find answers to common questions and learn how to make the most of Ducali.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {supportCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`p-6 rounded-xl border transition-all duration-300 text-left ${
                  selectedCategory === category.id
                    ? 'bg-[#B08D57] text-[#1C1C1C] border-[#B08D57]'
                    : 'bg-[#1C1C1C]/50 backdrop-blur-sm text-[#FDF6F0] border-[#B08D57]/20 hover:border-[#B08D57]/40'
                }`}
              >
                <div className={`mb-4 ${selectedCategory === category.id ? 'text-[#1C1C1C]' : 'text-[#B08D57]'}`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                <p className="text-sm opacity-80">{category.description}</p>
              </button>
            ))}
          </div>

          {/* Articles */}
          {selectedCategory && (
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <h3 className="text-white font-semibold text-xl mb-6">
                {supportCategories.find(cat => cat.id === selectedCategory)?.title} Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supportCategories
                  .find(cat => cat.id === selectedCategory)
                  ?.articles.map((article) => (
                    <div 
                      key={article.id}
                      className="bg-[#2A2A2A] rounded-lg p-4 hover:bg-[#2A2A2A]/80 transition-colors cursor-pointer"
                    >
                      <h4 className="text-white font-medium mb-2">{article.title}</h4>
                      <p className="text-[#FDF6F0]/70 text-sm mb-3">{article.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#FDF6F0]/60 text-xs">{article.readTime}</span>
                        <button className="text-[#B08D57] hover:text-[#A4B465] transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search Results */}
      {searchQuery && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Search Results</h2>
              <p className="text-[#FDF6F0]/80 text-lg">
                Found {filteredArticles.length} articles matching "{searchQuery}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <div 
                  key={article.id}
                  className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20 hover:border-[#B08D57]/40 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">{article.title}</h3>
                    <span className="text-[#FDF6F0]/60 text-xs">{article.readTime}</span>
                  </div>
                  <p className="text-[#FDF6F0]/70 text-sm mb-4">{article.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#B08D57] text-sm font-medium">{article.category}</span>
                    <button className="text-[#B08D57] hover:text-[#A4B465] transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Articles */}
      {!searchQuery && !selectedCategory && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Popular Articles</h2>
              <p className="text-[#FDF6F0]/80 text-lg">
                Most frequently accessed help articles by our artisan community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allArticles.slice(0, 6).map((article) => (
                <div 
                  key={article.id}
                  className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20 hover:border-[#B08D57]/40 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">{article.title}</h3>
                    <span className="text-[#FDF6F0]/60 text-xs">{article.readTime}</span>
                  </div>
                  <p className="text-[#FDF6F0]/70 text-sm mb-4">{article.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#B08D57] text-sm font-medium">{article.category}</span>
                    <button className="text-[#B08D57] hover:text-[#A4B465] transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C1C1C] rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-[#B08D57]/20">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold text-lg">Live Chat Support</h3>
                <button 
                  onClick={() => setShowChat(false)}
                  className="text-[#FDF6F0]/60 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-[#2A2A2A] rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-[#FDF6F0] text-sm">Support Agent</span>
                </div>
                <p className="text-[#FDF6F0]/80 text-sm">
                  Hello! Welcome to Ducali Artisan Support. How can I help you today?
                </p>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-[#2A2A2A] text-[#FDF6F0] rounded-lg border border-[#B08D57]/20 focus:outline-none focus:border-[#B08D57]"
                />
                <button className="px-4 py-2 bg-[#B08D57] text-[#1C1C1C] rounded-lg hover:bg-[#A4B465] transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#B08D57]/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-[#FDF6F0]/80 mb-6 text-lg">
              Can't find what you're looking for? Our support team is ready to help you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-3 bg-[#B08D57] text-[#1C1C1C] font-semibold rounded-lg hover:bg-[#A4B465] transition-colors"
                onClick={() => setShowChat(true)}
              >
                Start Live Chat
              </button>
              <button className="px-8 py-3 border border-[#B08D57] text-[#FDF6F0] font-semibold rounded-lg hover:bg-[#B08D57]/10 transition-colors">
                Send Email
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
