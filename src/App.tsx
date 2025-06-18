import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';

// Types and configuration
import { LyricItem, ImageItem, TimedImage } from './types';
import { TIMED_IMAGES } from './config/data';

// Utilities and hooks
import { getRandomLyric, getCurrentTimedLyric } from './utils/lyrics';
import { getLyricStyle, getImageStyle, backgroundNoiseStyle, backgroundGradientStyle } from './utils/styles';
import { useAssetLoader, usePreloadedImages } from './hooks/useAssets';

// Components
import { LoadingScreen, LyricComponent, RegularImage } from './components';
// Animation components
import {
  SkiingImage,
  PrincessImage,
  MatahariImage,
  MakanImage,
  MarahImage,
  BruhImage,
  BungaImage,
  MatahariWheel
} from './components/animations/index';





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
          const { position, isBuffering, isPaused } = e.data;
          
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



  return (
    <div className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* style={{ background: 'url(/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} */}
      {/* Dark overlay to make background darker */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Animated starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
        
        {/* Larger, slower moving stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`large-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 2}px`,
              height: `${Math.random() * 2 + 2}px`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.6 + 0.3
            }}
          />
        ))}
        
        {/* CSS animations for stars */}
        <style>{`
          @keyframes twinkle {
            0%, 100% { 
              opacity: 0.2; 
              transform: scale(1);
            }
            50% { 
              opacity: 1; 
              transform: scale(1.2);
            }
          }
          
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) translateX(0px); 
              opacity: 0.3; 
            }
            25% { 
              transform: translateY(-10px) translateX(5px); 
              opacity: 0.8; 
            }
            50% { 
              transform: translateY(-5px) translateX(-3px); 
              opacity: 1; 
            }
            75% { 
              transform: translateY(-15px) translateX(8px); 
              opacity: 0.6; 
            }
          }
        `}</style>
      </div>
      
      {/* Matahari wheel background */}
      <MatahariWheel />
      
      {/* Background noise effect */}
      <div 
        className="absolute inset-0 opacity-10"
        style={backgroundNoiseStyle}
      />

      {/* Right column background image */}
      <div
        className="absolute top-0 right-0 flex items-start justify-end w-1/2 h-screen"
        style={{ zIndex: 1 }}
      >
        <img 
          src="/dean/bruh.png" 
          alt="Background" 
          className="object-contain max-w-full max-h-full" 
          style={{ willChange: 'auto' }}
          loading="eager"
        />
      </div>

      <div
        className="absolute top-0 left-0 flex items-start justify-start w-1/2 h-screen"
        style={{ zIndex: 1 }}
      >
        <img 
          src="/dean/bruh.png" 
          alt="Background" 
          className="object-contain max-w-full max-h-full"
          style={{ 
            transform: 'scaleX(-1)',
            willChange: 'auto'
          }}
          loading="eager"
        />
      </div>

      {/* Static overlapping background images */}
      {/* Mountain image - top left area */}
      

     

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
