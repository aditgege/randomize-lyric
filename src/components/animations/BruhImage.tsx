import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageItem } from '../../types';

// Special orchestra conductor animation component for bruh.png
const BruhImage = React.memo<{ item: ImageItem }>(({ item }) => {
  const [beatPhase, setBeatPhase] = useState(0); // 0: upbeat, 1: downbeat, 2: left, 3: right
  const [intensity, setIntensity] = useState(1); // 1: normal, 2: crescendo, 3: forte
  
  // Conducting pattern cycle
  useEffect(() => {
    const cycleBeat = () => {
      setBeatPhase(prev => (prev + 1) % 4);
      
      // Randomly change intensity for dynamic conducting
      if (Math.random() > 0.7) {
        setIntensity(prev => prev >= 3 ? 1 : prev + 1);
      }
    };

    const interval = setInterval(cycleBeat, 800); // 75 BPM conducting
    return () => clearInterval(interval);
  }, []);

  // Get baton position based on beat phase
  const getBatonAnimation = () => {
    switch (beatPhase) {
      case 0: // Upbeat
        return { rotate: [-15, -25, -15], y: [-5, -15, -5] };
      case 1: // Downbeat
        return { rotate: [15, 25, 15], y: [5, 15, 5] };
      case 2: // Left
        return { rotate: [-30, -40, -30], x: [-5, -10, -5] };
      case 3: // Right
        return { rotate: [30, 40, 30], x: [5, 10, 5] };
      default:
        return { rotate: 0, y: 0, x: 0 };
    }
  };

  const batonAnimation = getBatonAnimation();

  return (
    <>
      {/* Podium base */}
      <motion.div
        className="absolute"
        style={{
          width: '60px',
          height: '20px',
          background: 'linear-gradient(180deg, #8B4513, #654321)',
          borderRadius: '4px',
          left: `${item.x}%`,
          top: `${item.y + 12}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
        animate={{
          scale: intensity >= 2 ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Musical staff lines in background */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`staff-${i}`}
          className="absolute"
          style={{
            width: '120px',
            height: '1px',
            background: 'rgba(0,0,0,0.2)',
            left: `${item.x - 20}%`,
            top: `${item.y - 25 + i * 3}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 7,
          }}
          animate={{
            opacity: intensity >= 3 ? [0.2, 0.5, 0.2] : 0.2,
          }}
          transition={{
            duration: 1.6,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}

      {/* Floating musical notes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`note-${i}`}
          className="absolute"
          style={{
            left: `${item.x + (Math.random() - 0.5) * 40}%`,
            top: `${item.y - 20}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 11,
            fontSize: `${12 + intensity * 2}px`,
            color: intensity >= 3 ? '#FF6B35' : '#333',
          }}
          initial={{
            opacity: 0,
            y: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            y: [-20, -60, -80],
            scale: [0, 1, 1.2],
            rotate: [0, 15, -10],
          }}
          transition={{
            duration: 2 + Math.random(),
            ease: "easeOut",
            repeat: Infinity,
            delay: i * 0.3 + Math.random() * 0.5,
          }}
        >
          {['🎵', '🎶', '♪', '♫', '♬', '𝄞'][i]}
        </motion.div>
      ))}

      {/* Sound waves emanating from conductor */}
      {intensity >= 2 && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute"
              style={{
                width: `${60 + i * 40}px`,
                height: `${60 + i * 40}px`,
                border: '2px solid rgba(255, 107, 53, 0.3)',
                borderRadius: '50%',
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 9,
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.6, 0.2, 0.6],
              }}
              transition={{
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </>
      )}

      {/* Main conductor image */}
      <motion.div
        style={{
          position: 'absolute',
          left: `${item.x}%`,
          top: `${item.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: intensity >= 3 ? [1, 1.1, 1] : 1,
          opacity: 1,
          rotate: beatPhase === 2 ? [-2, 2, -2] : beatPhase === 3 ? [2, -2, 2] : 0,
        }}
        transition={{ 
          duration: 0.8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <motion.img
          src={item.src}
          alt=""
          className="select-none"
          style={{
            maxWidth: '200px',
            maxHeight: '200px',
            objectFit: 'contain',
            pointerEvents: 'none',
            filter: intensity >= 3 ? 
              'brightness(1.2) contrast(1.1) drop-shadow(0 4px 12px rgba(255, 107, 53, 0.4))' : 
              'brightness(1.1) contrast(1.05) drop-shadow(0 2px 6px rgba(139, 69, 19, 0.3))',
            borderRadius: '8px',
          }}
        />
      </motion.div>

      {/* Conductor's baton */}
      <motion.div
        className="absolute"
        style={{
          width: '40px',
          height: '3px',
          background: 'linear-gradient(90deg, #8B4513, #D2691E, #F4A460)',
          borderRadius: '2px',
          left: `${item.x + 12}%`,
          top: `${item.y - 5}%`,
          transform: 'translate(-50%, -50%)',
          transformOrigin: '10% 50%',
          zIndex: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
        animate={{
          ...batonAnimation,
          scale: intensity >= 2 ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Baton tip glow effect */}
      <motion.div
        className="absolute"
        style={{
          width: '8px',
          height: '8px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8), rgba(255, 165, 0, 0.4))',
          borderRadius: '50%',
          left: `${item.x + 22}%`,
          top: `${item.y - 5}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 13,
        }}
        animate={{
          ...batonAnimation,
          scale: intensity >= 3 ? [1, 1.5, 1] : [0.8, 1.2, 0.8],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Conductor's expression indicator */}
      <motion.div
        className="absolute"
        style={{
          left: `${item.x}%`,
          top: `${item.y - 25}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 12,
          fontSize: `${14 + intensity * 2}px`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: beatPhase % 2 === 0 ? [0, -5, 0] : [0, 5, 0],
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        {intensity === 1 && '🎼'}
        {intensity === 2 && '🎭'}
        {intensity >= 3 && '🎪'}
      </motion.div>
    </>
  );
});

export default BruhImage;
