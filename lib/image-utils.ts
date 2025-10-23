// Image optimization utilities for better performance and error handling

export const getOptimizedImageUrl = (url: string, width: number = 400, height: number = 400): string => {
  if (!url) return '';
  
  // If it's a Supabase URL, add resize parameters
  if (url.includes('supabase.co/storage')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?width=${width}&height=${height}&resize=cover&quality=80`;
  }
  
  return url;
};

export const getImageFallback = (title: string): string => {
  // Generate a simple placeholder based on product title
  const colors = ['f87171', '60a5fa', '34d399', 'fbbf24', 'a78bfa', 'fb7185'];
  const color = colors[title.length % colors.length];
  return `https://placehold.co/400x400/${color}/ffffff?text=${encodeURIComponent(title.slice(0, 10))}`;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
};

export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`));
    };
    img.src = url;
  });
};





