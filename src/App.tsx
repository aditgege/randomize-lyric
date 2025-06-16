import React, { useState, useEffect } from 'react';

const lyrics = [
  'ADA FILM',
  'DIKEPALAKU',
  'SAYANG',
  'TERPUTAR',
  'ADEGAN',
  'SEMUA LAGU CINTA',
  'HATIKU',
  'BERPUTAR',
  'KEMBALI',
  'MELODI',
  'RINDU',
  'WAKTU',
  'CERITA',
  'MIMPI',
  'BAHAGIA'
];

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

function App() {
  const [lyricItems, setLyricItems] = useState<LyricItem[]>([]);

  const getRandomLyric = (): LyricItem => {
    return {
      id: Math.random(),
      text: lyrics[Math.floor(Math.random() * lyrics.length)],
      x: Math.random() * 80 + 10, // 10-90% from left
      y: Math.random() * 80 + 10, // 10-90% from top
      rotation: Math.random() * 720 - 360, // -360 to 360 degrees
      scale: Math.random() * 2 + 0.3, // 0.3 to 2.3
      opacity: Math.random() * 0.6 + 0.4, // 0.4 to 1 (higher opacity for white text)
      reversed: Math.random() > 0.5,
      fontSize: Math.random() * 4 + 1, // 1rem to 5rem
      blur: Math.random() * 2, // 0 to 2px blur (reduced for better readability)
      skew: Math.random() * 40 - 20, // -20 to 20 degrees
      duration: Math.random() * 3 + 2, // 2 to 5 seconds
      fontFamily: Math.random() > 0.5 ? 
        fontFamilies[Math.floor(Math.random() * fontFamilies.length)] :
        customFonts[Math.floor(Math.random() * customFonts.length)]
    };
  };

  useEffect(() => {
    const addLyric = () => {
      const newLyric = getRandomLyric();
      setLyricItems(prev => [...prev, newLyric]);

      // Remove lyric after its duration
      setTimeout(() => {
        setLyricItems(prev => prev.filter(item => item.id !== newLyric.id));
      }, newLyric.duration * 1000);
    };

    // Add initial lyrics
    for (let i = 0; i < 3; i++) {
      setTimeout(() => addLyric(), i * 500);
    }

    // Add new lyrics periodically
    const interval = setInterval(addLyric, 800);

    return () => clearInterval(interval);
  }, []);

  const getLyricStyle = (item: LyricItem) => ({
    position: 'absolute' as const,
    left: `${item.x}%`,
    top: `${item.y}%`,
    transform: `
      translate(-50%, -50%) 
      rotate(${item.rotation}deg) 
      scale(${item.scale}) 
      skew(${item.skew}deg)
      ${item.reversed ? 'scaleX(-1)' : ''}
    `,
    opacity: item.opacity,
    fontSize: `${item.fontSize}rem`,
    filter: `blur(${item.blur}px)`,
    transition: `all ${item.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    fontWeight: Math.random() > 0.5 ? 'bold' : 'normal',
    fontStyle: Math.random() > 0.7 ? 'italic' : 'normal',
    textShadow: Math.random() > 0.5 ? '0 0 20px rgba(255,255,255,0.3)' : 'none',
    letterSpacing: `${Math.random() * 0.5}rem`,
    writingMode: Math.random() > 0.8 ? 'vertical-rl' as const : 'horizontal-tb' as const,
    userSelect: 'none' as const,
    pointerEvents: 'none' as const,
    fontFamily: item.fontFamily.startsWith('font-') ? undefined : item.fontFamily
  });

  return (
    <div className="min-h-screen bg-black overflow-hidden relative cursor-none">
      {/* Background noise effect */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px',
          animation: 'noise 0.1s infinite'
        }}
      />
      
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
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
        }}
      />

      {/* Lyrics */}
      {lyricItems.map((item) => (
        <div
          key={item.id}
          className={`text-white select-none ${item.fontFamily.startsWith('font-') ? item.fontFamily : ''}`}
          style={getLyricStyle(item)}
        >
          {item.text}
        </div>
      ))}

      {/* Corner effects */}
      <div className="absolute top-4 left-4 text-white/30 text-xs font-mono">
        LIVE
      </div>
      <div className="absolute top-4 right-4 text-white/30 text-xs font-mono">
        REC •
      </div>
      <div className="absolute bottom-4 left-4 text-white/30 text-xs font-mono">
        ∞ INFINITE LYRICS
      </div>
      <div className="absolute bottom-4 right-4 text-white/30 text-xs font-mono">
        RANDOM.MODE
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes noise {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-1px, -1px); }
          20% { transform: translate(1px, -1px); }
          30% { transform: translate(-1px, 1px); }
          40% { transform: translate(1px, 1px); }
          50% { transform: translate(-1px, -1px); }
          60% { transform: translate(1px, -1px); }
          70% { transform: translate(-1px, 1px); }
          80% { transform: translate(1px, 1px); }
          90% { transform: translate(-1px, -1px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        body {
          cursor: none;
        }
      `}</style>
    </div>
  );
}

export default App;