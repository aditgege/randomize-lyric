// Global image cache utility
interface CachedImage {
  blob: Blob;
  objectUrl: string;
  timestamp: number;
}

class ImageCacheManager {
  private cache = new Map<string, CachedImage>();
  private readonly maxAge = 60 * 60 * 1000; // 1 hour in milliseconds
  private readonly maxSize = 100; // Maximum number of cached images

  async cacheImage(src: string): Promise<string> {
    // Check if already cached and not expired
    const existing = this.cache.get(src);
    if (existing && Date.now() - existing.timestamp < this.maxAge) {
      return existing.objectUrl;
    }

    try {
      // Fetch and cache the image
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      // Clean up old entry if it exists
      if (existing) {
        URL.revokeObjectURL(existing.objectUrl);
      }

      // Add to cache
      this.cache.set(src, {
        blob,
        objectUrl,
        timestamp: Date.now()
      });

      // Clean up cache if it's getting too large
      this.cleanup();

      return objectUrl;
    } catch (error) {
      console.warn('Failed to cache image:', src, error);
      return src; // Fallback to original src
    }
  }

  getCachedUrl(src: string): string | null {
    const cached = this.cache.get(src);
    if (cached && Date.now() - cached.timestamp < this.maxAge) {
      return cached.objectUrl;
    }
    return null;
  }

  preloadImages(imagePaths: string[]): Promise<string[]> {
    return Promise.all(
      imagePaths.map(path => this.cacheImage(path))
    );
  }

  private cleanup() {
    if (this.cache.size <= this.maxSize) return;

    // Sort by timestamp and remove oldest entries
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);

    const toRemove = entries.slice(0, entries.length - this.maxSize);
    
    for (const [key, value] of toRemove) {
      URL.revokeObjectURL(value.objectUrl);
      this.cache.delete(key);
    }
  }

  clear() {
    for (const [, value] of this.cache) {
      URL.revokeObjectURL(value.objectUrl);
    }
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Global instance
export const imageCache = new ImageCacheManager();

// React hook for using cached images
import { useState, useEffect } from 'react';

export const useCachedImage = (src: string) => {
  const [cachedSrc, setCachedSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Check if already cached
    const existing = imageCache.getCachedUrl(src);
    if (existing) {
      setCachedSrc(existing);
      setIsLoading(false);
      return;
    }

    // Cache the image
    imageCache.cacheImage(src)
      .then(cachedUrl => {
        if (isMounted) {
          setCachedSrc(cachedUrl);
          setIsLoading(false);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setCachedSrc(src); // Fallback to original
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return { cachedSrc, isLoading, error };
};

// Utility function to get image paths for caching
export const getAllImagePaths = () => {
  const basePaths = [
    // Background images
    '/bg.png',
    '/mountain.png',
    '/pattern.png',
    '/wave.png',
    
    // Character images
    '/dean/bruh.png',
    '/dean/bunga.png',
    '/dean/makan.png',
    '/dean/marah.png',
    '/dean/matahari.png',
    '/dean/peri.png',
    '/dean/ski.png'
  ];

  return basePaths;
};
