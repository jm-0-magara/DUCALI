import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { favoritesService } from '../lib/favoritesService';
import { type Artisan } from '../lib/artisanService';
import { useAuth } from '../contexts/AuthContext';

interface FavoriteButtonProps {
  artisan: Artisan;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onToggle?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({ 
  artisan, 
  size = 'md', 
  className = '',
  onToggle 
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if artisan is in favorites on mount
  useEffect(() => {
    if (user?.id) {
      favoritesService.isFavorite(user.id, artisan.id)
        .then(setIsFavorite)
        .catch(console.error);
    }
  }, [user?.id, artisan.id]);

  const handleToggle = async () => {
    if (!user?.id) {
      // Show login prompt or redirect to login
      alert('Please log in to save favorites');
      return;
    }

    setIsLoading(true);
    try {
      let success = false;
      
      if (isFavorite) {
        success = await favoritesService.removeFromFavorites(user.id, artisan.id);
        if (success) {
          setIsFavorite(false);
          onToggle?.(false);
        }
      } else {
        success = await favoritesService.addToFavorites(user.id, artisan);
        if (success) {
          setIsFavorite(true);
          onToggle?.(true);
        }
      }

      if (!success) {
        alert('Failed to update favorites. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full transition-all duration-200
        hover:scale-110 active:scale-95
        ${isFavorite 
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
          : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-gray-600/30'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`${iconSizes[size]} ${isFavorite ? 'fill-current' : ''}`}
        style={{ 
          animation: isLoading ? 'pulse 1s infinite' : 'none'
        }}
      />
    </button>
  );
}
