import React from 'react';
import { Star, MapPin, Clock, Shield, Award, MessageCircle } from 'lucide-react';
import { type Artisan } from '../../../../lib/artisanService';
import StarRating from '../../../../components/StarRating';
import FavoriteButton from '../../../../components/FavoriteButton';
import { useTheme } from '../../../../contexts/ThemeContext';

interface ArtisanHeroProps {
  artisan: Artisan;
}

export default function ArtisanHero({ artisan }: ArtisanHeroProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-2xl p-8 border shadow-xl`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Image & Basic Info */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className={`w-32 h-32 mx-auto mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                  {artisan.profileImage ? (
                    <img 
                      src={artisan.profileImage} 
                      alt={artisan.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-4xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {artisan.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2 flex items-center justify-center gap-2`}>
                  {artisan.name}
                  {artisan.verified && (
                    <Shield className="w-6 h-6 text-[#A4B465]" fill="currentColor" />
                  )}
                  {artisan.featured && (
                    <Award className="w-6 h-6 text-[#F0BB78]" fill="currentColor" />
                  )}
                </h1>
                <p className="text-xl text-[#A4B465] mb-4">{artisan.specialty}</p>
                <div className={`flex items-center justify-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                  <MapPin className="w-5 h-5" />
                  <span>{artisan.location}</span>
                </div>
                
                {/* Favorite Button */}
                <div className="flex justify-center mb-6">
                  <FavoriteButton 
                    artisan={artisan} 
                    size="lg" 
                    className="hover:scale-110 transition-transform"
                  />
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg p-4`}>
                    <div className="flex items-center justify-center mb-2">
                      <StarRating 
                        rating={artisan.averageRating || 0} 
                        size="sm" 
                        showValue 
                        className="justify-center"
                      />
                    </div>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                      {artisan.totalReviews || 0} reviews
                    </p>
                  </div>
                  <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg p-4`}>
                    <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold text-center mb-2`}>
                      {artisan.totalOrders || 0}+
                    </div>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm text-center`}>orders completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Skills */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>About {artisan.name}</h2>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed mb-6`}>{artisan.description}</p>
                
                {/* Skills */}
                {artisan.skills && artisan.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-3`}>Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {artisan.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#626F47] text-white rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience & Response Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-[#A4B465] mr-2" />
                      <span className="text-white font-medium">Response Time</span>
                    </div>
                    <p className="text-slate-300">
                      {artisan.responseTime || 'Within 24 hours'}
                    </p>
                  </div>
                  
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Award className="w-5 h-5 text-[#F0BB78] mr-2" />
                      <span className="text-white font-medium">Experience</span>
                    </div>
                    <p className="text-slate-300">
                      {artisan.experience || 'Professional'}
                    </p>
                  </div>
                  
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MessageCircle className="w-5 h-5 text-[#A4B465] mr-2" />
                      <span className="text-white font-medium">Starting Price</span>
                    </div>
                    <p className="text-[#A4B465] font-semibold">
                      {artisan.priceRange || 'Contact for quote'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}