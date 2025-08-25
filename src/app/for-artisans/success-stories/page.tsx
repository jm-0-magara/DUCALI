"use client";

import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../components/Footer';
import { Star, TrendingUp, Users, Award, Calendar, DollarSign, MapPin, Quote } from 'lucide-react';

interface SuccessStory {
  id: string;
  name: string;
  specialty: string;
  location: string;
  image: string;
  story: string;
  earnings: string;
  orders: number;
  rating: number;
  joinDate: string;
  featured: boolean;
  quote: string;
  achievements: string[];
}

const successStories: SuccessStory[] = [
  {
    id: '1',
    name: 'Sarah Mwangi',
    specialty: 'Fashion & Clothing',
    location: 'Nairobi, Kenya',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    story: 'Sarah started her journey as a small-scale tailor in Nairobi. Through Ducali, she expanded her business to serve customers nationwide, specializing in custom wedding dresses and traditional African wear. Her attention to detail and excellent customer service helped her build a loyal client base.',
    earnings: 'KES 450,000+',
    orders: 127,
    rating: 4.9,
    joinDate: 'March 2023',
    featured: true,
    quote: "Ducali transformed my small tailoring business into a thriving enterprise. I now have customers from all over Kenya and even international clients!",
    achievements: ['Top Rated Artisan 2024', '100+ Happy Customers', 'Featured in Local Media']
  },
  {
    id: '2',
    name: 'John Kamau',
    specialty: 'Woodworking & Furniture',
    location: 'Mombasa, Kenya',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    story: 'John is a master woodworker who creates custom furniture pieces. His journey began with simple repairs and has evolved into creating bespoke furniture for luxury homes and offices. His craftsmanship and reliability have made him one of the most sought-after artisans in his field.',
    earnings: 'KES 680,000+',
    orders: 89,
    rating: 5.0,
    joinDate: 'January 2023',
    featured: true,
    quote: "The platform helped me showcase my skills to a wider audience. I've been able to work on projects I never thought possible.",
    achievements: ['Master Craftsman Award', 'Featured in Design Magazine', 'Corporate Client Base']
  },
  {
    id: '3',
    name: 'Grace Wanjiku',
    specialty: 'Jewelry & Accessories',
    location: 'Kisumu, Kenya',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    story: 'Grace started making beaded jewelry as a hobby. Through Ducali, she turned her passion into a profitable business, creating unique pieces that celebrate Kenyan culture. Her designs have gained international recognition.',
    earnings: 'KES 320,000+',
    orders: 156,
    rating: 4.8,
    joinDate: 'June 2023',
    featured: false,
    quote: "Ducali gave me the confidence to turn my hobby into a business. I'm now exporting my jewelry to other countries!",
    achievements: ['Cultural Heritage Award', 'International Exports', 'Youth Empowerment Mentor']
  },
  {
    id: '4',
    name: 'David Ochieng',
    specialty: 'Digital Services',
    location: 'Nakuru, Kenya',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    story: 'David is a self-taught web developer who found success through Ducali. He started with simple website designs and has grown to offer comprehensive digital solutions including e-commerce platforms and mobile apps.',
    earnings: 'KES 890,000+',
    orders: 67,
    rating: 4.9,
    joinDate: 'September 2023',
    featured: false,
    quote: "The platform connected me with clients who appreciated quality work. I've been able to build a sustainable digital services business.",
    achievements: ['Digital Innovation Award', 'Tech Mentor', 'Startup Collaborator']
  },
  {
    id: '5',
    name: 'Mary Njeri',
    specialty: 'Food & Catering',
    location: 'Eldoret, Kenya',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    story: 'Mary is a passionate chef who specializes in traditional Kenyan cuisine with modern twists. Through Ducali, she has catered for weddings, corporate events, and private parties, building a reputation for excellence.',
    earnings: 'KES 280,000+',
    orders: 203,
    rating: 4.7,
    joinDate: 'April 2023',
    featured: false,
    quote: "Ducali helped me showcase my culinary skills to a broader audience. I've catered events I never thought I could handle.",
    achievements: ['Culinary Excellence Award', 'Corporate Catering Specialist', 'Recipe Book Author']
  },
  {
    id: '6',
    name: 'Peter Kiprop',
    specialty: 'Art & Design',
    location: 'Thika, Kenya',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    story: 'Peter is a talented artist who creates stunning paintings and murals. His work ranges from traditional African art to contemporary pieces. Through Ducali, he has found clients for both personal and commercial projects.',
    earnings: 'KES 520,000+',
    orders: 45,
    rating: 5.0,
    joinDate: 'February 2023',
    featured: false,
    quote: "The platform has been instrumental in helping me reach art lovers and collectors. My work is now displayed in homes and offices across Kenya.",
    achievements: ['Artistic Excellence Award', 'Gallery Exhibitions', 'Art Workshop Instructor']
  }
];

