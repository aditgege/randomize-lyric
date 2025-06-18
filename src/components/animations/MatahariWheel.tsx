import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Special sun (matahari) wheel animation component - rotating circular background
const MatahariWheel = React.memo(() => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  // Preload the matahari image for smooth rendering
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc('/dean/matahari.png');
      setImageLoaded(true);
    };
    img.onerror = () => {
      // Even if image fails, show the component without the image
      setImageLoaded(true);
    };
    img.src = '/dean/matahari.png';
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{
        zIndex: 6, // Above background images (2-5) but below lyrics (1000)
      }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 50%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Main rotating sun wheel - only render when image is loaded */}
      {imageLoaded && (
        <motion.div
          className="absolute z-10 rounded-full"
          style={{
            width: '400px',
            height: '400px',
            backgroundImage: imageSrc ? `url(${imageSrc})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.8,
            // Add GPU acceleration hints for smoother animation
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)', // Force hardware acceleration
          }}
          initial={{ 
            opacity: 0,
            scale: 0.8,
            rotate: 0 
          }}
          animate={{ 
            opacity: 0.8,
            scale: 1,
            rotate: 360,
          }}
          transition={{
            opacity: { duration: 0.5, ease: "easeOut" },
            scale: { duration: 0.5, ease: "easeOut" },
            rotate: {
              duration: 20, // Slow rotation like a wheel
              ease: "linear",
              repeat: Infinity,
            }
          }}
        />
      )}
      
      {/* Loading placeholder while image loads */}
      {!imageLoaded && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255, 193, 7, 0.2) 0%, rgba(255, 193, 7, 0.1) 50%, transparent 70%)',
            opacity: 0.6,
          }}
          animate={{
            rotate: 360,
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            rotate: {
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            },
            scale: {
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }
          }}
        />
      )}
      
      {/* Inner bright core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 193, 7, 0.2) 50%, transparent 100%)',
        }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </motion.div>
  );
});

export default MatahariWheel;
