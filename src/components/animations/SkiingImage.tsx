import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ImageItem } from '../../types';

// Special skiing animation component using Framer Motion
const SkiingImage = React.memo<{ item: ImageItem }>(({ item }) => {
  const [currentPoint, setCurrentPoint] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  
  // Define skiing path points with more realistic skiing movements
  const skiingPath = useMemo(() => [
    { x: 85, y: 25, tilt: -5 }, // Start from right, leaning left
    { x: 70, y: 30, tilt: 5 },  // Carve right
    { x: 55, y: 35, tilt: -10 }, // Sharp left turn
    { x: 40, y: 25, tilt: 8 },   // Right turn, going up
    { x: 25, y: 40, tilt: -3 },  // Gentle left
    { x: 15, y: 20, tilt: 12 },  // Sharp right at edge
    { x: 35, y: 60, tilt: -8 },  // Big left turn down
    { x: 60, y: 70, tilt: 6 },   // Right turn at bottom
    { x: 75, y: 45, tilt: -4 },  // Left turn going up
    { x: 80, y: 15, tilt: 0 },   // Straight at top
  ], []);

  // Auto-advance through skiing path with random timing
  useEffect(() => {
    const getRandomInterval = () => Math.random() * 2000 + 2000; // 2-4 seconds
    
    const scheduleNext = () => {
      const timeout = setTimeout(() => {
        setCurrentPoint(prev => {
          const next = (prev + 1) % skiingPath.length;
          // Change direction based on path
          if (skiingPath[next].x > skiingPath[prev].x) {
            setDirection('right');
          } else {
            setDirection('left');
          }
          return next;
        });
        scheduleNext();
      }, getRandomInterval());
      
      return timeout;
    };

    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, [skiingPath]);

  const currentTarget = skiingPath[currentPoint];

  return (
    <>
      {/* Skiing trail effect */}
      <motion.div
        className="absolute rounded-full"
        style={{
          position: 'absolute',
          width: '60px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          zIndex: 9,
        }}
        animate={{
          x: `${currentTarget.x}%`,
          y: `${currentTarget.y + 2}%`,
          rotate: currentTarget.tilt,
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
        }}
        initial={{ opacity: 0 }}
      />
      
      {/* Main skiing image */}
      <motion.img
        src={item.src}
        alt=""
        className="select-none"
        initial={{ 
          x: `${skiingPath[0].x}%`, 
          y: `${skiingPath[0].y}%`,
          scale: 0.7,
          rotate: skiingPath[0].tilt,
          opacity: 0
        }}
        animate={{ 
          x: `${currentTarget.x}%`, 
          y: `${currentTarget.y}%`,
          opacity: 1,
          rotate: currentTarget.tilt + (direction === 'left' ? -5 : 5),
          scale: [0.7, 0.8, 0.7], // Breathing scale effect
          scaleX: direction === 'left' ? 1 : -1, // Flip image based on direction
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          scale: {
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }
        }}
        style={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          maxWidth: '300px',
          maxHeight: '300px',
          objectFit: 'contain',
          pointerEvents: 'none',
          filter: `brightness(1.2) contrast(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
        }}
      />
      
      {/* Snow particles effect */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            zIndex: 8,
          }}
          animate={{
            x: `${currentTarget.x + (Math.random() - 0.5) * 10}%`,
            y: `${currentTarget.y + 3 + i}%`,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1 + i * 0.2,
            ease: "easeOut",
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </>
  );
});

export default SkiingImage;
