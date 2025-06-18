// Configuration data for lyrics, templates, and timed images
import { LyricTemplate, TimedImage, EasyLyric } from '../types';

export const lyrics = [
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

export const fontFamilies = [
  'font-mono',
  'font-serif',
  'font-sans',
  'font-mono',
  'font-serif',
  'font-sans'
];

export const customFonts = [
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

// TEMPLATE CONFIGURATIONS
export const LYRIC_TEMPLATES: Record<string, LyricTemplate> = {
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
  
  // Template 6: Center Stage (big, centered, dramatic)
  centerStage: {
    position: { x: 50, y: 50 },
    style: { fontSize: 2.5, fontFamily: 'Times New Roman, serif' },
    timing: { duration: 7 }
  },
  
  // Template 7: Mixed Effect (dynamic positioning)
  mixed: {
    position: { x: 40, y: 35 },
    style: { fontSize: 2.2, fontFamily: 'Comic Sans MS, cursive' },
    timing: { duration: 5 },
    effect: 'mixed' // Will apply mixed effects
  },
  
  // Template 8: Dots Effect (trailing dots)
  dots: {
    position: { x: 45, y: 70 },
    style: { fontSize: 1.6, fontFamily: 'Trebuchet MS, sans-serif' },
    timing: { duration: 4 },
    effect: 'dots' // Will add trailing dots
  }
};

// Easy Lyrics Configuration
export const EASY_LYRICS: EasyLyric[] = [
  { time: 26, text: "Di seluruh tempat di seluruh dunia", template: "bigImpact" },
  { time: 29, text: "Di manapun lagu cinta ini terputar", template: "typewriter" },
  { time: 32, text: "Ada film di kepalaku yang terputar", template: "floating" },
  { time: 35, text: "Adegan romantis pemerannya kamu", template: "subtitle" },
  { time: 38, text: "Di seluruh tempat di seluruh dunia", template: "typewriter" },
  { time: 42, text: "Di manapun lagu cinta ini terputar", template: "centerStage" },
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
export const timedLyrics = EASY_LYRICS.map(lyric => {
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

// Timed image appearances - ONE ANIMATION PER IMAGE
export const TIMED_IMAGES: TimedImage[] = [
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
  // { time: 70, imageName: 'bruh.png', effect: 'fade-zoom', direction: 'right', duration: 6000, position: { x: 80, y: 35 } },
];
