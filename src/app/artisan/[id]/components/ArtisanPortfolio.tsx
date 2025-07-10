import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ArtisanProfile } from '../data/artisanData';

interface ArtisanPortfolioProps {
  artisan: ArtisanProfile;
}

export default function ArtisanPortfolio({ artisan }: ArtisanPortfolioProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % artisan.portfolio.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? artisan.portfolio.length - 1 : selectedImage - 1);
    }
  };

  return (
    <>
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6">Portfolio</h3>
        
        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {artisan.portfolio.map((item, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onClick={() => openModal(index)}
            >
              <div className="relative overflow-hidden rounded-lg bg-slate-700 aspect-square">
                {/* Placeholder for actual images */}
                <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-slate-600 to-slate-700 group-hover:from-slate-500 group-hover:to-slate-600 transition-all">
                  {item.placeholder}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
                      <span className="text-white text-sm font-medium">View Details</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-white font-medium">{item.title}</h4>
                <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[#A4B465] font-medium">{item.price}</span>
                  <span className="text-slate-500 text-xs">{item.timeframe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Services Offered */}
        <div className="border-t border-slate-700 pt-6">
          <h4 className="text-xl font-bold text-white mb-4">Services Offered</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artisan.services.map((service, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4">
                <h5 className="text-white font-medium mb-2">{service.name}</h5>
                <p className="text-slate-400 text-sm mb-3">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#A4B465] font-semibold">{service.price}</span>
                  <span className="text-slate-500 text-sm">{service.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="aspect-video bg-slate-700 flex items-center justify-center text-8xl">
                {artisan.portfolio[selectedImage].placeholder}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {artisan.portfolio[selectedImage].title}
                </h3>
                <p className="text-slate-300 mb-4">
                  {artisan.portfolio[selectedImage].description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[#A4B465] font-semibold text-lg">
                    {artisan.portfolio[selectedImage].price}
                  </span>
                  <span className="text-slate-400">
                    Completed in {artisan.portfolio[selectedImage].timeframe}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}