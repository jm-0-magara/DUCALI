import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, Video, Play } from 'lucide-react';
import { type Artisan } from '../../../../lib/artisanService';
import { useTheme } from '../../../../contexts/ThemeContext';

interface ArtisanPortfolioProps {
  artisan: Artisan;
}

export default function ArtisanPortfolio({ artisan }: ArtisanPortfolioProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null && artisan.portfolio) {
      setSelectedImage((selectedImage + 1) % artisan.portfolio.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null && artisan.portfolio) {
      setSelectedImage(selectedImage === 0 ? artisan.portfolio.length - 1 : selectedImage - 1);
    }
  };

  return (
    <>
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-6`}>Portfolio</h3>
        
        {/* Portfolio Grid */}
        {artisan.portfolio && artisan.portfolio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {artisan.portfolio.map((item, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => openModal(index)}
              >
                <div className={`relative overflow-hidden rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'} aspect-square`}>
                  {item.mediaType === 'video' && item.videos && item.videos.length > 0 ? (
                    // Video thumbnail with icon
                    <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="text-center">
                        <Video className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm">Video</p>
                      </div>
                      {/* Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black bg-opacity-50 rounded-full p-3">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  ) : item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : item.mediaUrl ? (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback icon if no image or image fails to load */}
                  <div className={`w-full h-full flex items-center justify-center text-6xl ${isDark ? 'bg-gradient-to-br from-slate-600 to-slate-700 group-hover:from-slate-500 group-hover:to-slate-600' : 'bg-gradient-to-br from-slate-200 to-slate-300 group-hover:from-slate-300 group-hover:to-slate-400'} transition-all ${(item.images && item.images.length > 0) || item.mediaUrl || (item.videos && item.videos.length > 0) ? 'hidden' : ''}`}>
                    <ImageIcon className={`w-16 h-16 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
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
                  <h4 className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium`}>{item.title}</h4>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mt-1`}>{item.description}</p>
                  {item.category && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#A4B465] font-medium">{item.category}</span>
                      {item.createdAt && (
                        <span className={`${isDark ? 'text-slate-500' : 'text-slate-400'} text-xs`}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h4 className="text-white font-medium mb-2">No portfolio items yet</h4>
            <p className="text-slate-400 text-sm">
              {artisan.name} hasn't added any portfolio items yet.
            </p>
          </div>
        )}

        {/* Services Offered */}
        {artisan.services && artisan.services.length > 0 && (
          <div className="border-t border-slate-700 pt-6">
            <h4 className="text-xl font-bold text-white mb-4">Services Offered</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {artisan.services.map((service, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2">{service.name}</h5>
                  <p className="text-slate-400 text-sm mb-3">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#A4B465] font-semibold">${service.price}</span>
                    <span className="text-slate-500 text-sm">{service.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage !== null && artisan.portfolio && artisan.portfolio[selectedImage] && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl overflow-hidden`}>
              <div className={`aspect-video ${isDark ? 'bg-slate-700' : 'bg-slate-100'} flex items-center justify-center`}>
                {artisan.portfolio[selectedImage].mediaType === 'video' && artisan.portfolio[selectedImage].videos && artisan.portfolio[selectedImage].videos.length > 0 ? (
                  <video
                    src={artisan.portfolio[selectedImage].videos[0]}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                  />
                ) : artisan.portfolio[selectedImage].images && artisan.portfolio[selectedImage].images.length > 0 ? (
                  <img
                    src={artisan.portfolio[selectedImage].images[0]}
                    alt={artisan.portfolio[selectedImage].title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : artisan.portfolio[selectedImage].mediaUrl ? (
                  <img
                    src={artisan.portfolio[selectedImage].mediaUrl}
                    alt={artisan.portfolio[selectedImage].title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                
                {/* Fallback icon if no image or image fails to load */}
                <div className={`w-full h-full flex items-center justify-center ${(artisan.portfolio[selectedImage].images && artisan.portfolio[selectedImage].images.length > 0) || artisan.portfolio[selectedImage].mediaUrl || (artisan.portfolio[selectedImage].videos && artisan.portfolio[selectedImage].videos.length > 0) ? 'hidden' : ''}`}>
                  <ImageIcon className={`w-24 h-24 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                  {artisan.portfolio[selectedImage].title}
                </h3>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                  {artisan.portfolio[selectedImage].description}
                </p>
                <div className="flex justify-between items-center">
                  {artisan.portfolio[selectedImage].category && (
                    <span className="text-[#A4B465] font-semibold text-lg">
                      {artisan.portfolio[selectedImage].category}
                    </span>
                  )}
                  {artisan.portfolio[selectedImage].createdAt && (
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      Created {new Date(artisan.portfolio[selectedImage].createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {artisan.portfolio.length > 1 && (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}