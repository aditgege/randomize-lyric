import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ImageItem } from '../../types';

// Special bunga (flower) animation component - Optimized for smooth first render
const BungaImage = React.memo<{ item: ImageItem; imagesPreloaded: boolean }>(({ item, imagesPreloaded }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [directionCycle, setDirectionCycle] = useState(0); // 0=top, 1=right, 2=bottom, 3=left
  
  // Simple directional positions (just hidden and visible states)
  const directions = useMemo(() => [
    // Direction 0: TOP - slides from completely off top edge to center
    { 
      hidden: { x: 50, y: -50, rotate: 0 }, 
      visible: { x: 50, y: 15, rotate: 0 } 
    },
    // Direction 1: RIGHT - slides from completely off right edge to center (rotated 90°)
    { 
      hidden: { x: 195, y: 50, rotate: 90 }, 
      visible: { x: 92, y: 50, rotate: 90 } 
    },
    // Direction 2: BOTTOM - slides from completely off bottom edge to center (rotated)
    { 
      hidden: { x: 50, y: 150, rotate: 180 }, 
      visible: { x: 50, y: 82, rotate: 180 } 
    },
    // Direction 3: LEFT - slides from completely off left edge to center (rotated 270°)
    { 
      hidden: { x: -20, y: 50, rotate: 270 }, 
      visible: { x: 8, y: 50, rotate: 270 } 
    },
  ], []);

  // Start animation immediately when images are preloaded
  useEffect(() => {
    if (imagesPreloaded) {
      // Use requestAnimationFrame for smooth initial animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }
  }, [imagesPreloaded]);

  // Auto-cycle through directions: hidden → visible → hidden → next direction
  useEffect(() => {
    if (!imagesPreloaded) return; // Don't start cycling until images are preloaded
    
    const cycle = () => {
      if (!isVisible) {
        // Show bunga
        setIsVisible(true);
        // Hide after 2 seconds
        setTimeout(() => setIsVisible(false), 2000);
      } else {
        // Move to next direction after hiding
        setTimeout(() => {
          setDirectionCycle(prev => (prev + 1) % 4);
          setIsVisible(false);
        }, 500);
      }
    };

    const timeout = setTimeout(cycle, isVisible ? 2000 : 1000);
    return () => clearTimeout(timeout);
  }, [isVisible, imagesPreloaded]);

  const currentDirection = directions[directionCycle];
  const currentPosition = isVisible ? currentDirection.visible : currentDirection.hidden;

  // Don't render until images are preloaded to prevent lag
  if (!imagesPreloaded) {
    return null;
  }

  return (
    <motion.img
      src={item.src}
      alt=""
      className="select-none"
      style={{
        position: 'fixed', // Use fixed positioning for full screen
        width: '280px',
        height: '280px',
        objectFit: 'contain',
        pointerEvents: 'none',
        willChange: 'transform, opacity',
        zIndex: 15,
        // Use transform3d for better GPU acceleration
        backfaceVisibility: 'hidden',
        perspective: '1000px',
      }}
      initial={{
        left: `calc(${currentDirection.hidden.x}vw - 140px)`,
        top: `calc(${currentDirection.hidden.y}vh - 140px)`,
        rotate: currentDirection.hidden.rotate,
        opacity: 0,
      }}
      animate={{
        left: `calc(${currentPosition.x}vw - 140px)`, // Use viewport width
        top: `calc(${currentPosition.y}vh - 140px)`,  // Use viewport height
        rotate: currentPosition.rotate,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
        // Use hardware acceleration hints
        type: "tween",
      }}
    />
  );
});

export default BungaImage;
