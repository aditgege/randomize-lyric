import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Spotify Embed iframe API - No configuration needed!
declare global {
  interface Window {
    onSpotifyIframeApiReady: (SpotifyIframeApi: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

const lyrics = [
  'Di seluruh tempat di seluruh dunia',
  'Di manapun lagu cinta ini terputar',
  'Ada film di kepalaku yang terputar',
  'Adegan romantis pemerannya kamu',
  'Berdiri mengantar pulang matahari',
  'Siluet tubuhmu diterpa ombak biru',
  'Menoleh padaku dalam gerak yang lambat',
  'bibirku mengucap',
  'Berjalan ke altar diantar bapakmu',
  'Tersenyum kau berjalan pelan ke arahku',
  'Di seluruh tempat',
  'Di seluruh dunia',
  'lagu cinta ini terputar',
  'film di kepalaku',
  'Adegan romantis',
  'pemerannya kamu',
  'mengantar pulang matahari',
  'Siluet tubuhmu',
  'diterpa ombak biru',
  'gerak yang lambat',
  'Berjalan ke altar',
  'diantar bapakmu',
  'Tersenyum kau berjalan',
  'pelan ke arahku'
];

// ===== EASY TEMPLATES SYSTEM =====
// 🎨 STEP 1: CUSTOMIZE TEMPLATES (Optional - these work great as-is!)
// You can change position, font, size, and effects for each template

// Define types for templates
interface LyricTemplate {
  position: { x: number; y: number };  // x,y: 0-100 (percentage of screen)
  style: { fontSize: number; fontFamily: string };  // fontSize: 1.0 = normal size
  timing: { duration: number };  // duration: seconds to show lyric
  effect?: 'underscores' | 'vertical' | 'dots' | 'mixed';  // special text effects
}

// Image system types and configuration
interface ImageItem {
  id: number;
  src: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  duration: number;
  effect: 'slide-in' | 'bounce' | 'fade-zoom' | 'spin-fall' | 'glitch' | 'pulse';
  direction: 'top' | 'bottom' | 'left' | 'right';
}

interface TimedImage {
  time: number;
  imageName: string;
  effect: ImageItem['effect'];
  direction: ImageItem['direction'];
  duration: number;
  position?: { x: number; y: number }; // Optional custom position
}

// Available images in the dean folder
// Images are loaded dynamically from TIMED_IMAGES configuration

// 🎨 IMAGE ANIMATION SYSTEM - Clean and Simple
// Each image gets its own custom animation defined below
//
// ✨ AVAILABLE ANIMATIONS:
// • matahari.png - MatahariImage: Slides in from left, slides out partially, slides back in (yo-yo effect)
// • peri.png - PrincessImage: Princess jiggle with sparkles, changing between happy/dancing/waving/spinning
// • bunga.png - BungaImage: Vertical motion from top to center to bottom with falling petals
// • ski.png - SkiingImage: Skiing motion from right to left with realistic path and snow trails
// • makan.png - MakanImage: Realistic eating sequence with phases and food particles
// • marah.png - MarahImage: Angry person with steam, shaking, and rage effects
// • bruh.png - BruhImage: Orchestra conductor with baton conducting movements and musical notes
//
// 📅 TIMING: Edit the times below to schedule when each image appears
//
// Timed image appearances - ONE ANIMATION PER IMAGE
const TIMED_IMAGES: TimedImage[] = [
  // Ski - Skiing motion at 10 seconds
  { time: 10, imageName: 'ski.png', effect: 'slide-in', direction: 'right', duration: 3000, position: { x: 20, y: 60 } },
  // Princess - Jiggle animation at 20 seconds
  { time: 20, imageName: 'peri.png', effect: 'bounce', direction: 'top', duration: 3000, position: { x: 75, y: 40 } },
  // Bunga - Sliding flower at 30 seconds
  { time: 30, imageName: 'bunga.png', effect: 'fade-zoom', direction: 'bottom', duration: 3000, position: { x: 50, y: 0 } },
  // Matahari - Rotating sun wheel at 40 seconds
  { time: 40, imageName: 'matahari.png', effect: 'slide-in', direction: 'left', duration: 3000, position: { x: 50, y: 30 } },
  // Makan - Eating person animation at 50 seconds
  { time: 50, imageName: 'makan.png', effect: 'fade-zoom', direction: 'top', duration: 4000, position: { x: 15, y: 70 } },
  // Marah - Angry person animation at 60 seconds
  { time: 60, imageName: 'marah.png', effect: 'pulse', direction: 'left', duration: 5000, position: { x: 25, y: 45 } },
  // Bruh - Orchestra conductor animation at 70 seconds
  { time: 70, imageName: 'bruh.png', effect: 'fade-zoom', direction: 'right', duration: 6000, position: { x: 80, y: 35 } },
  
];

// TEMPLATE CONFIGURATIONS
const LYRIC_TEMPLATES: Record<string, LyricTemplate> = {
  // Template 1: Big Impact Text (center screen, large font)
  bigImpact: {
    position: { x: 50, y: 40 }, // Center-ish position
    style: { fontSize: 3.0, fontFamily: 'Impact, sans-serif' },
    timing: { duration: 6 }
  },
  
  // Template 2: Typewriter Effect (left side, monospace)
  typewriter: {
    position: { x: 25, y: 30 },
    style: { fontSize: 1.5, fontFamily: 'font-mono' },
    timing: { duration: 4 },
    effect: 'underscores' // Will add underscores automatically
  },
  
  // Template 3: Vertical Letters (right side)
  vertical: {
    position: { x: 80, y: 25 },
    style: { fontSize: 2.0, fontFamily: 'Georgia, serif' },
    timing: { duration: 8 },
    effect: 'vertical' // Will split letters vertically
  },
  
  // Template 4: Floating Text (random position, elegant)
  floating: {
    position: { x: 60, y: 65 },
    style: { fontSize: 1.8, fontFamily: 'Palatino, serif' },
    timing: { duration: 5 }
  },
  
  // Template 5: Small Subtitle (bottom area)
  subtitle: {
    position: { x: 30, y: 80 },
    style: { fontSize: 1.2, fontFamily: 'Helvetica, sans-serif' },
    timing: { duration: 3 }
  },
  
  // Template 6: Mixed Effects (special animated text)
  mixed: {
    position: { x: 40, y: 60 },
    style: { fontSize: 2.2, fontFamily: 'Courier New, monospace' },
    timing: { duration: 7 },
    effect: 'mixed'
  },
  
  // Template 7: Dots Effect (suspenseful text)
  dots: {
    position: { x: 70, y: 50 },
    style: { fontSize: 1.6, fontFamily: 'Times, serif' },
    timing: { duration: 4 },
    effect: 'dots'
  }
};

// EASY LYRICS SETUP - Just fill in your lyrics and choose templates!
// 🎵 STEP 2: ADD YOUR LYRICS HERE! This is where you customize everything!

interface EasyLyric {
  time: number;    // When to show (seconds from start)
  text: string;    // Your lyric text  
  template: keyof typeof LYRIC_TEMPLATES;  // Which template to use
}

const EASY_LYRICS: EasyLyric[] = [
  // Example lyrics - REPLACE THESE WITH YOUR ACTUAL SONG LYRICS AND TIMING
  { time: 26, text: "Di seluruh tempat di seluruh dunia", template: "bigImpact" },
  { time: 29, text: "Di manapun lagu cinta ini terputar", template: "typewriter" },
  { time: 32, text: "Ada film di kepalaku yang terputar", template: "floating" },
  { time: 35, text: "Adegan romantis pemerannya kamu", template: "subtitle" },
  { time: 38, text: "Di seluruh tempat di seluruh dunia", template: "typewriter" },
  { time: 42, text: "Di manapun lagu cinta ini terputar", template: "floating" },
  { time: 44, text: "Ada film di kepalaku yang terputar", template: "floating" },
  { time: 48, text: "Adegan romantis pemerannya kamu", template: "bigImpact" },
  { time: 50, text: "Berdiri..", template: "subtitle" },
  { time: 53, text: "mengantar..", template: "subtitle" },
  { time: 56, text: "pulang..", template: "subtitle" },
  { time: 59, text: "matahari...", template: "subtitle" },
  { time: 62, text: "Siluet...", template: "subtitle" },
  { time: 65, text: "tubuhmu", template: "bigImpact" },
  { time: 68, text: "diterpa", template: "typewriter" },
  { time: 71, text: "Ombak", template: "bigImpact" },
  { time: 74, text: "biru", template: "mixed" },
  { time: 75, text: "Di seluruh tempat di seluruh dunia", template: "typewriter" },
  { time: 77, text: "Di manapun lagu cinta ini terputar", template: "floating" },
  { time: 81, text: "Ada film di kepalaku yang terputar", template: "floating" },
  { time: 84, text: "Adegan romantis pemerannya kamu", template: "subtitle" },
  { time: 87, text: "Di seluruh tempat di seluruh dunia", template: "bigImpact" },
  { time: 90, text: "Di manapun lagu cinta ini terputar", template: "dots" },
  { time: 92, text: "Ada film di kepalaku yang terputar", template: "floating" },
  { time: 95, text: "Adegan romantis pemerannya kamu", template: "subtitle" },
  { time: 98, text: "Menoleh", template: "typewriter" },
  { time: 101, text: "padaku..", template: "typewriter" },
  { time: 105, text: "dalam gerak yang lambat", template: "typewriter" },
  { time: 109, text: "bibirku mengucap", template: "dots" },
  { time: 126, text: "Di seluruh tempat di seluruh dunia", template: "dots" },
  { time: 129, text: "Di manapun lagu cinta ini terputar", template: "bigImpact" },
  { time: 132, text: "Ada film di kepalaku yang terputar", template: "floating" },
  { time: 134, text: "Adegan romantis pemerannya kamu", template: "subtitle" },
  { time: 137, text: "Di seluruh tempat di seluruh dunia", template: "dots" },
  { time: 140, text: "Di manapun lagu cinta ini terputar", template: "bigImpact" },
  { time: 143, text: "Ada film di kepalaku yang terputar", template: "floating" },
  { time: 146, text: "Adegan romantis pemerannya kamu", template: "subtitle" },
  { time: 149, text: "Berjalan..", template: "bigImpact" },
  { time: 152, text: "ke altar", template: "mixed" },
  { time: 156, text: "diantar..", template: "subtitle" },
  { time: 159, text: "Bapakmu..", template: "subtitle" },
  { time: 161, text: "Tersenyum", template: "mixed" },
  { time: 165, text: "kau berjalan..", template: "dots" },
  { time: 168, text: "pelan", template: "bigImpact" },
  { time: 170, text: "ke arahku", template: "subtitle" }
];

// Helper function to create glitch effect text
const createGlitchEffect = (text: string): string => {
  const glitchChars = ['█', '▓', '▒', '░', '▀', '▄', '▌', '▐', '■', '□', '▪', '▫', '●', '○', '◆', '◇', '◼', '◻'];
  const lines: string[] = [];
  
  // Create 3 layers of glitch effect
  for (let layer = 0; layer < 3; layer++) {
    let glitchedLine = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const rand = Math.random();
      
      if (char === ' ') {
        glitchedLine += '   '; // Keep spaces as gaps
      } else if (rand < 0.3) {
        // Replace with glitch character
        glitchedLine += glitchChars[Math.floor(Math.random() * glitchChars.length)];
      } else if (rand < 0.5) {
        // Duplicate character
        glitchedLine += char + char;
      } else if (rand < 0.7) {
        // Add noise around character
        glitchedLine += glitchChars[Math.floor(Math.random() * 4)] + char + glitchChars[Math.floor(Math.random() * 4)];
      } else {
        // Keep original character
        glitchedLine += char;
      }
    }
    
    lines.push(glitchedLine);
  }
  
  return lines.join('\n');
};

// Auto-generate timedLyrics from easy setup
const timedLyrics = EASY_LYRICS.map(lyric => {
  const template = LYRIC_TEMPLATES[lyric.template];
  
  let processedText = lyric.text;
  
  // Apply text effects based on template
  if (template.effect === 'underscores') {
    processedText = lyric.text.replace(/\s/g, '___');
  } else if (template.effect === 'vertical') {
    processedText = lyric.text.split('').join('\n');
  } else if (template.effect === 'dots') {
    processedText = lyric.text + '...';
  } else if (template.effect === 'mixed') {
    // Convert to glitch effect style
    processedText = createGlitchEffect(lyric.text);
  }
  
  return {
    time: lyric.time,
    text: processedText,
    x: template.position.x,
    y: template.position.y,
    fontSize: template.style.fontSize,
    fontFamily: template.style.fontFamily,
    duration: template.timing.duration,
    effect: template.effect || 'normal'
  };
});

interface LyricItem {
  id: number;
  text: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  reversed: boolean;
  fontSize: number;
  blur: number;
  skew: number;
  duration: number;
  fontFamily: string;
}

const fontFamilies = [
  'font-mono',
  'font-serif',
  'font-sans',
  'font-mono',
  'font-serif',
  'font-sans'
];

const customFonts = [
  'Arial, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Helvetica, sans-serif',
  'Courier New, monospace',
  'Verdana, sans-serif',
  'Impact, sans-serif',
  'Comic Sans MS, cursive',
  'Trebuchet MS, sans-serif',
  'Palatino, serif',
  'Garamond, serif',
  'Futura, sans-serif'
];

// Memoized lyric component to prevent unnecessary re-renders
const LyricComponent = React.memo<{ item: LyricItem; style: React.CSSProperties }>(
  ({ item, style }) => (
    <div
      className={`text-white select-none z-999 ${item.fontFamily.startsWith('font-') ? item.fontFamily : ''}`}
      style={style}
    >
      {item.text}
    </div>
  )
);

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
        zIndex: 1, // Behind other content
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
          className="absolute rounded-full"
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

// MatahariImage component for timed appearances (keeps existing behavior)
const MatahariImage = React.memo<{ item: ImageItem }>(({ item }) => {
  // item parameter is required by interface but not used in wheel animation
  return <MatahariWheel />;
});

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

// Regular image component for other images
const RegularImage = React.memo<{ item: ImageItem; style: React.CSSProperties }>(({ item, style }) => (
  <img
    key={item.id}
    src={item.src}
    alt=""
    style={style}
    className="select-none z-999"
  />
));

// Enhanced asset preloader with progress tracking and comprehensive loading
const useAssetLoader = (imageNames: string[]) => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = imageNames.length + 2; // Images + Spotify API + fonts
    
    const updateProgress = (increment: number, status: string) => {
      loadedCount += increment;
      const progress = (loadedCount / totalAssets) * 100;
      setLoadingProgress(progress);
      setLoadingStatus(status);
      
      if (loadedCount >= totalAssets) {
        // Small delay for smooth transition
        setTimeout(() => {
          setAssetsLoaded(true);
        }, 500);
      }
    };

    // Preload images
    setLoadingStatus('Loading images...');
    const imagePromises = imageNames.map((name) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          updateProgress(1, `Loaded ${name}`);
          resolve();
        };
        img.onerror = () => {
          updateProgress(1, `Failed to load ${name}`);
          resolve(); // Continue even if image fails
        };
        img.src = `/dean/${name}`;
      });
    });

    // Preload fonts
    const loadFonts = () => {
      return new Promise<void>((resolve) => {
        setLoadingStatus('Loading fonts...');
        // Create hidden elements with various fonts to trigger loading
        const fontFamilies = [
          'Impact, sans-serif',
          'Georgia, serif',
          'Courier New, monospace',
          'Helvetica, sans-serif',
          'Times New Roman, serif',
          'Palatino, serif'
        ];
        
        const fontTestDiv = document.createElement('div');
        fontTestDiv.style.position = 'absolute';
        fontTestDiv.style.visibility = 'hidden';
        fontTestDiv.style.fontSize = '1px';
        fontTestDiv.innerHTML = fontFamilies.map(font => 
          `<span style="font-family: ${font}">Test</span>`
        ).join('');
        
        document.body.appendChild(fontTestDiv);
        
        // Allow time for fonts to load
        setTimeout(() => {
          document.body.removeChild(fontTestDiv);
          updateProgress(1, 'Fonts loaded');
          resolve();
        }, 1000);
      });
    };

    // Load Spotify API readiness
    const loadSpotifyAPI = () => {
      return new Promise<void>((resolve) => {
        setLoadingStatus('Preparing Spotify integration...');
        // Check if Spotify script is already loaded or load it
        const existingScript = document.querySelector('script[src*="spotify.com/embed/iframe-api"]');
        if (existingScript) {
          updateProgress(1, 'Spotify API ready');
          resolve();
        } else {
          setTimeout(() => {
            updateProgress(1, 'Spotify API ready');
            resolve();
          }, 500);
        }
      });
    };

    // Load all assets
    Promise.all([
      ...imagePromises,
      loadFonts(),
      loadSpotifyAPI()
    ]).then(() => {
      setLoadingStatus('Ready to rock! 🎵');
    });

  }, [imageNames]);

  return { assetsLoaded, loadingProgress, loadingStatus };
};

