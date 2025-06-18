import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageItem } from '../../types';

// Special angry person animation component for marah.png with escalating rage effects
const MarahImage = React.memo<{ item: ImageItem }>(({ item }) => {
  const [angerLevel, setAngerLevel] = useState(0); // 0: calm, 1: annoyed, 2: frustrated, 3: furious, 4: explosive
  const [isShaking, setIsShaking] = useState(false);
  const [showSteam, setShowSteam] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [angerCycle, setAngerCycle] = useState(0);

  // Escalating anger system - builds up over time
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const escalateAnger = () => {
      setAngerLevel(prev => {
        const nextLevel = (prev + 1) % 5; // Cycle through 0-4
        
        // Trigger effects based on anger level
        if (nextLevel >= 2) {
          setShowSteam(true);
          setIsShaking(true);
        }
        if (nextLevel >= 4) {
          setShowExplosion(true);
          // Reset explosion after a moment
          setTimeout(() => setShowExplosion(false), 1500);
        }
        
        return nextLevel;
      });
      
      setAngerCycle(prev => prev + 1);
    };

    // Anger escalates every 2-4 seconds
    const escalationTime = 2000 + Math.random() * 2000;
    timeout = setTimeout(escalateAnger, escalationTime);

    return () => clearTimeout(timeout);
  }, [angerCycle]);

  // Get anger-based styling
  const getAngerStyling = () => {
    const baseFilter = 'brightness(1.1) contrast(1.05)';
    
    switch (angerLevel) {
      case 0: // Calm
        return {
          filter: baseFilter,
          borderColor: 'transparent',
        };
      case 1: // Annoyed
        return {
          filter: `${baseFilter} hue-rotate(10deg)`,
          borderColor: 'rgba(255, 140, 0, 0.3)',
        };
      case 2: // Frustrated
        return {
          filter: `${baseFilter} hue-rotate(20deg) saturate(1.2)`,
          borderColor: 'rgba(255, 69, 0, 0.5)',
        };
      case 3: // Furious
        return {
          filter: `${baseFilter} hue-rotate(30deg) saturate(1.4) contrast(1.2)`,
          borderColor: 'rgba(220, 20, 60, 0.7)',
        };
      case 4: // Explosive
        return {
          filter: `${baseFilter} hue-rotate(40deg) saturate(1.6) contrast(1.3) brightness(1.3)`,
          borderColor: 'rgba(139, 0, 0, 0.9)',
        };
      default:
        return { filter: baseFilter, borderColor: 'transparent' };
    }
  };

  const angerStyling = getAngerStyling();

  return (
    <>
      {/* Steam effects from ears when angry */}
      {showSteam && angerLevel >= 2 && (
        <>
          {/* Left ear steam */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`steam-left-${i}`}
              className="absolute"
              style={{
                width: '4px',
                height: '4px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.8), rgba(200,200,200,0.4))',
                borderRadius: '50%',
                left: `${item.x - 8}%`,
                top: `${item.y - 2}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 12,
              }}
              initial={{
                opacity: 0,
                scale: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 1.5],
                y: [-20, -40, -60],
                x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 15],
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
          
          {/* Right ear steam */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`steam-right-${i}`}
              className="absolute"
              style={{
                width: '4px',
                height: '4px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.8), rgba(200,200,200,0.4))',
                borderRadius: '50%',
                left: `${item.x + 8}%`,
                top: `${item.y - 2}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 12,
              }}
              initial={{
                opacity: 0,
                scale: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 1.5],
                y: [-20, -40, -60],
                x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 15],
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                repeat: Infinity,
                delay: i * 0.3 + 0.15,
              }}
            />
          ))}
        </>
      )}

      {/* Anger veins on forehead when furious */}
      {angerLevel >= 3 && (
        <>
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`vein-${i}`}
              className="absolute"
              style={{
                width: '2px',
                height: '12px',
                background: 'linear-gradient(180deg, rgba(139, 0, 0, 0.8), rgba(220, 20, 60, 0.6))',
                borderRadius: '1px',
                left: `${item.x + (i === 0 ? -3 : 3)}%`,
                top: `${item.y - 12}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 11,
              }}
              animate={{
                scaleY: [0.5, 1.2, 0.8, 1.1],
                opacity: [0.6, 1, 0.8, 1],
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
            />
          ))}
        </>
      )}

      {/* Sweat drops when very angry */}
      {angerLevel >= 2 && (
        <>
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`sweat-${i}`}
              className="absolute"
              style={{
                width: '3px',
                height: '5px',
                background: 'radial-gradient(ellipse, rgba(135, 206, 235, 0.9), rgba(70, 130, 180, 0.7))',
                borderRadius: '50% 50% 50% 0',
                left: `${item.x + (i === 0 ? -5 : 5)}%`,
                top: `${item.y - 8}%`,
                transform: 'translate(-50%, -50%) rotate(45deg)',
                zIndex: 11,
              }}
              initial={{
                opacity: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [0, 15, 25, 30],
              }}
              transition={{
                duration: 2,
                ease: "easeIn",
                repeat: Infinity,
                delay: i * 0.5 + Math.random() * 1,
              }}
            />
          ))}
        </>
      )}

      {/* Explosion burst when explosive anger */}
      {showExplosion && angerLevel >= 4 && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`explosion-${i}`}
              className="absolute"
              style={{
                width: '8px',
                height: '8px',
                background: `linear-gradient(45deg, 
                  ${i % 3 === 0 ? '#FF4500' : i % 3 === 1 ? '#FF6347' : '#FFD700'}, 
                  ${i % 3 === 0 ? '#FF0000' : i % 3 === 1 ? '#FF1493' : '#FFA500'})`,
                borderRadius: '50%',
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 13,
              }}
              initial={{
                opacity: 1,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [1, 0.8, 0],
                scale: [0, 2, 3],
                x: Math.cos((i * 30) * Math.PI / 180) * 60,
                y: Math.sin((i * 30) * Math.PI / 180) * 60,
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      {/* Ground shake effect when explosive */}
      {showExplosion && angerLevel >= 4 && (
        <motion.div
          className="absolute"
          style={{
            width: '100px',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, rgba(139, 69, 19, 0.3), transparent)',
            left: `${item.x}%`,
            top: `${item.y + 15}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 8,
          }}
          animate={{
            scaleX: [1, 1.5, 1.2, 1.8, 1],
            opacity: [0, 0.6, 0.8, 0.4, 0],
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
        />
      )}

      {/* Main angry person image */}
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
          scale: angerLevel >= 4 ? [1, 1.1, 0.9, 1.05, 1] : 1,
          opacity: 1,
          x: isShaking && angerLevel >= 2 ? 
            [0, -2, 2, -1, 1, 0] : 0,
          y: isShaking && angerLevel >= 3 ? 
            [0, -1, 1, -1, 0] : 0,
        }}
        transition={{ 
          duration: angerLevel >= 4 ? 0.1 : 0.5,
          ease: angerLevel >= 2 ? "easeInOut" : "easeOut",
          repeat: isShaking ? Infinity : 0,
          repeatType: "reverse",
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
            ...angerStyling,
            borderRadius: '8px',
          }}
          animate={{
            scale: angerLevel >= 3 ? [1, 1.02, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            repeat: angerLevel >= 3 ? Infinity : 0,
            repeatType: "reverse",
          }}
        />
      </motion.div>

      {/* Angry symbols above head */}
      {angerLevel >= 1 && (
        <motion.div
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y - 20}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 12,
            fontSize: `${16 + angerLevel * 4}px`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0.8],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            rotate: {
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }
          }}
        >
          {angerLevel === 1 && '😠'}
          {angerLevel === 2 && '😡'}
          {angerLevel === 3 && '🤬'}
          {angerLevel >= 4 && '💢'}
        </motion.div>
      )}
    </>
  );
});

export default MarahImage;
