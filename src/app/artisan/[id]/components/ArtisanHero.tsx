import React from 'react';
import { Star, MapPin, Clock, Shield, Award, MessageCircle } from 'lucide-react';
import { ArtisanProfile } from '../data/artisanData';

interface ArtisanHeroProps {
  artisan: ArtisanProfile;
}

export default function ArtisanHero({ artisan }: ArtisanHeroProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Image & Basic Info */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 text-8xl flex items-center justify-center bg-slate-700 rounded-full">
                  {artisan.image}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  {artisan.name}
                  {artisan.verified && (
                    <Shield className="w-6 h-6 text-[#A4B465]" fill="currentColor" />
                  )}
                  {artisan.featured && (
                    <Award className="w-6 h-6 text-[#F0BB78]" fill="currentColor" />
                  )}
                </h1>
                <p className="text-xl text-[#A4B465] mb-4">{artisan.specialty}</p>
                <div className="flex items-center justify-center gap-2 text-slate-400 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>{artisan.location}</span>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-5 h-5 text-[#F0BB78] fill-current" />
                      <span className="ml-1 text-white font-semibold">{artisan.rating}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{artisan.totalReviews} reviews</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-white font-semibold text-center mb-2">{artisan.orders}+</div>
                    <p className="text-slate-400 text-sm text-center">orders completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Skills */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">About {artisan.name}</h2>
                <p className="text-slate-300 leading-relaxed mb-6">{artisan.fullDescription}</p>
                
                {/* Skills */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Specialties</h3>
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

                {/* Experience & Response Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-[#A4B465] mr-2" />
                      <span className="text-white font-medium">Response Time</span>
                    </div>
                    <p className="text-slate-300">{artisan.responseTime}</p>
                  </div>
                  
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Award className="w-5 h-5 text-[#F0BB78] mr-2" />
                      <span className="text-white font-medium">Experience</span>
                    </div>
                    <p className="text-slate-300">{artisan.experience}</p>
                  </div>
                  
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MessageCircle className="w-5 h-5 text-[#A4B465] mr-2" />
                      <span className="text-white font-medium">Starting Price</span>
                    </div>
                    <p className="text-[#A4B465] font-semibold">{artisan.price}</p>
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