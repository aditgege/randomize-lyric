// Types and interfaces for the randomize-lyric app

export interface LyricTemplate {
  position: { x: number; y: number };  // x,y: 0-100 (percentage of screen)
  style: { fontSize: number; fontFamily: string };  // fontSize: 1.0 = normal size
  timing: { duration: number };  // duration: seconds to show lyric
  effect?: 'underscores' | 'vertical' | 'dots' | 'mixed';  // special text effects
}

export interface ImageItem {
  id: number;
  src: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  duration: number;
  effect: 'fade-zoom' | 'slide-in' | 'bounce' | 'pulse';
  direction: 'top' | 'bottom' | 'left' | 'right';
}

export interface TimedImage {
  time: number;
  imageName: string;
  effect: 'fade-zoom' | 'slide-in' | 'bounce' | 'pulse';
  direction: 'top' | 'bottom' | 'left' | 'right';
  duration: number;
  position?: { x: number; y: number };
}

export interface LyricItem {
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

export interface EasyLyric {
  time: number;
  text: string;
  template: string;
}

// Spotify API types
declare global {
  interface Window {
    onSpotifyIframeApiReady: (SpotifyIframeApi: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}