// Legacy hook for backward compatibility
const usePreloadedImages = (imageNames: string[]) => {
  const { assetsLoaded } = useAssetLoader(imageNames);
  return assetsLoaded;
};

// Loading screen component
const LoadingScreen = React.memo<{ loadingProgress: number; loadingStatus: string }>(({ loadingProgress, loadingStatus }) => (
  <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black">
    {/* Animated background - monochrome */}
    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/30 to-white/10" />
    
    {/* Background noise effect - monochrome */}
    <div 
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
        backgroundSize: '20px 20px',
        animation: 'noise 0.1s infinite'
      }}
    />
    
    {/* Loading content */}
    <div className="relative z-10 max-w-md p-8 text-center">
      {/* Main loader */}
      <div className="mb-8">
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Outer ring - monochrome */}
          <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
          
          {/* Progress ring - monochrome */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="url(#monochrome-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - loadingProgress / 100)}`}
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient id="monochrome-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#A3A3A3" />
                <stop offset="100%" stopColor="#525252" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-white">
                {Math.round(loadingProgress)}%
              </div>
              <div className="text-xs text-gray-400">
                LOADING
              </div>
            </div>
          </div>
          
          {/* Pulsing effect - monochrome */}
          <div className="absolute inset-0 border-4 rounded-full border-white/20 animate-ping"></div>
        </div>
        
      </div>
      
      {/* Status and progress */}
      <div className="space-y-4">
        {/* Progress bar - monochrome */}
        <div className="w-full h-2 overflow-hidden bg-gray-800 rounded-full">
          <div 
            className="h-full transition-all duration-300 ease-out bg-gradient-to-r from-white via-gray-300 to-gray-600"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        
        {/* Status text */}
        <div className="font-mono text-sm text-gray-300">
          {loadingStatus}
        </div>
        
        {/* Loading dots animation - monochrome */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
    
    {/* Background particles - monochrome */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-gray-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
    
    {/* Additional CSS for loading screen */}
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
      }
      
      @keyframes noise {
        0% { transform: translate3d(0, 0, 0); }
        10% { transform: translate3d(-1px, -1px, 0); }
        20% { transform: translate3d(1px, -1px, 0); }
        30% { transform: translate3d(-1px, 1px, 0); }
        40% { transform: translate3d(1px, 1px, 0); }
        50% { transform: translate3d(-1px, -1px, 0); }
        60% { transform: translate3d(1px, -1px, 0); }
        70% { transform: translate3d(-1px, 1px, 0); }
        80% { transform: translate3d(1px, 1px, 0); }
        90% { transform: translate3d(-1px, -1px, 0); }
        100% { transform: translate3d(0, 0, 0); }
      }
    `}</style>
  </div>
));

// Main App Component - wrapper that handles loading
function App() {
  const imageNames = useMemo(() => TIMED_IMAGES.map((img) => img.imageName), []);
  const { assetsLoaded, loadingProgress, loadingStatus } = useAssetLoader(imageNames);

  // Show loading screen until all assets are loaded
  if (!assetsLoaded) {
    return <LoadingScreen loadingProgress={loadingProgress} loadingStatus={loadingStatus} />;
  }

  // Once loaded, render the main app
  return <MainApp />;
}

// Main App Logic Component (previously the main App function)
function MainApp() {
  const imageNames = useMemo(() => TIMED_IMAGES.map((img) => img.imageName), []);
  const imagesLoaded = usePreloadedImages(imageNames);

  const [lyricItems, setLyricItems] = useState<LyricItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [syncMode, setSyncMode] = useState<'random' | 'timed'>('timed');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isListeningForSpotify, setIsListeningForSpotify] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedAtTime, setPausedAtTime] = useState<number | null>(null);
  
  // Image state
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  
  // Spotify Embed iframe API state
  const embedRef = useRef(null);
  const spotifyEmbedControllerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [iFrameAPI, setIFrameAPI] = useState<any>(undefined); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [uri] = useState("spotify:track:4s8W4gutSQnFIDNThqUPSI");
  const [isSpotifyPlaying, setIsSpotifyPlaying] = useState(false);

  // Load Spotify iframe API
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize Spotify iframe API
  useEffect(() => {
    if (iFrameAPI) {
      return;
    }

    window.onSpotifyIframeApiReady = (SpotifyIframeApi) => {
      setIFrameAPI(SpotifyIframeApi);
    };
  }, [iFrameAPI]);

  // Create Spotify embed controller
  useEffect(() => {
    if (playerLoaded || iFrameAPI === undefined) {
      return;
    }

    iFrameAPI.createController(
      embedRef.current,
      {
        width: "100%",
        height: "152",
        uri: uri,
      },
      (spotifyEmbedController: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        spotifyEmbedController.addListener("ready", () => {
          setPlayerLoaded(true);
        });

        const handlePlaybackUpdate = (e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const { position, duration, isBuffering, isPaused, playingURI } = e.data;
          
          setIsSpotifyPlaying(!isPaused && !isBuffering);
          
          // Clear lyrics if song stops (position is 0 and paused)
          if (position === 0 && isPaused && syncMode === 'timed') {
            setLyricItems([]);
            setCurrentTime(0);
            setStartTime(null);
            setIsPlaying(false);
            setIsPaused(false);
            setPausedAtTime(null);
          }
          
          // Auto-sync with lyrics in timed mode
          if (syncMode === 'timed' && !isPaused && !isBuffering) {
            const positionInSeconds = position / 1000;
            
            // Only auto-sync if we haven't manually set pause/resume state
            // or if the time difference is too large (seeking happened)
            if (!isPaused && (!isPlaying || Math.abs(currentTime - positionInSeconds) > 2)) {
              setCurrentTime(positionInSeconds);
              setStartTime(Date.now() - position);
              setIsPlaying(true);
              setIsPaused(false);
            }
          } else if (syncMode === 'timed' && isPaused && isPlaying) {
            // Spotify paused, so pause lyrics too but keep position
            setIsPaused(true);
            setPausedAtTime(currentTime);
            setIsPlaying(false);
          }
          
        };

        spotifyEmbedController.addListener("playback_update", handlePlaybackUpdate);

        spotifyEmbedController.addListener("playback_started", (e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const { playingURI } = e.data;
          console.log(`The playback has started for: ${playingURI}`);
          
          // Auto-start lyrics in timed mode
          if (syncMode === 'timed') {
            setIsPlaying(true);
          }
        });

        spotifyEmbedControllerRef.current = spotifyEmbedController;
      }
    );

    return () => {
      if (spotifyEmbedControllerRef.current) {
        spotifyEmbedControllerRef.current.removeListener("playback_update");
      }
    };
  }, [playerLoaded, iFrameAPI, uri, syncMode, isPlaying, currentTime]);

  // Spotify control functions
  const onPauseClick = useCallback(() => {
    if (spotifyEmbedControllerRef.current) {
      spotifyEmbedControllerRef.current.pause();
    }
    // Pause lyrics and save current position
    setIsPaused(true);
    setPausedAtTime(currentTime);
    setIsPlaying(false);
  }, [currentTime]);

  const onPlayClick = useCallback(() => {
    if (spotifyEmbedControllerRef.current) {
      spotifyEmbedControllerRef.current.play();
    }
    // Resume lyrics from saved position
    if (syncMode === 'timed') {
      if (isPaused && pausedAtTime !== null) {
        // Resume from paused position
        setCurrentTime(pausedAtTime);
        setStartTime(Date.now() - (pausedAtTime * 1000));
        setIsPaused(false);
        setPausedAtTime(null);
      } else if (startTime === null) {
        // First time playing - start from beginning
        setStartTime(Date.now());
        setCurrentTime(0);
        setIsPaused(false);
        setPausedAtTime(null);
      } else {
        // Manual resume - maintain current timing
        setStartTime(Date.now() - (currentTime * 1000));
        setIsPaused(false);
        setPausedAtTime(null);
      }
      setIsPlaying(true);
    }
  }, [syncMode, startTime, currentTime, isPaused, pausedAtTime]);

  const getRandomLyric = useCallback((): LyricItem => {
    const originalText = lyrics[Math.floor(Math.random() * lyrics.length)];
    
    // Add typewriter effects randomly
    const effects = [
      // Normal text
      originalText,
      // Add underscores for pauses
      originalText.replace(/\s/g, Math.random() > 0.7 ? '___' : '_'),
      // Add dots for trailing effect
      originalText + '...',
      originalText + '.....',
      // Mix of both
      originalText.replace(/\s/g, Math.random() > 0.5 ? '__' : '_') + '...',
      // Vertical letter spacing - split into individual letters with line breaks
      originalText.split('').join('\n'),
      // Vertical with spaces between letters
      originalText.split('').join('\n\n'),
      // Mixed vertical - some words vertical, some horizontal
      originalText.split(' ').map(word => 
        Math.random() > 0.5 ? word.split('').join('\n') : word
      ).join('  ')
    ];
    
    const styledText = effects[Math.floor(Math.random() * effects.length)];
    
    return {
      id: Date.now() + Math.random(),
      text: styledText,
      x: Math.random() * 80 + 10, // 10-90% from left
      y: Math.random() * 80 + 10, // 10-90% from top
      rotation: 0, // Remove rotation
      scale: Math.random() * 0.8 + 0.5, // Smaller scale: 0.5 to 1.3
      opacity: Math.random() * 0.6 + 0.4,
      reversed: false, // Remove reversed effect
      fontSize: Math.random() * 1.5 + 0.8, // Smaller font: 0.8rem to 2.3rem
      blur: Math.random() * 1, // Reduced blur: 0 to 1px
      skew: Math.random() * 20 - 10, // Reduced skew: -10 to 10 degrees
      duration: Math.random() * 3 + 2,
      fontFamily: Math.random() > 0.5 ? 
        fontFamilies[Math.floor(Math.random() * fontFamilies.length)] :
        customFonts[Math.floor(Math.random() * customFonts.length)]
    };
  }, []);

  const getCurrentTimedLyric = useCallback((time: number): LyricItem | null => {
    // Find the appropriate lyric for the current time
    const currentLyric = timedLyrics
      .filter(lyric => time >= lyric.time)
      .pop(); // Get the most recent lyric

    if (!currentLyric) return null; // No lyric to show at this time
    
    return {
      id: currentLyric.time, // Use time as ID for consistency
      text: currentLyric.text, // Use exact text from timedLyrics
      x: currentLyric.x, // Use hardcoded X position
      y: currentLyric.y, // Use hardcoded Y position
      rotation: 0,
      scale: 1, // Fixed scale
      opacity: 0.9, // Fixed opacity for better visibility
      reversed: false,
      fontSize: currentLyric.fontSize, // Use hardcoded font size
      blur: 0, // No blur for cleaner text
      skew: 0, // No skew for cleaner text
      duration: currentLyric.duration, // Use hardcoded duration
      fontFamily: currentLyric.fontFamily // Use hardcoded font family
    };
  }, []);

  // Image helper functions
  const createImageItem = useCallback((timedImage: TimedImage): ImageItem => {
    const getStartPosition = (direction: ImageItem['direction']) => {
      switch (direction) {
        case 'top': return { x: Math.random() * 80 + 10, y: -10 };
        case 'bottom': return { x: Math.random() * 80 + 10, y: 110 };
        case 'left': return { x: -10, y: Math.random() * 80 + 10 };
        case 'right': return { x: 110, y: Math.random() * 80 + 10 };
        default: return { x: 50, y: 50 };
      }
    };

    const startPos = timedImage.position || getStartPosition(timedImage.direction);
    
    return {
      id: Date.now() + Math.random(),
      src: `/dean/${timedImage.imageName}`,
      x: startPos.x,
      y: startPos.y,
      scale: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
      rotation: Math.random() * 360,
      opacity: 0,
      duration: timedImage.duration,
      effect: timedImage.effect,
      direction: timedImage.direction
    };
  }, []);

  // Clear lyrics when mode changes or when resetting
  useEffect(() => {
    setLyricItems([]);
    setImageItems([]); // Also clear images
    // Reset timing state when switching modes
    if (syncMode === 'random') {
      setCurrentTime(0);
      setStartTime(null);
      setIsPlaying(false);
    }
  }, [syncMode]);

  // Clear lyrics when reset happens (startTime becomes null)
  useEffect(() => {
    if (startTime === null && syncMode === 'timed') {
      setLyricItems([]);
      setImageItems([]); // Also clear images
    }
  }, [startTime, syncMode]);

  // Auto-start detection for Spotify (simplified)
  useEffect(() => {
    if (syncMode === 'timed' && isListeningForSpotify) {
      const checkForSpotifyPlayback = () => {
        // This simulates detecting when Spotify starts playing
        // In a real implementation, you'd use Spotify Web Playback SDK
        
        // For now, we'll auto-start after a short delay when listening is enabled
        if (!isPlaying && !startTime) {
          console.log('Auto-starting lyrics sync...');
          setStartTime(Date.now());
          setIsPlaying(true);
        }
      };

      const timeout = setTimeout(checkForSpotifyPlayback, 1000);
      return () => clearTimeout(timeout);
    }
  }, [syncMode, isListeningForSpotify, isPlaying, startTime]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (syncMode === 'timed') {
          if (!isPlaying) {
            // Use the same logic as onPlayClick
            if (isPaused && pausedAtTime !== null) {
              // Resume from paused position
              setCurrentTime(pausedAtTime);
              setStartTime(Date.now() - (pausedAtTime * 1000));
              setIsPaused(false);
              setPausedAtTime(null);
            } else if (startTime === null) {
              // First time playing - start from beginning
              setStartTime(Date.now());
              setCurrentTime(0);
              setIsPaused(false);
              setPausedAtTime(null);
            } else {
              // Manual resume - maintain current timing
              setStartTime(Date.now() - (currentTime * 1000));
              setIsPaused(false);
              setPausedAtTime(null);
            }
            setIsPlaying(true);
            // Also play Spotify if available
            if (spotifyEmbedControllerRef.current) {
              spotifyEmbedControllerRef.current.play();
            }
          } else {
            // Use the same logic as onPauseClick
            setIsPaused(true);
            setPausedAtTime(currentTime);
            setIsPlaying(false);
            // Also pause Spotify if available
            if (spotifyEmbedControllerRef.current) {
              spotifyEmbedControllerRef.current.pause();
            }
          }
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        if (syncMode === 'timed') {
          // Reset everything to beginning
          setCurrentTime(0);
          setStartTime(null);
          setIsPlaying(false);
          setLyricItems([]);
          setImageItems([]); // Also clear images
          setIsPaused(false);
          setPausedAtTime(null);
          // Also pause Spotify if available
          if (spotifyEmbedControllerRef.current) {
            spotifyEmbedControllerRef.current.pause();
          }
        }
      } else if (e.code === 'KeyL' && syncMode === 'timed') {
        e.preventDefault();
        setIsListeningForSpotify(!isListeningForSpotify);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [syncMode, isPlaying, startTime, currentTime, isListeningForSpotify, isPaused, pausedAtTime]);

  useEffect(() => {
                         const timeouts = new Set<number>();
    
    if (syncMode === 'random') {
      // Original random mode
      const addLyric = () => {
        const newLyric = getRandomLyric();
        setLyricItems(prev => {
          if (prev.length > 15) {
            return [...prev.slice(1), newLyric];
          }
          return [...prev, newLyric];
        });

        const timeout = setTimeout(() => {
          setLyricItems(prev => prev.filter(item => item.id !== newLyric.id));
          timeouts.delete(timeout);
        }, newLyric.duration * 1000);
        
        timeouts.add(timeout);
      };

      for (let i = 0; i < 3; i++) {
        const timeout = setTimeout(() => addLyric(), i * 500);
        timeouts.add(timeout);
      }

      const interval = setInterval(addLyric, 800);

      return () => {
        clearInterval(interval);
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    } else {
      // Timed mode - show one lyric at a time
      const updateTime = () => {
        if (isPlaying && startTime) {
          const elapsed = (Date.now() - startTime) / 1000;
          setCurrentTime(elapsed);
          
          // Get the current lyric that should be displayed
          const currentLyric = getCurrentTimedLyric(elapsed);
          
          // Update lyrics - only show the current one
          setLyricItems(prev => {
            // If no current lyric, clear all
            if (!currentLyric) {
              return [];
            }
            
            // If we already have this lyric displayed, keep it
            const existingLyric = prev.find(item => item.id === currentLyric.id);
            if (existingLyric) {
              return prev; // Keep the same lyric
            }
            
            // Replace all lyrics with the new current lyric
            return [currentLyric];
          });

          // Update images based on current time
          setImageItems(prev => {
            const newImages: ImageItem[] = [];
            
            // Check for new images that should appear
            TIMED_IMAGES.forEach(timedImage => {
              const imageStartTime = timedImage.time;
              const imageEndTime = timedImage.time + timedImage.duration;
              
              // If we're in the time window for this image
              if (elapsed >= imageStartTime && elapsed <= imageEndTime) {
                // Check if this image is already displayed
                const existingImage = prev.find(img => img.src === `/dean/${timedImage.imageName}` && 
                  Math.abs(img.id - (imageStartTime * 1000)) < 100);
                
                if (!existingImage) {
                  // Create new image
                  const newImage = createImageItem(timedImage);
                  newImage.id = imageStartTime * 1000; // Use timestamp as consistent ID
                  newImages.push(newImage);
                }
              }
            });
            
            // Keep existing images that are still in their time window
            const keepImages = prev.filter(img => {
              const matchingTimedImage = TIMED_IMAGES.find(ti => `/dean/${ti.imageName}` === img.src);
              if (!matchingTimedImage) return false;
              
              const imageEndTime = matchingTimedImage.time + matchingTimedImage.duration;
              return elapsed <= imageEndTime;
            });
            
            return [...keepImages, ...newImages];
          });
        }
      };

      const interval = setInterval(updateTime, 100); // Check every 100ms

      return () => {
        clearInterval(interval);
      };
    }
  }, [getRandomLyric, getCurrentTimedLyric, syncMode, isPlaying, startTime]);

  const getLyricStyle = useCallback((item: LyricItem) => {
    // Pre-calculate random values to avoid recalculation on every render
    const fontWeight = item.id % 2 === 0 ? 'bold' : 'normal';
    const fontStyle = item.id % 7 === 0 ? 'italic' : 'normal';
    const textShadow = item.id % 3 === 0 ? '0 0 15px rgba(255,255,255,0.4)' : 'none';
    const letterSpacing = `${(item.id % 3) * 0.05}rem`; // Reduced letter spacing
    
    // Check if text contains line breaks (vertical layout)
    const hasLineBreaks = item.text.includes('\n');
    const writingMode = hasLineBreaks ? 'horizontal-tb' as const : 
                      (item.id % 10 === 0 ? 'vertical-rl' as const : 'horizontal-tb' as const);

    // Adjust positioning for vertical text to prevent going off screen
    let adjustedY = item.y;
    let transformY = -50; // Default center transform
    
    if (hasLineBreaks) {
      // For vertical text, estimate height and adjust position
      const lineCount = item.text.split('\n').length;
      const estimatedHeight = lineCount * item.fontSize * 1.2; // Rough estimate
      const screenHeightPercent = (estimatedHeight / window.innerHeight) * 100;
      
      // If text would go off top of screen, adjust position
      if (adjustedY - (screenHeightPercent / 2) < 5) {
        adjustedY = Math.max(screenHeightPercent / 2 + 5, 15); // Keep at least 5% from top
        transformY = -50; // Keep centered transform
      }
      
      // If text would go off bottom, also adjust
      if (adjustedY + (screenHeightPercent / 2) > 95) {
        adjustedY = Math.min(95 - (screenHeightPercent / 2), 85); // Keep at least 5% from bottom
      }
    }

    return {
      position: 'absolute' as const,
      left: `${item.x}%`,
      top: `${adjustedY}%`,
      transform: `
        translate(-50%, ${transformY}%) 
        scale(${item.scale}) 
        skew(${item.skew}deg)
      `,
      opacity: item.opacity,
      fontSize: `${item.fontSize}rem`,
      filter: `blur(${item.blur}px)`,
      transition: `all ${item.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      fontWeight,
      fontStyle,
      textShadow,
      letterSpacing: hasLineBreaks ? '0' : letterSpacing, // No letter spacing for vertical text
      writingMode,
      userSelect: 'none' as const,
      pointerEvents: 'none' as const,
      fontFamily: item.fontFamily.startsWith('font-') ? undefined : item.fontFamily,
      willChange: 'transform, opacity',
      whiteSpace: hasLineBreaks ? 'pre-line' as const : 'nowrap' as const, // Allow line breaks
      textAlign: hasLineBreaks ? 'center' as const : 'left' as const, // Center align vertical text
      lineHeight: hasLineBreaks ? '0.8' : 'normal', // Tighter line height for vertical text
      zIndex: 1000, // Ensure lyrics are always above any other element
    };
  }, []);

  // Simple image styling function for regular images (non-animated)
  const getImageStyle = useCallback((item: ImageItem) => {
    return {
      position: 'absolute' as const,
      left: `${item.x}%`,
      top: `${item.y}%`,
      transform: `translate(-50%, -50%) scale(${item.scale}) rotate(${item.rotation}deg)`,
      opacity: item.opacity,
      zIndex: 10,
      maxWidth: '150px',
      maxHeight: '150px',
      objectFit: 'contain' as const,
      pointerEvents: 'none' as const,
      willChange: 'transform, opacity',
    };
  }, []);

  // Memoize background styles to prevent recalculation
  const backgroundNoiseStyle = useMemo(() => ({
    backgroundImage: `
      radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)
    `,
    backgroundSize: '20px 20px',
    animation: 'noise 0.1s infinite'
  }), []);

  const backgroundGradientStyle = useMemo(() => ({
    background: `
      linear-gradient(45deg, 
        rgba(255,0,150,0.1) 0%, 
        rgba(0,255,255,0.1) 25%, 
        rgba(255,255,0,0.1) 50%, 
        rgba(150,0,255,0.1) 75%, 
        rgba(255,0,150,0.1) 100%
      )
    `,
    backgroundSize: '400% 400%',
    animation: 'gradientShift 8s ease infinite'
  }), []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* style={{ background: 'url(/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} */}
      {/* Dark overlay to make background darker */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Matahari wheel background */}
      <MatahariWheel />
      
      {/* Background noise effect */}
      <div 
        className="absolute inset-0 opacity-10"
        style={backgroundNoiseStyle}
      />
      
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={backgroundGradientStyle}
      />

      {/* Lyrics */}
      {lyricItems.map((item) => (
        <LyricComponent
          key={item.id}
          item={item}
          style={getLyricStyle(item)}
        />
      ))}

      {/* Images */}
      <AnimatePresence>
        {imageItems.map((item) => {
          // Special skiing animation for ski.png
          if (item.src.includes('ski.png')) {
            return <SkiingImage key={item.id} item={item} />;
          }
          
          // Special princess animation for peri.png
          if (item.src.includes('peri.png')) {
            return <PrincessImage key={item.id} item={item} />;
          }
          
          // Special sun slide animation for matahari.png
          if (item.src.includes('matahari.png')) {
            return <MatahariImage key={item.id} item={item} />;
          }
          
          // Special vertical motion animation for bunga.png
          if (item.src.includes('bunga.png')) {
            return <BungaImage key={item.id} item={item} imagesPreloaded={imagesLoaded} />;
          }
          
          // Special eating animation for makan.png
          if (item.src.includes('makan.png')) {
            return <MakanImage key={item.id} item={item} />;
          }
          
          // Special angry person animation for marah.png
          if (item.src.includes('marah.png')) {
            return <MarahImage key={item.id} item={item} />;
          }
          
          // Special orchestra conductor animation for bruh.png
          if (item.src.includes('bruh.png')) {
            return <BruhImage key={item.id} item={item} />;
          }
          
          // Regular animation for other images
          return (
            <RegularImage
              key={item.id}
              item={item}
              style={getImageStyle(item)}
            />
          );
        })}
      </AnimatePresence>

      {/* Spotify Embed Player */}
      <div className="absolute z-10 transition-opacity duration-300 transform -translate-x-1/2 bottom-6 left-1/2 opacity-10 hover:opacity-100">
          {/* Embed Container */}
          <div className="mt-4">
            <div ref={embedRef} className="w-full" />
          </div>
      </div>

      {/* Control Panel */}
      <div className="absolute z-10 transform -translate-x-1/2 top-6 left-1/2">
        <div className="flex gap-3 p-3 ">
          {/* Mode Toggle */}
          <button
            onClick={() => setSyncMode(syncMode === 'random' ? 'timed' : 'random')}
            className={`px-4 py-2 text-sm font-light transition-colors duration-200 ${
              syncMode === 'timed' 
                ? 'text-white bg-white/10 border-b-2 border-white/30' 
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {syncMode === 'timed' ? 'SYNC' : 'RANDOM'}
          </button>
          
          {/* Interactive Spotify Controls */}
          {playerLoaded && (
            <div className="flex items-center gap-2">
              {!isSpotifyPlaying ? (
                <button
                  onClick={onPlayClick}
                  className="px-6 py-2 text-sm font-light text-white transition-colors duration-200 border-b border-white/20 hover:border-white/40"
                >
                  PLAY
                </button>
              ) : (
                <button
                  onClick={onPauseClick}
                  className="px-6 py-2 text-sm font-light text-white transition-colors duration-200 border-b border-white/40"
                >
                  PAUSE
                </button>
              )}
              
              {/* Reset/Stop Button - only show in timed mode and when there's progress */}
              {syncMode === 'timed' && (startTime !== null || currentTime > 0) && (
                <button
                  onClick={() => {
                    // Stop and reset everything
                    if (spotifyEmbedControllerRef.current) {
                      spotifyEmbedControllerRef.current.pause();
                    }
                    setCurrentTime(0);
                    setStartTime(null);
                    setIsPlaying(false);
                    setLyricItems([]);
                    setIsPaused(false);
                    setPausedAtTime(null);
                  }}
                  className="px-4 py-2 text-sm font-light transition-colors duration-200 text-white/60 hover:text-white"
                >
                  RESET
                </button>
              )}
              
              {/* Loading state */}
              {!playerLoaded && (
                <div className="px-6 py-2 text-sm font-light text-white/40">
                  LOADING...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Corner effects */}
      <div className="absolute font-mono text-xs text-white top-4 left-4">
        LIVE
      </div>
      <div className="absolute font-mono text-xs !text-red-600 animate-pulse top-4 right-4">
        REC •
      </div>
      <div className="absolute font-mono text-xs text-white bottom-4 left-4">
        {imagesLoaded ? '∞ INFINITE LYRICS' : '⏳ LOADING IMAGES...'}
      </div>
      <div className="absolute font-mono text-xs text-white bottom-4 right-4">
        {syncMode === 'random' ? 'RANDOM.MODE' : 'SYNC.MODE'}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes noise {
          0% { transform: translate3d(0, 0, 0); }
          10% { transform: translate3d(-1px, -1px, 0); }
          20% { transform: translate3d(1px, -1px, 0); }
          30% { transform: translate3d(-1px, 1px, 0); }
          40% { transform: translate3d(1px, 1px, 0); }
          50% { transform: translate3d(-1px, -1px, 0); }
          60% { transform: translate3d(1px, -1px, 0); }
          70% { transform: translate3d(-1px, 1px, 0); }
          80% { transform: translate3d(1px, 1px, 0); }
          90% { transform: translate3d(-1px, -1px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(74, 222, 128, 0.3); }
          50% { box-shadow: 0 0 20px rgba(74, 222, 128, 0.6), 0 0 30px rgba(74, 222, 128, 0.3); }
          100% { transform: 0 0 5px rgba(74, 222, 128, 0.3); }
        }
        
        /* GPU acceleration for better performance */
        .text-white {
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        
       
      `}</style>
    </div>
  );
}

export default App;
