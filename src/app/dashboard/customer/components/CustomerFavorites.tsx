// src/app/dashboard/customer/components/CustomerFavorites.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock, Heart, Trash2, Loader2 } from 'lucide-react';
import { favoritesService, type FavoriteArtisan } from '../../../../lib/favoritesService';
import { useAuth } from '../../../../contexts/AuthContext';
import FavoriteButton from '../../../../components/FavoriteButton';

export default function CustomerFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteArtisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user?.id]);

  const loadFavorites = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const userFavorites = await favoritesService.getFavorites(user.id);
      setFavorites(userFavorites);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (artisanId: string) => {
    if (!user?.id) return;

    setRemovingId(artisanId);
    try {
      const success = await favoritesService.removeFromFavorites(user.id, artisanId);
      if (success) {
        setFavorites(prev => prev.filter(fav => fav.id !== artisanId));
      } else {
        alert('Failed to remove from favorites. Please try again.');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove from favorites. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleFavoriteToggle = (artisanId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      // Remove from local state if unfavorited
      setFavorites(prev => prev.filter(fav => fav.id !== artisanId));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">My Favorites</h2>
        </div>
        
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#A4B465] mx-auto mb-4" />
          <p className="text-slate-400">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">My Favorites</h2>
        </div>
        
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-white text-xl font-semibold mb-2">Unable to load favorites</h3>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={loadFavorites}
            className="bg-[#626F47] text-white px-6 py-2 rounded-lg hover:bg-[#A4B465] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Favorites</h2>
          <p className="text-slate-400 mt-1">
            {favorites.length} artisan{favorites.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        
        {favorites.length > 0 && (
          <button
            onClick={loadFavorites}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            <Loader2 className="w-4 h-4" />
            Refresh
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-white text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-slate-400 mb-6">
            Start exploring artisans and save your favorites to see them here!
          </p>
          <Link
            href="/browse"
            className="bg-[#626F47] text-white px-6 py-3 rounded-lg hover:bg-[#A4B465] transition-colors inline-block"
          >
            Browse Artisans
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 hover:shadow-xl hover:shadow-[#A4B465]/20 transition-all p-6 relative"
            >
              {/* Favorite Button - Top Right */}
              <div className="absolute top-4 right-4 z-10">
                <FavoriteButton 
                  artisan={favorite.artisan} 
                  size="sm"
                  onToggle={(isFavorite) => handleFavoriteToggle(favorite.artisan.id, isFavorite)}
                />
              </div>

              {/* Remove Button - Top Left */}
              <button
                onClick={() => handleRemoveFavorite(favorite.artisan.id)}
                disabled={removingId === favorite.artisan.id}
                className="absolute top-4 left-4 z-10 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                title="Remove from favorites"
              >
                {removingId === favorite.artisan.id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
              </button>

              <div className="flex items-center mb-4">
                <div className="w-16 h-16 mr-4 rounded-full overflow-hidden flex-shrink-0">
                  {favorite.artisan.profileImage ? (
                    <img
                      src={favorite.artisan.profileImage}
                      alt={favorite.artisan.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to emoji or initial if image fails
                        const target = e.currentTarget;
                        if (target.src.includes('cloudinary.com')) {
                          // Try optimized URL
                          const optimizedUrl = target.src.replace('/upload/', '/upload/w_64,h_64,c_fill,g_face,q_80,f_webp/');
                          target.src = optimizedUrl;
                        } else {
                          // Replace with fallback
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl">${favorite.artisan.name.charAt(0).toUpperCase()}</div>`;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br from-accent-gold to-wine-red">
                      {favorite.artisan.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {favorite.artisan.name}
                    {favorite.artisan.verified && <span className="text-[#A4B465] text-sm">✓</span>}
                    {favorite.artisan.featured && <span className="bg-[#F0BB78] text-slate-900 text-xs px-2 py-1 rounded-full">Featured</span>}
                  </h3>
                  <p className="text-slate-300">{favorite.artisan.specialty}</p>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{favorite.artisan.description}</p>

              {/* Skills */}
              {favorite.artisan.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {favorite.artisan.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {favorite.artisan.skills.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded-full">
                        +{favorite.artisan.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-current" style={{ color: '#F0BB78' }} />
                  <span className="ml-1 text-slate-300">{favorite.artisan.rating.toFixed(1)}</span>
                  <span className="ml-1 text-slate-400">({favorite.artisan.totalOrders} orders)</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{favorite.artisan.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold" style={{ color: '#A4B465' }}>{favorite.artisan.priceRange}</div>
                <div className="flex items-center text-slate-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{favorite.artisan.responseTime}</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 mb-4">
                Added {favorite.addedAt.toLocaleDateString()}
              </div>

              <Link 
                href={`/artisan/${favorite.artisan.id}`}
                className="w-full text-white py-3 rounded-lg hover:bg-[#626F47] transition-colors shadow-md inline-block text-center" 
                style={{ backgroundColor: '#626F47' }}
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}