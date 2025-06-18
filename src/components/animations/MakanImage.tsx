import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageItem } from '../../types';

// Special eating animation component for makan.png with realistic behaviors
const MakanImage = React.memo<{ item: ImageItem }>(({ item }) => {
  const [eatingPhase, setEatingPhase] = useState<'looking' | 'reaching' | 'eating' | 'chewing' | 'satisfied'>('looking');
  const [mouthOpen, setMouthOpen] = useState(false);
  const [chewCount, setChewCount] = useState(0);
  
  // Realistic eating sequence with automatic phase progression
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const progressEating = () => {
      switch (eatingPhase) {
        case 'looking':
          timeout = setTimeout(() => setEatingPhase('reaching'), 1500);
          break;
        case 'reaching':
          timeout = setTimeout(() => setEatingPhase('eating'), 2000);
          break;
        case 'eating':
          timeout = setTimeout(() => {
            setEatingPhase('chewing');
            setMouthOpen(true);
            setChewCount(0);
          }, 1000);
          break;
        case 'chewing':
          timeout = setTimeout(() => {
            if (chewCount < 6) {
              setMouthOpen(prev => !prev);
              setChewCount(prev => prev + 1);
            } else {
              setEatingPhase('satisfied');
              setMouthOpen(false);
            }
          }, 400);
          break;
        case 'satisfied':
          timeout = setTimeout(() => {
            setEatingPhase('looking');
            setChewCount(0);
          }, 3000);
          break;
      }
    };

    progressEating();
    return () => clearTimeout(timeout);
  }, [eatingPhase, chewCount]);

  // Animation variants for different eating phases
  const getHeadAnimation = () => {
    switch (eatingPhase) {
      case 'looking':
        return {
          rotate: [-2, 2, -2],
          scale: [1, 1.02, 1],
          y: [0, -2, 0],
        };
      case 'reaching':
        return {
          rotate: [0, -5, 0],
          scale: [1, 1.1, 1],
          y: [0, -8, 0],
        };
      case 'eating':
        return {
          rotate: [0, 3, 0],
          scale: [1, 1.05, 1],
          y: [0, 5, 0],
        };
      case 'chewing':
        return mouthOpen ? {
          rotate: [0, 1, 0],
          scale: [1, 1.03, 1],
          y: [0, 2, 0],
        } : {
          rotate: [0, -1, 0],
          scale: [1, 0.98, 1],
          y: [0, -1, 0],
        };
      case 'satisfied':
        return {
          rotate: [0, -3, 3, 0],
          scale: [1, 1.1, 1],
          y: [0, -5, 0],
        };
      default:
        return { rotate: 0, scale: 1, y: 0 };
    }
  };

  const getTransitionDuration = () => {
    switch (eatingPhase) {
      case 'looking': return 2;
      case 'reaching': return 1.5;
      case 'eating': return 0.8;
      case 'chewing': return 0.3;
      case 'satisfied': return 2.5;
      default: return 1;
    }
  };

  return (
    <>
      {/* Food particles effect during eating phases */}
      {(eatingPhase === 'eating' || eatingPhase === 'chewing') && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                backgroundColor: ['#8B4513', '#DEB887', '#F4A460', '#CD853F', '#D2691E'][Math.floor(Math.random() * 5)],
                zIndex: 12,
              }}
              initial={{
                x: `${item.x + (Math.random() - 0.5) * 5}%`,
                y: `${item.y + 2}%`,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: `${item.x + (Math.random() - 0.5) * 15}%`,
                y: `${item.y + Math.random() * 10 + 5}%`,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1.5 + Math.random(),
                ease: "easeOut",
                repeat: Infinity,
                delay: i * 0.2 + Math.random() * 0.5,
              }}
            />
          ))}
        </>
      )}

      {/* Satisfaction sparkles when satisfied */}
      {eatingPhase === 'satisfied' && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`satisfaction-${i}`}
              className="absolute"
              style={{
                width: '6px',
                height: '6px',
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                borderRadius: '50%',
                zIndex: 13,
              }}
              initial={{
                x: `${item.x}%`,
                y: `${item.y - 5}%`,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: `${item.x + Math.cos((i * 45) * Math.PI / 180) * 15}%`,
                y: `${item.y - 5 + Math.sin((i * 45) * Math.PI / 180) * 10}%`,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
                delay: i * 0.1,
              }}
            />
          ))}
        </>
      )}

      {/* Thought bubble during looking phase */}
      {eatingPhase === 'looking' && (
        <motion.div
          className="absolute flex items-center justify-center bg-white rounded-full"
          style={{
            width: '40px',
            height: '30px',
            left: `${item.x + 12}%`,
            top: `${item.y - 15}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 11,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.1, 1], 
            opacity: [0, 1, 0.8],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <span style={{ fontSize: '16px' }}>🍽️</span>
        </motion.div>
      )}

      {/* Fork/spoon reaching effect during reaching phase */}
      {eatingPhase === 'reaching' && (
        <motion.div
          className="absolute"
          style={{
            width: '30px',
            height: '4px',
            background: 'linear-gradient(90deg, #C0C0C0, #E5E5E5)',
            borderRadius: '2px',
            left: `${item.x + 15}%`,
            top: `${item.y + 5}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 11,
          }}
          initial={{ 
            rotate: -45,
            x: -20,
            y: -10,
            opacity: 0,
          }}
          animate={{ 
            rotate: [- 45, -20, -10],
            x: [-20, -5, 5],
            y: [-10, 0, 5],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Main eating person image */}
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
          scale: 1, 
          opacity: 1,
          ...getHeadAnimation(),
        }}
        transition={{ 
          duration: getTransitionDuration(),
          ease: "easeInOut",
          repeat: eatingPhase === 'chewing' ? 0 : Infinity,
          repeatType: eatingPhase === 'satisfied' ? "loop" : "reverse",
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
            filter: eatingPhase === 'satisfied' 
              ? `brightness(1.3) contrast(1.1) drop-shadow(0 4px 12px rgba(255, 193, 7, 0.4))` 
              : `brightness(1.1) contrast(1.05) drop-shadow(0 2px 6px rgba(139, 69, 19, 0.3))`,
          }}
          animate={{
            scale: eatingPhase === 'chewing' && mouthOpen ? 1.02 : 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Chewing indicator - jaw movement visualization */}
      {eatingPhase === 'chewing' && (
        <motion.div
          className="absolute"
          style={{
            width: '8px',
            height: '4px',
            background: 'rgba(139, 69, 19, 0.6)',
            borderRadius: '2px',
            left: `${item.x + 2}%`,
            top: `${item.y + 8}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 11,
          }}
          animate={{
            scaleY: mouthOpen ? 1.5 : 0.5,
            opacity: mouthOpen ? 0.8 : 0.4,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
      )}
    </>
  );
});

export default MakanImage;
