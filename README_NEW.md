# 🎵 Randomized Lyric Display App with Spotify Sync

A beautiful, animated lyric display application that synchronizes with Spotify playback using the Spotify Embed iframe API. Features dynamic visual effects, real-time synchronization, and an easy template system for customizing lyrics.

![App Preview](https://img.shields.io/badge/Status-Ready-brightgreen)
![Spotify Embed](https://img.shields.io/badge/Spotify-Embed_API-1DB954)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### 🎨 Visual Effects
- **Dynamic Lyric Animation**: 7 predefined templates with unique effects
- **Typewriter Effects**: Underscores, dots, vertical text, mixed characters
- **GPU-Accelerated Animations**: Smooth transitions with hardware acceleration
- **Beautiful UI**: Glass morphism design with animated backgrounds

### 🎵 Spotify Integration
- **Real-time Synchronization**: Lyrics sync with Spotify embed player
- **No Configuration Required**: Works immediately without API setup
- **Embedded Player**: Built-in Spotify player with full controls
- **Auto-detection**: Automatically syncs when song starts playing
- **Progress Tracking**: Real-time playback progress display

### 🎯 Dual Mode System
- **RANDOM MODE**: Continuous random lyric display with effects
- **TIMED MODE**: Precisely synchronized lyrics with hardcoded timing

### ⚡ Easy Template System
- **7 Built-in Templates**: bigImpact, typewriter, vertical, floating, subtitle, dots, mixed
- **Simple Configuration**: Just edit the `EASY_LYRICS` array
- **Custom Positioning**: Precise control over placement, timing, and effects

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Run the App
```bash
npm run dev
# or
pnpm dev
```

### 3. Use the App
1. **Random Mode**: Watch beautiful animated lyrics immediately
2. **Timed Mode**: Click "TIMED MODE" for synchronized lyrics
3. **Spotify Controls**: Use ▶️ PLAY and ⏸️ PAUSE to control the embedded Spotify player
4. **Auto-sync**: Lyrics automatically sync with Spotify playback in Timed Mode

**That's it!** No configuration, no API keys, no setup required.

## 🎵 Customizing Lyrics

### Easy Method (Recommended)
Edit the `EASY_LYRICS` array in `src/App.tsx`:

```typescript
const EASY_LYRICS: EasyLyric[] = [
  { time: 10, text: "Your first lyric", template: "bigImpact" },
  { time: 15, text: "Another beautiful line", template: "typewriter" },
  { time: 20, text: "Vertical text", template: "vertical" },
  // Add more lyrics...
];
```

### Available Templates
- **`bigImpact`**: Large center text with Impact font
- **`typewriter`**: Monospace with underscores effect
- **`vertical`**: Letters stacked vertically
- **`floating`**: Elegant serif positioning
- **`subtitle`**: Small bottom text
- **`dots`**: Text with trailing dots
- **`mixed`**: Special characters between letters

### Advanced Customization
Modify `LYRIC_TEMPLATES` to change:
- Position (`x: 0-100, y: 0-100` percentage)
- Font size (`fontSize: 1.0-5.0` multiplier)
- Duration (`duration: seconds`)
- Font family and effects

## 🎮 Controls

### Keyboard Shortcuts
- **Space**: Play/Pause lyrics (in Timed Mode)
- **R**: Reset timer and lyrics
- **L**: Toggle auto-sync mode

### Control Panel
- **Mode Toggle**: Switch between Random/Timed modes
- **Spotify Controls**: Play, pause embedded player
- **Sync Options**: Auto-start, manual controls
- **Timer Display**: Current playback position and sync status

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Spotify Embed iframe API** for seamless integration
- **Performance Optimized** with `useCallback`, `useMemo`, `React.memo`

## 📁 Project Structure

```
src/
├── App.tsx              # Main application with Spotify embed integration
├── example.tsx          # Reference Spotify embed implementation
├── main.tsx            # React app entry point
├── index.css           # Global styles and animations
└── vite-env.d.ts       # TypeScript declarations
```

## 🔧 Configuration

### Spotify Track
The app is currently configured to play "M.E.L.O.D.Y" by Niki:
```typescript
const [uri] = useState("spotify:track:4s8W4gutSQnFIDNThqUPSI");
```

To change the track:
1. Find your desired song's Spotify URI (right-click → Share → Copy Spotify URI)
2. Replace the URI in the `uri` state variable
3. Update the `EASY_LYRICS` array with your song's lyrics and timing

### Lyric Templates
```typescript
const LYRIC_TEMPLATES = {
  bigImpact: {
    position: { x: 50, y: 40 },
    style: { fontSize: 3.0, fontFamily: 'Impact, sans-serif' },
    timing: { duration: 6 }
  },
  // ... more templates
};
```

## 🎯 Performance Features

- **Memoized Components**: Prevents unnecessary re-renders
- **GPU Acceleration**: Hardware-accelerated animations
- **Efficient Updates**: Smart state management
- **Background Optimization**: Cached gradient and noise effects

## 🔮 Future Enhancements

- [ ] Multiple song support with playlist
- [ ] Auto-lyric fetching from lyrics APIs
- [ ] Custom effect builder interface
- [ ] Export animations as video
- [ ] Voice control integration
- [ ] Social sharing features

## 📝 License

MIT License - feel free to use for personal and commercial projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with the Spotify embed player
5. Submit a pull request

---

Made with ❤️ for music lovers and lyric enthusiasts!
