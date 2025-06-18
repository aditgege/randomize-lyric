// Utility functions for text effects and animations
import { LyricItem } from '../types';
import { lyrics, fontFamilies, customFonts, timedLyrics } from '../config/data';

// Helper function to create glitch effect text
export const createGlitchEffect = (text: string): string => {
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
        glitchedLine += glitchChars[Math.floor(Math.random() * glitchChars.length)];
      } else if (rand < 0.6) {
        glitchedLine += char.toUpperCase();
      } else {
        glitchedLine += char;
      }
    }
    
    lines.push(glitchedLine);
  }
  
  return lines.join('\n');
};

// Generate random lyric for random mode
export const getRandomLyric = (): LyricItem => {
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
};

// Get current timed lyric for timed mode
export const getCurrentTimedLyric = (time: number): LyricItem | null => {
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
};
