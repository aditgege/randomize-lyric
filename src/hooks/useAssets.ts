// Custom hooks for asset loading and Spotify integration
import { useState, useEffect } from 'react';
import { imageCache } from '../utils/imageCache';

// Enhanced asset preloader with progress tracking and image caching
export const useAssetLoader = (imageNames: string[]) => {
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
        setTimeout(() => {
          setAssetsLoaded(true);
        }, 500);
      }
    };

    // Preload and cache images using the image cache system
    setLoadingStatus('Caching images...');
    const imagePromises = imageNames.map((name) => {
      return new Promise<void>((resolve) => {
        // Determine the full path based on the name
        const imagePath = name.startsWith('/') ? name : `/dean/${name}`;
        
        imageCache.cacheImage(imagePath)
          .then(() => {
            updateProgress(1, `Cached ${name}`);
            resolve();
          })
          .catch((error) => {
            console.warn(`Failed to cache ${name}:`, error);
            updateProgress(1, `Failed to cache ${name}`);
            resolve(); // Continue even if image fails
          });
      });
    });

    // Preload fonts
    const loadFonts = () => {
      return new Promise<void>((resolve) => {
        setLoadingStatus('Loading fonts...');
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
export const usePreloadedImages = (imageNames: string[]) => {
  const { assetsLoaded } = useAssetLoader(imageNames);
  return assetsLoaded;
};
