
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

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
  { time: 152, text: "ke altar", template: "subtitle" },
  { time: 156, text: "diantar..", template: "subtitle" },
  { time: 159, text: "Bapakmu..", template: "subtitle" },
  { time: 161, text: "Tersenyum", template: "floating" },
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

function App() {
  const [lyricItems, setLyricItems] = useState<LyricItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [syncMode, setSyncMode] = useState<'random' | 'timed'>('timed');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isListeningForSpotify, setIsListeningForSpotify] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedAtTime, setPausedAtTime] = useState<number | null>(null);
  
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
          
          console.log(
            `Playback State updates:
            position - ${position},
            duration - ${duration},
            isBuffering - ${isBuffering},
            isPaused - ${isPaused},
            playingURI - ${playingURI}`
          );
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

  // Clear lyrics when mode changes or when resetting
  useEffect(() => {
    setLyricItems([]);
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
    <div className="relative min-h-screen overflow-hidden bg-black ">
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

      {/* Spotify Embed Player */}
      <div className="absolute z-10 transition-opacity duration-300 transform -translate-x-1/2 bottom-6 left-1/2 opacity-20 hover:opacity-100">
          {/* Embed Container */}
          <div className="mt-4">
            <div ref={embedRef} className="w-full" />
          </div>
      </div>

      {/* Control Panel */}
      <div className="absolute z-10 transform -translate-x-1/2 top-6 left-1/2">
        <div className="flex gap-3 p-3 border bg-black/80 backdrop-blur-sm rounded-xl border-white/10">
          {/* Mode Toggle */}
          <button
            onClick={() => setSyncMode(syncMode === 'random' ? 'timed' : 'random')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 border rounded-lg transform hover:scale-105 ${
              syncMode === 'timed' 
                ? 'bg-blue-600/50 text-white border-blue-400/50 shadow-lg shadow-blue-500/20' 
                : 'text-white/80 border-white/20 hover:bg-white/10 hover:border-white/40'
            }`}
          >
            {syncMode === 'timed' ? '🎵 SYNC MODE' : '🎲 RANDOM MODE'}
          </button>
          
          {/* Interactive Spotify Controls */}
          {playerLoaded && (
            <div className="flex items-center gap-2">
              {!isSpotifyPlaying ? (
                <button
                  onClick={onPlayClick}
                  className="relative px-6 py-2 text-sm font-medium text-white transition-all duration-300 transform border rounded-lg group border-green-400/50 bg-green-600/20 hover:bg-green-600/40 hover:scale-110 hover:shadow-lg hover:shadow-green-500/30"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg animate-pulse">▶️</span>
                    <span className="transition-transform group-hover:scale-105">PLAY</span>
                  </span>
                  {/* Glow effect */}
                  <div className="absolute inset-0 transition-opacity duration-300 rounded-lg opacity-0 bg-green-400/10 group-hover:opacity-100 blur-sm"></div>
                </button>
              ) : (
                <button
                  onClick={onPauseClick}
                  className="relative px-6 py-2 text-sm font-medium text-white transition-all duration-300 transform border rounded-lg group border-red-400/50 bg-red-600/20 hover:bg-red-600/40 hover:scale-110 hover:shadow-lg hover:shadow-red-500/30"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">⏸️</span>
                    <span className="transition-transform group-hover:scale-105">PAUSE</span>
                  </span>
                  {/* Glow effect */}
                  <div className="absolute inset-0 transition-opacity duration-300 rounded-lg opacity-0 bg-red-400/10 group-hover:opacity-100 blur-sm"></div>
                  {/* Playing indicator */}
                  <div className="absolute w-3 h-3 bg-green-400 rounded-full -top-1 -right-1 animate-pulse"></div>
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
                  className="relative px-4 py-2 text-sm font-medium text-white transition-all duration-300 transform border rounded-lg group border-orange-400/50 bg-orange-600/20 hover:bg-orange-600/40 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">⏹️</span>
                    <span className="transition-transform group-hover:scale-105">RESET</span>
                  </span>
                  {/* Glow effect */}
                  <div className="absolute inset-0 transition-opacity duration-300 rounded-lg opacity-0 bg-orange-400/10 group-hover:opacity-100 blur-sm"></div>
                </button>
              )}
              
              {/* Loading state */}
              {!playerLoaded && (
                <div className="px-6 py-2 text-sm font-medium border rounded-lg text-white/50 border-white/20 bg-white/5">
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                    LOADING...
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Timer Display */}
          {syncMode === 'timed' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center px-3 py-2 font-mono text-sm border rounded-lg text-white/60 bg-black/30 border-white/10">
                <span className="mr-2">⏱️</span>
                {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(1).padStart(4, '0')}
              </div>
              {isSpotifyPlaying && (
                <div className="flex items-center px-2 py-2 text-xs text-green-400 border rounded-lg bg-green-400/10 border-green-400/20">
                  <div className="w-2 h-2 mr-1 bg-green-400 rounded-full animate-pulse"></div>
                  LIVE
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Corner effects */}
      <div className="absolute font-mono text-xs top-4 left-4 text-white/30">
        LIVE
      </div>
      <div className="absolute font-mono text-xs text-red-600 top-4 right-4 text-white/30">
        REC •
      </div>
      <div className="absolute font-mono text-xs bottom-4 left-4 text-white/30">
        ∞ INFINITE LYRICS
      </div>
      <div className="absolute font-mono text-xs bottom-4 right-4 text-white/30">
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
        
        @keyframes buttonPress {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
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
        
        /* Button interaction effects */
        .group:active {
          animation: buttonPress 0.1s ease-in-out;
        }
        
        /* Hover glow effect for play button */
        .group:hover .bg-green-600\\/20 {
          animation: glow 2s ease-in-out infinite;
        }
       
      `}</style>
    </div>
  );
}

export default App;
