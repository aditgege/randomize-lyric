import React, { useState, useCallback } from 'react';
import { useCachedImage } from '../utils/imageCache';

interface LargeBackgroundImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  flipped?: boolean;
  position?: 'left' | 'right';
}

// Specialized component for large background images to prevent flickering
const LargeBackgroundImage = React.memo<LargeBackgroundImageProps>(({ 
  src, 
  alt = '', 
  className = '', 
  style = {},
  flipped = false,
  position = 'right'
}) => {
  const { cachedSrc, isLoading, error } = useCachedImage(src);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    console.error(`Failed to load image: ${src}`);
    setImageLoaded(true); // Still set to true to prevent infinite loading
  }, [src]);

  // Debug logging
  console.log(`LargeBackgroundImage ${position}:`, { 
    src, 
    cachedSrc, 
    isLoading, 
    error, 
    imageLoaded,
    flipped 
  });

  // Always show a placeholder for debugging
  if (isLoading || !cachedSrc || error) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          ...(position === 'left' ? { left: 0, right: 'unset' } : { right: 0, left: 'unset' }),
          width: '100%',
          height: '100%',
          backgroundColor: position === 'left' ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)', // Red for left, green for right
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style
        }}
        className={className}
      >
        {/* Debug info */}
        <div style={{ opacity: 0.8, fontSize: '14px', color: 'white', textAlign: 'center' }}>
          {position.toUpperCase()}<br/>
          {isLoading ? 'Loading...' : error ? 'Error!' : 'No Src'}
        </div>
      </div>
    );
  }

  return (
    <img
      src={cachedSrc || src} // Fallback to original src
      alt={alt}
      className={className}
      onLoad={handleImageLoad}
      onError={handleImageError}
      style={{
        position: 'absolute',
        top: 0,
        // Force exact positioning with explicit values
        ...(position === 'left' ? { left: 0, right: 'unset' } : { right: 0, left: 'unset' }),
        width: '100%',
        height: '100%',
        // Anti-flickering optimizations
        backfaceVisibility: 'hidden',
        transform: flipped ? 'scaleX(-1) translateZ(0)' : 'translateZ(0)',
        imageRendering: 'crisp-edges',
        // Use contain to show full image, positioned to the correct side
        objectFit: 'contain',
        objectPosition: position === 'left' ? 'left center' : 'right center',
        // Smooth fade-in when loaded
        opacity: imageLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
        willChange: flipped ? 'opacity, transform' : 'opacity',
        // Prevent image selection and interaction
        userSelect: 'none',
        pointerEvents: 'none',
        ...style
      }}
      loading="eager"
      decoding="sync"
      draggable={false}
    />
  );
});

LargeBackgroundImage.displayName = 'LargeBackgroundImage';

export default LargeBackgroundImage;
