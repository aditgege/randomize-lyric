// Style utilities and helper functions
import { LyricItem, ImageItem } from '../types';

// Get lyric styling with advanced positioning logic
export const getLyricStyle = (item: LyricItem) => {
  // Pre-calculate random values to avoid recalculation on every render
  const fontWeight = item.id % 2 === 0 ? 'bold' : 'normal';
  const fontStyle = item.id % 7 === 0 ? 'italic' : 'normal';
  const textShadow = item.id % 3 === 0 ? '0 0 15px rgba(255,255,255,0.4)' : 'none';
  const letterSpacing = `${(item.id % 3) * 0.05}rem`;
  
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
};

// Simple image styling function for regular images (non-animated)
export const getImageStyle = (item: ImageItem) => {
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
};

// Background style utilities
export const backgroundNoiseStyle = {
  backgroundImage: `
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)
  `,
  backgroundSize: '20px 20px',
  animation: 'noise 0.1s infinite'
};

export const backgroundGradientStyle = {
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
};
