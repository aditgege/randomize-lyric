import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ImageItem } from '../../types';

// Special princess jiggle animation component using Framer Motion
const PrincessImage = React.memo<{ item: ImageItem }>(({ item }) => {
  const [animationKey, setAnimationKey] = useState(0);
  
  // Princess jiggle animations that cycle through different movements
  const animations = [
    // Happy bouncing
    {
      y: [0, -8, 0],
      rotate: [0, 2, -2, 0],
      scale: [1, 1.05, 1],
    },
    // Dancing side to side
    {
      x: [0, -5, 5, 0],
      y: [0, -10, -5, 0],
      rotate: [0, -8, 8, 0],
      scale: [1, 1.1, 0.95, 1],
    },
    // Gentle waving
    {
      rotate: [0, 10, -5, 15, -10, 0],
      y: [0, -5, 0],
    },
    // Spinning princess twirl
    {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      y: [0, -15, 0],
    }
  ];

  const transitions = [
    { duration: 2, repeat: Infinity, repeatType: "reverse" as const },
    { duration: 1.5, repeat: Infinity, repeatType: "loop" as const },
    { duration: 3, repeat: Infinity, repeatType: "loop" as const },
    { duration: 4, repeat: Infinity, repeatType: "loop" as const }
  ];

  const currentAnimation = animations[animationKey % animations.length];
  const currentTransition = transitions[animationKey % transitions.length];

  // Sparkle effect positions
  const sparklePositions = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
      delay: i * 0.3,
      duration: 2 + Math.random() * 2,
    })), []);

  // Auto-change animation every 5-8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, Math.random() * 3000 + 5000); // 5-8 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Princess sparkle effects */}
      {sparklePositions.map((sparkle, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 15,
          }}
        >
          <motion.div
            className="w-2 h-2 bg-yellow-300 rounded-full"
            style={{
              boxShadow: '0 0 6px rgba(255, 215, 0, 0.8)',
            }}
            animate={{
              x: sparkle.x,
              y: sparkle.y,
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: sparkle.duration,
              ease: "easeOut",
              repeat: Infinity,
              delay: sparkle.delay,
            }}
          />
        </motion.div>
      ))}

      {/* Princess crown sparkle */}
      <motion.div
        className="absolute w-3 h-3 bg-pink-400 rounded-full"
        style={{
          left: `${item.x}%`,
          top: `${item.y - 8}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 12,
          boxShadow: '0 0 8px rgba(255, 105, 180, 0.8)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 1, 0.7],
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />

      {/* Main princess image */}
      <motion.div
        style={{
          position: 'absolute',
          left: `${item.x}%`,
          top: `${item.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.img
          key={animationKey} // Force re-render when animation changes
          src={item.src}
          alt=""
          className="select-none"
          animate={currentAnimation}
          transition={currentTransition}
          style={{
            maxWidth: '180px',
            maxHeight: '180px',
            objectFit: 'contain',
            pointerEvents: 'none',
            filter: `brightness(1.1) contrast(1.05) drop-shadow(0 4px 8px rgba(255, 105, 180, 0.3))`,
          }}
        />
      </motion.div>

      {/* Princess magic trail */}
      <motion.div
        className="absolute"
        style={{
          left: `${item.x}%`,
          top: `${item.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 8,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-300 rounded-full"
            style={{
              boxShadow: '0 0 4px rgba(255, 182, 193, 0.8)',
            }}
            animate={{
              x: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30],
              y: [i * 5, i * 5 + 20],
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: 2,
              ease: "easeOut",
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </>
  );
});

export default PrincessImage;