export default function SuccessStories() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [selectedStory, setSelectedStory] = React.useState<SuccessStory | null>(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const openStoryModal = (story: SuccessStory) => {
    setSelectedStory(story);
  };

  const closeStoryModal = () => {
    setSelectedStory(null);
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
            <Award className="w-16 h-16 text-[#B08D57] mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Success Stories
            </h1>
            <p className="text-xl text-[#FDF6F0]/80 max-w-3xl mx-auto leading-relaxed">
              Discover how talented artisans across Kenya have transformed their skills into thriving businesses through Ducali. 
              These real stories showcase the power of connecting skilled craftspeople with customers who value quality and authenticity.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <TrendingUp className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">KES 2.5M+</div>
              <div className="text-[#FDF6F0]/70">Total Earnings</div>
            </div>
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <Users className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">500+</div>
              <div className="text-[#FDF6F0]/70">Happy Customers</div>
            </div>
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <Star className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">4.8</div>
              <div className="text-[#FDF6F0]/70">Average Rating</div>
            </div>
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <Calendar className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">12+</div>
              <div className="text-[#FDF6F0]/70">Months Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div 
                key={story.id}
                className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20 hover:border-[#B08D57]/40 transition-all duration-300 cursor-pointer group"
                onClick={() => openStoryModal(story)}
              >
                {/* Featured Badge */}
                {story.featured && (
                  <div className="absolute -top-2 -right-2 bg-[#B08D57] text-[#1C1C1C] px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                )}

                {/* Artisan Info */}
                <div className="flex items-center mb-4">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-white font-semibold text-lg">{story.name}</h3>
                    <p className="text-[#FDF6F0]/70 text-sm">{story.specialty}</p>
                    <div className="flex items-center text-[#FDF6F0]/60 text-sm">
                      <MapPin className="w-3 h-3 mr-1" />
                      {story.location}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="mb-4">
                  <Quote className="w-5 h-5 text-[#B08D57] mb-2" />
                  <p className="text-[#FDF6F0]/80 text-sm italic">
                    "{story.quote}"
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#B08D57]">{story.earnings}</div>
                    <div className="text-[#FDF6F0]/60 text-xs">Total Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#B08D57]">{story.orders}</div>
                    <div className="text-[#FDF6F0]/60 text-xs">Orders</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-[#B08D57] fill-current" />
                    <span className="text-white ml-1">{story.rating}</span>
                  </div>
                  <span className="text-[#FDF6F0]/60 text-sm">Joined {story.joinDate}</span>
                </div>

                {/* Achievements */}
                <div className="space-y-2">
                  {story.achievements.slice(0, 2).map((achievement, index) => (
                    <div key={index} className="flex items-center text-[#FDF6F0]/70 text-sm">
                      <Award className="w-3 h-3 text-[#B08D57] mr-2" />
                      {achievement}
                    </div>
                  ))}
                </div>

                {/* Read More Button */}
                <button className="w-full mt-4 py-2 bg-[#B08D57] text-[#1C1C1C] font-medium rounded-lg hover:bg-[#A4B465] transition-colors">
                  Read Full Story
                </button>
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
              Ready to Start Your Success Story?
            </h2>
            <p className="text-[#FDF6F0]/80 mb-6 text-lg">
              Join thousands of artisans who have transformed their skills into thriving businesses. 
              Start your journey today and connect with customers who value your craftsmanship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-[#B08D57] text-[#1C1C1C] font-semibold rounded-lg hover:bg-[#A4B465] transition-colors">
                Join as Artisan
              </button>
              <button className="px-8 py-3 border border-[#B08D57] text-[#FDF6F0] font-semibold rounded-lg hover:bg-[#B08D57]/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C1C1C] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <img 
                    src={selectedStory.image} 
                    alt={selectedStory.name}
                    className="w-20 h-20 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedStory.name}</h2>
                    <p className="text-[#FDF6F0]/70">{selectedStory.specialty}</p>
                    <div className="flex items-center text-[#FDF6F0]/60 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedStory.location}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={closeStoryModal}
                  className="text-[#FDF6F0]/60 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Their Story</h3>
                  <p className="text-[#FDF6F0]/80 leading-relaxed">{selectedStory.story}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Key Quote</h3>
                  <div className="bg-[#2A2A2A] rounded-lg p-4">
                    <Quote className="w-6 h-6 text-[#B08D57] mb-2" />
                    <p className="text-[#FDF6F0]/90 italic text-lg">"{selectedStory.quote}"</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center bg-[#2A2A2A] rounded-lg p-4">
                    <DollarSign className="w-6 h-6 text-[#B08D57] mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{selectedStory.earnings}</div>
                    <div className="text-[#FDF6F0]/60 text-sm">Total Earnings</div>
                  </div>
                  <div className="text-center bg-[#2A2A2A] rounded-lg p-4">
                    <Users className="w-6 h-6 text-[#B08D57] mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{selectedStory.orders}</div>
                    <div className="text-[#FDF6F0]/60 text-sm">Orders</div>
                  </div>
                  <div className="text-center bg-[#2A2A2A] rounded-lg p-4">
                    <Star className="w-6 h-6 text-[#B08D57] mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{selectedStory.rating}</div>
                    <div className="text-[#FDF6F0]/60 text-sm">Rating</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Achievements</h3>
                  <div className="space-y-2">
                    {selectedStory.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center text-[#FDF6F0]/80">
                        <Award className="w-4 h-4 text-[#B08D57] mr-3" />
                        {achievement}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
