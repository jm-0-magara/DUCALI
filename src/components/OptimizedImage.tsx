import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePerformance } from '../hooks/usePerformance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  size?: number; // For circular/square images
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fill?: boolean;
  sizes?: string;
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  size,
  className = '',
  priority = false,
  quality = 80,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  sizes,
  onClick,
  loading = 'lazy',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const { isInViewport, lazyLoad, getOptimizedImageSrc, isMobile, getPixelRatio } = usePerformance({
    enableLazyLoading: !priority,
    enableIntersectionObserver: !priority
  });

  // Determine actual dimensions
  const actualWidth = size || width;
  const actualHeight = size || height;

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (() => {
    if (fill) return '100vw';
    if (actualWidth) {
      if (actualWidth <= 640) return `${actualWidth}px`;
      if (actualWidth <= 1024) return `${Math.min(actualWidth, 768)}px`;
      return `${Math.min(actualWidth, 1200)}px`;
    }
    return '100vw';
  })();

  // Optimize image source for mobile
  const optimizedSrc = getOptimizedImageSrc(imageSrc, actualWidth);

  // Lazy load image
  const finalSrc = lazyLoad(optimizedSrc, blurDataURL);

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Update image source when src prop changes
  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Preload critical images
  useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedSrc;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, optimizedSrc]);

  // Generate responsive image sizes for different breakpoints
  const getResponsiveSizes = () => {
    if (fill) return '100vw';
    
    const baseWidth = actualWidth || 400;
    const pixelRatio = getPixelRatio();
    
    return `(max-width: 640px) ${Math.min(baseWidth, 640)}px, ` +
           `(max-width: 768px) ${Math.min(baseWidth, 768)}px, ` +
           `(max-width: 1024px) ${Math.min(baseWidth, 1024)}px, ` +
           `${Math.min(baseWidth, 1200)}px`;
  };

  // Handle click with touch optimization
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      // Add small delay for touch devices to prevent accidental clicks
      if (isMobile()) {
        setTimeout(onClick, 50);
      } else {
        onClick();
      }
    }
  };

  // Loading placeholder
  if (isLoading && !isLoaded) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{
          width: actualWidth,
          height: actualHeight,
          borderRadius: size ? '50%' : undefined
        }}
      />
    );
  }

  // Error state
  if (hasError) {
    return (
      <div 
        className={`bg-gradient-to-br from-accent-gold to-wine-red flex items-center justify-center text-white ${className}`}
        style={{
          width: actualWidth,
          height: actualHeight,
          borderRadius: size ? '50%' : undefined
        }}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  // Main image component
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        width: actualWidth,
        height: actualHeight,
        borderRadius: size ? '50%' : undefined
      }}
    >
      <Image
        ref={imageRef}
        src={finalSrc}
        alt={alt}
        width={actualWidth}
        height={actualHeight}
        className={`object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${onClick ? 'cursor-pointer' : ''}`}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        fill={fill}
        sizes={getResponsiveSizes()}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        onClick={handleClick}
        style={{
          borderRadius: size ? '50%' : undefined
        }}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Click overlay for better touch feedback */}
      {onClick && (
        <div 
          className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-200 cursor-pointer"
          onClick={handleClick}
        />
      )}
    </div>
  );
}

// Profile image component with optimized defaults
export function ProfileImage({
  src,
  alt,
  size = 40,
  className = '',
  onClick,
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & {
  size?: number;
}) {
  // Default profile image - Cloudinary URL
  const defaultProfileImage = 'https://res.cloudinary.com/de3qsj9qa/image/upload/v1755470693/blank_av3gia.jpg';

  // Enhanced validation - check if it's a valid URL and not an emoji
  const isValidImage = src && 
    src.trim() !== '' && 
    src.startsWith('http') &&
    !src.includes('👨‍🎨') && !src.includes('👗') && !src.includes('🪑') && !src.includes('💍') && 
    !src.includes('🎨') && !src.includes('🍰') && !src.includes('💻') && !src.includes('🖼️');

  // Use default image if no valid image provided
  const imageSrc = isValidImage ? src : defaultProfileImage;

  const handleError = () => {
    // If the image fails to load, it will fall back to the default
    console.log('Profile image failed to load, using default');
  };

  // If the image is an emoji, render it as text instead of trying to load as image
  if (src && !isValidImage && (src.includes('👗') || src.includes('🪑') || src.includes('💍') || 
      src.includes('🎨') || src.includes('🍰') || src.includes('🖼️') || src.includes('👨‍🎨'))) {
    return (
      <div 
        className={`bg-gradient-to-br from-accent-gold to-wine-red rounded-full flex items-center justify-center text-white text-2xl font-bold ${className}`}
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size
        }}
        onClick={onClick}
      >
        {src}
      </div>
    );
  }

  // If no valid image and we have alt text, show initials
  if (!isValidImage && alt && alt !== 'Profile picture') {
    const initials = alt
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return (
      <div 
        className={`bg-gradient-to-br from-accent-gold to-wine-red rounded-full flex items-center justify-center text-white font-bold ${className}`}
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          fontSize: Math.max(12, size * 0.4)
        }}
        onClick={onClick}
      >
        {initials}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={imageSrc}
      alt={alt || 'Profile picture'}
      size={size}
      className={`rounded-full ${className}`}
      onClick={onClick}
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      onError={handleError}
      {...props}
    />
  );
}

// Hero image component for large images
export function HeroImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'fill' | 'sizes'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      sizes="100vw"
      priority
      quality={90}
      {...props}
    />
  );
}

// Thumbnail image component for small images
export function ThumbnailImage({
  src,
  alt,
  size = 80,
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & {
  size?: number;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      size={size}
      className={`rounded-lg ${className}`}
      quality={75}
      {...props}
    />
  );
}
