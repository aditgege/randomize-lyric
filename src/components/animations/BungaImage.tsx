import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ImageItem } from '../../types';
import { useCachedImage } from '../../utils/imageCache';

// Optimized bunga (flower) animation component with caching and performance improvements
const BungaImage = React.memo<{ item: ImageItem; imagesPreloaded: boolean }>(({ item, imagesPreloaded }) => {
  // Use cached image for better performance
  const { cachedSrc, isLoading } = useCachedImage(item.src);
  
  const [isVisible, setIsVisible] = useState(false);
  const [directionCycle, setDirectionCycle] = useState(0); // 0=top, 1=right, 2=bottom, 3=left
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Memoized directional positions for better performance
  const directions = useMemo(() => [
    // Direction 0: TOP
    { 
      hidden: { x: 50, y: -20, rotate: 0 }, 
      visible: { x: 50, y: 10, rotate: 0 } 
    },
    // Direction 1: RIGHT
    { 
      hidden: { x: 120, y: 50, rotate: 90 }, 
      visible: { x: 86, y: 50, rotate: 90 } 
    },
    // Direction 2: BOTTOM
    { 
      hidden: { x: 50, y: 120, rotate: 180 }, 
      visible: { x: 50, y: 70, rotate: 180 } 
    },
    // Direction 3: LEFT
    { 
      hidden: { x: -20, y: 50, rotate: 270 }, 
      visible: { x: 5, y: 50, rotate: 270 } 
    },
  ], []);

  // Memoized current position calculation
  const currentDirection = useMemo(() => directions[directionCycle], [directions, directionCycle]);

  // Memoized styles for better performance
  const imageStyles = useMemo(() => ({
    position: 'fixed' as const,
    width: '350px',
    height: '350px',
    objectFit: 'contain' as const,
    pointerEvents: 'none' as const,
    willChange: 'transform, opacity',
    zIndex: 15,
    // GPU acceleration optimizations
    backfaceVisibility: 'hidden' as const,
    perspective: '1000px',
    imageRendering: 'crisp-edges' as const,
    // Prevent image dragging
    userSelect: 'none' as const,
    WebkitUserDrag: 'none' as const,
  }), []);

  // Memoized animation variants for performance
  const animationVariants = useMemo(() => ({
    hidden: {
      x: `calc(${currentDirection.hidden.x}vw - 100px)`,
      y: `calc(${currentDirection.hidden.y}vh - 100px)`,
      rotate: currentDirection.hidden.rotate,
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      x: `calc(${currentDirection.visible.x}vw - 100px)`,
      y: `calc(${currentDirection.visible.y}vh - 100px)`,
      rotate: currentDirection.visible.rotate,
      opacity: 1,
      scale: 1,
    }
  }), [currentDirection]);

  // Optimized animation start
  useEffect(() => {
    if (imagesPreloaded && cachedSrc && !isLoading) {
      // Use double RAF for smooth initial animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    }
  }, [imagesPreloaded, cachedSrc, isLoading]);

  // Optimized cycling with useCallback to prevent recreation
  const handleCycle = useCallback(() => {
    if (isAnimating) return; // Prevent overlapping animations
    
    setIsAnimating(true);
    
    if (isVisible) {
      // Hide current
      setIsVisible(false);
      setTimeout(() => {
        setDirectionCycle(prev => (prev + 1) % 4);
        setIsAnimating(false);
      }, 500); // Match transition duration
    } else {
      // Show next
      setIsVisible(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  }, [isVisible, isAnimating]);

  // Auto-cycle effect with cleanup
  useEffect(() => {
    if (!imagesPreloaded || !cachedSrc || isLoading) return;
    
    const cycleTimeout = setTimeout(handleCycle, isVisible ? 2000 : 800);
    return () => clearTimeout(cycleTimeout);
  }, [isVisible, imagesPreloaded, cachedSrc, isLoading, handleCycle]);

  // Don't render until image is cached and ready
  if (!imagesPreloaded || isLoading || !cachedSrc) {
    return null;
  }

  return (
    <motion.img
      src={cachedSrc}
      alt=""
      className="select-none"
      style={imageStyles}
      variants={animationVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smoothness
        type: "tween",
      }}
      // Prevent layout recalculation
      loading="eager"
      decoding="sync"
      draggable={false}
    />
  );
});

BungaImage.displayName = 'BungaImage';

export default BungaImage;
