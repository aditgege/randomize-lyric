import React from 'react';
import { useCachedImage } from '../utils/imageCache';

interface CachedImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async' | 'auto';
  onLoad?: () => void;
  onError?: () => void;
}

// High-performance cached image component
const CachedImage = React.memo<CachedImageProps>(({ 
  src, 
  alt = '', 
  className = '', 
  style = {}, 
  loading = 'eager',
  decoding = 'sync',
  onLoad,
  onError
}) => {
  const { cachedSrc, isLoading, error } = useCachedImage(src);

  // Don't render until image is cached (unless there's an error)
  if (isLoading && !error) {
    return null;
  }

  return (
    <img
      src={cachedSrc || src}
      alt={alt}
      className={className}
      style={{
        ...style,
        // Additional performance optimizations
        imageRendering: 'crisp-edges',
        backfaceVisibility: 'hidden',
      }}
      loading={loading}
      decoding={decoding}
      onLoad={onLoad}
      onError={onError}
    />
  );
});

CachedImage.displayName = 'CachedImage';

export default CachedImage;
