"use client";

import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Shield, Award, MessageCircle, Phone, Mail } from 'lucide-react';
import { type Artisan } from '../../../../lib/artisanService';
import StarRating from '../../../../components/StarRating';
import { TouchOptimizedButton } from '../../../../components/TouchOptimizedButton';
import { ProfileImage } from '../../../../components/OptimizedImage';
import { useTheme } from '../../../../contexts/ThemeContext';

interface MobileArtisanHeroProps {
  artisan: Artisan;
}

export default function MobileArtisanHero({ artisan }: MobileArtisanHeroProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-4 sm:p-6 border`}>
      {/* Mobile Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded-full overflow-hidden flex-shrink-0`}>
            {artisan.profileImage ? (
              <ProfileImage 
                src={artisan.profileImage} 
                alt={artisan.name}
                size={80}
                className="w-full h-full"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${isDark ? 'text-white' : 'text-slate-700'} text-2xl font-bold`}>
                {artisan.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-1 truncate`}>
              {artisan.name}
            </h1>
            <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-sm sm:text-base mb-2 truncate`}>
              {artisan.specialty}
            </p>
            
            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={artisan.averageRating || 0} size="sm" />
              <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm`}>
                ({artisan.totalReviews || 0} reviews)
              </span>
            </div>
            
            {/* Verification Badge */}
            {artisan.verified && (
              <div className="flex items-center gap-1 text-[#A4B465] text-sm">
                <Shield className="w-4 h-4" />
                <span>Verified Artisan</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg p-3 text-center`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-1`}>
            {artisan.totalOrders || 0}
          </div>
          <div className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-xs`}>Orders</div>
        </div>
        
        <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg p-3 text-center`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-1`}>
            {artisan.averageRating || 0}
          </div>
          <div className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-xs`}>Rating</div>
        </div>
        
        <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg p-3 text-center`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-1`}>
            {artisan.experience || 'Pro'}
          </div>
          <div className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-xs`}>Experience</div>
        </div>
        
        <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg p-3 text-center`}>
          <div className="text-2xl font-bold text-[#A4B465] mb-1">
            {artisan.priceRange || 'Contact'}
          </div>
          <div className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-xs`}>Starting Price</div>
        </div>
      </div>

      {/* Location and Response Time */}
      <div className={`flex items-center justify-between mb-6 p-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg`}>
        <div className="flex items-center gap-2">
          <MapPin className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={`${isDark ? 'text-white' : 'text-slate-900'} text-sm`}>{artisan.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={`${isDark ? 'text-white' : 'text-slate-900'} text-sm`}>{artisan.responseTime || 'Within 24 hours'}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold mb-2`}>About</h3>
        <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-sm leading-relaxed`}>
          {artisan.description || 'No description available.'}
        </p>
      </div>

      {/* Skills */}
      {artisan.skills && artisan.skills.length > 0 && (
        <div className="mb-6">
          <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold mb-2`}>Skills</h3>
          <div className="flex flex-wrap gap-2">
            {artisan.skills.map((skill, index) => (
              <span
                key={index}
                className={`px-3 py-1 ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'} text-sm rounded-full`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <TouchOptimizedButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => {
            // Handle contact action
            console.log(`Contact ${artisan.name}`);
          }}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Request Quote
        </TouchOptimizedButton>
        
        <TouchOptimizedButton
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => {
            // Handle call action
            console.log(`Call ${artisan.name}`);
          }}
        >
          <Phone className="w-5 h-5 mr-2" />
          Call Now
        </TouchOptimizedButton>
      </div>

      {/* Quick Contact Info */}
      <div className={`mt-4 p-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg`}>
        <div className="flex items-center justify-between text-sm">
          <div className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <Mail className="w-4 h-4" />
            <span>Email available</span>
          </div>
          <div className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <Phone className="w-4 h-4" />
            <span>Phone available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
