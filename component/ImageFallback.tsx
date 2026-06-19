"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onClick?: () => void;
}

const ImageFallback: React.FC<ImageFallbackProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeSrc = (value: unknown) => {
    if (typeof value !== 'string') return '';
    return value.trim();
  };

  const isValidSrc = (value: string) => {
    if (!value) return false;
    return /^https?:\/\//i.test(value) || value.startsWith('/') || value.startsWith('data:image/');
  };

  // Generate a placeholder based on the alt text
  const getPlaceholderUrl = (text: string) => {
    const colors = ['f87171', '60a5fa', '34d399', 'fbbf24', 'a78bfa', 'fb7185', '8b5cf6', '06b6d4'];
    const color = colors[text.length % colors.length];
    const shortText = text.slice(0, 10).replace(/\s+/g, '+');
    return `https://placehold.co/${width}x${height}/${color}/ffffff?text=${shortText}`;
  };

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const normalizedSrc = normalizeSrc(src);
  const imageUrl = imageError || !isValidSrc(normalizedSrc) ? getPlaceholderUrl(alt) : normalizedSrc;

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      {/* Loading skeleton */}
      {isLoading && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      {/* Main image */}
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${onClick ? 'cursor-pointer' : ''}`}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes || `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
        onError={handleError}
        onLoad={handleLoad}
      />
      
      {/* Error state with better styling */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-pink-50 to-purple-50 text-gray-400">
          <div className="text-center">
            <div className="text-3xl mb-2">🖼️</div>
            <p className="text-xs font-medium">Image Preview</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageFallback;





