// src/app/dashboard/artisan/components/ArtisanPortfolioManager.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit3, Eye, Star, Trash2, Upload, Video, Image, X } from 'lucide-react';
import { PortfolioItem } from '../../../../types/artisan';
import ImageUpload from '../../../../components/ImageUpload';
import { CloudinaryUploadResult } from '../../../../lib/cloudinary';
import { artisanDataService, ArtisanPortfolioItem } from '../../../../lib/artisanDataService';
import { useAuth } from '../../../../contexts/AuthContext';

export default function ArtisanPortfolioManager() {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    mediaType: 'image' as 'image' | 'video',
    mediaFile: null as File | null,
    mediaUrl: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [portfolio, setPortfolio] = useState<ArtisanPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load portfolio data
  useEffect(() => {
    if (!user?.id) return;

    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const portfolioData = await artisanDataService.getArtisanPortfolio(user.id);
        setPortfolio(portfolioData);
        setError(null);
      } catch (err) {
        console.error('Error loading portfolio:', err);
        setError('Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [user?.id]);

  const handleAddItem = async () => {
    if (!user?.id || !newItem.title || !newItem.description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

             // Create new portfolio item for Firebase
       const newPortfolioItem = {
         title: newItem.title,
         description: newItem.description,
         mediaType: newItem.mediaType,
         mediaUrl: newItem.mediaUrl || 'https://via.placeholder.com/400x300',
         category: 'Portfolio',
         tags: [],
         featured: false,
         views: 0,
         likes: 0
       };

      // Add to Firebase
      const itemId = await artisanDataService.addPortfolioItem(user.id, newPortfolioItem);

      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Reload portfolio data
      const updatedPortfolio = await artisanDataService.getArtisanPortfolio(user.id);
      setPortfolio(updatedPortfolio);

      setShowAddModal(false);
      setNewItem({
        title: '',
        description: '',
        mediaType: 'image',
        mediaFile: null,
        mediaUrl: ''
      });
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      alert('Failed to add portfolio item');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleMediaUpload = (result: CloudinaryUploadResult) => {
    setNewItem(prev => ({
      ...prev,
      mediaUrl: result.secure_url
    }));
  };

  const renderMediaPreview = () => {
    if (newItem.mediaUrl) {
      if (newItem.mediaType === 'video') {
        return (
          <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
            <video
              src={newItem.mediaUrl}
              className="w-full h-full object-cover"
              controls
            />
            <div className="absolute top-2 right-2">
              <Video className="w-6 h-6 text-white bg-black/50 rounded p-1" />
            </div>
          </div>
        );
      } else {
        return (
          <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={newItem.mediaUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Image className="w-6 h-6 text-white bg-black/50 rounded p-1" />
            </div>
          </div>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Portfolio Management</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B08D57]"></div>
          <span className="ml-3 text-white">Loading portfolio...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Portfolio Management</h2>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Portfolio Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-[#B08D57] text-white px-4 py-2 rounded-lg hover:bg-[#B08D57]/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Portfolio Grid */}
      {portfolio.length === 0 ? (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Portfolio Items</h3>
          <p className="text-slate-400 mb-6">Start building your portfolio by adding your first item</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-[#B08D57] text-white px-6 py-3 rounded-lg hover:bg-[#B08D57]/80 transition-colors mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Item</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 bg-gray-200">
                             {item.mediaType === 'video' && item.mediaUrl ? (
                 <video
                   src={item.mediaUrl}
                   className="w-full h-full object-cover"
                   controls
                 />
               ) : item.mediaUrl ? (
                 <img
                   src={item.mediaUrl}
                   alt={item.title}
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                   <span className="text-gray-500">No media</span>
                 </div>
               )}
              
              {/* Media type indicator */}
              <div className="absolute top-2 right-2">
                {item.mediaType === 'video' ? (
                  <Video className="w-6 h-6 text-white bg-black/50 rounded p-1" />
                ) : (
                  <Image className="w-6 h-6 text-white bg-black/50 rounded p-1" />
                )}
              </div>

              {/* Action buttons */}
              <div className="absolute top-2 left-2 flex space-x-1">
                <button className="p-1 bg-white/80 rounded hover:bg-white transition-colors">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 bg-white/80 rounded hover:bg-white transition-colors">
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 bg-red-500/80 rounded hover:bg-red-500 transition-colors">
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

                         <div className="p-4">
               <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
               <p className="text-sm text-gray-600 mb-2">{item.description}</p>
               <div className="flex justify-between items-center text-xs text-gray-500">
                 <span>{item.category}</span>
                 <span>{item.createdAt?.toLocaleDateString() || 'Unknown date'}</span>
               </div>
               {(item.price || item.timeframe) && (
                 <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                   {item.price && <span>KSH {item.price}</span>}
                   {item.timeframe && <span>{item.timeframe}</span>}
                 </div>
               )}
             </div>
          </div>
        ))}
        </div>
      )}

             {/* Add Item Modal */}
       {showAddModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md mx-4">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-semibold text-white">Add Portfolio Item</h3>
               <button
                 onClick={() => setShowAddModal(false)}
                 className="text-slate-400 hover:text-white"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>

            <div className="space-y-4">
                             {/* Title */}
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1">
                   Title *
                 </label>
                 <input
                   type="text"
                   value={newItem.title}
                   onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                   className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B08D57] focus:border-[#B08D57]"
                   placeholder="Enter item title"
                 />
               </div>

               {/* Description */}
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1">
                   Description *
                 </label>
                 <textarea
                   value={newItem.description}
                   onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                   className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B08D57] focus:border-[#B08D57]"
                   rows={3}
                   placeholder="Describe your work"
                 />
               </div>

               {/* Media Type */}
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1">
                   Media Type
                 </label>
                 <div className="flex space-x-4">
                   <label className="flex items-center text-slate-300">
                     <input
                       type="radio"
                       value="image"
                       checked={newItem.mediaType === 'image'}
                       onChange={(e) => setNewItem(prev => ({ ...prev, mediaType: e.target.value as 'image' | 'video' }))}
                       className="mr-2 text-[#B08D57]"
                     />
                     <Image className="w-4 h-4 mr-1" />
                     Image
                   </label>
                   <label className="flex items-center text-slate-300">
                     <input
                       type="radio"
                       value="video"
                       checked={newItem.mediaType === 'video'}
                       onChange={(e) => setNewItem(prev => ({ ...prev, mediaType: e.target.value as 'image' | 'video' }))}
                       className="mr-2 text-[#B08D57]"
                     />
                     <Video className="w-4 h-4 mr-1" />
                     Video
                   </label>
                 </div>
               </div>

               {/* Media Upload */}
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1">
                   Upload Media
                 </label>
                 <ImageUpload
                   onUpload={handleMediaUpload}
                   accept={newItem.mediaType}
                   maxSize={newItem.mediaType === 'video' ? 100 : 10}
                   placeholder={`Upload ${newItem.mediaType}`}
                   className="w-full"
                 />
               </div>

                             {/* Preview */}
               {renderMediaPreview()}

               {/* Upload Progress */}
               {isUploading && (
                 <div className="space-y-2">
                   <div className="flex justify-between text-sm text-slate-300">
                     <span>Uploading...</span>
                     <span>{uploadProgress}%</span>
                   </div>
                   <div className="w-full bg-slate-600 rounded-full h-2">
                     <div
                       className="bg-[#B08D57] h-2 rounded-full transition-all duration-300"
                       style={{ width: `${uploadProgress}%` }}
                     />
                   </div>
                 </div>
               )}

               {/* Action Buttons */}
               <div className="flex space-x-3 pt-4">
                 <button
                   onClick={() => setShowAddModal(false)}
                   className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleAddItem}
                   disabled={isUploading || !newItem.title || !newItem.description}
                   className="flex-1 px-4 py-2 bg-[#B08D57] text-white rounded-md hover:bg-[#B08D57]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isUploading ? 'Adding...' : 'Add Item'}
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}