# 🎵 Spotify Web API Setup Guide

## Quick Setup (5 minutes)

### 1. Create Spotify App
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in:
   - **App Name**: "Randomized Lyric Display"
   - **App Description**: "Lyric display app with Spotify sync"
   - **Website**: `http://localhost:3000`
   - **Redirect URI**: `http://localhost:3000/callback`
5. Accept terms and click "Save"

### 2. Get Your Client ID
1. Click on your newly created app
2. Copy the **Client ID** (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### 3. Configure the App
1. Open `src/App.tsx`
2. Find line ~31: `const CLIENT_ID = 'your_client_id_here';`
3. Replace `'your_client_id_here'` with your actual Client ID
4. Save the file

### 4. Update Redirect URI in Spotify Dashboard
1. In your Spotify app settings, click "Edit Settings"
2. Add these Redirect URIs:
   - `http://localhost:3000/callback`
   - `http://localhost:5173/callback` (for Vite dev server)
3. Click "Save"

### 5. Test the Integration
1. Start your app: `npm run dev`
2. Click "CONNECT SPOTIFY" in the top control panel
3. Authorize the app in the popup
4. Click "▶️ SPOTIFY" to play the hardcoded track
5. Switch to "TIMED MODE" for synchronized lyrics!

## 🎯 Features Enabled

- **Real-time Playback Tracking**: Lyrics sync with actual Spotify playback
- **Auto-sync Detection**: Automatically syncs when Spotify plays the target song
- **Playback Control**: Play/pause directly from the app
- **Progress Display**: Shows current track and playback progress
- **Device Management**: Automatically finds and uses available Spotify devices

## 🔧 Troubleshooting

### "No Spotify devices found"
- Open Spotify on any device (phone, computer, web player)
- Make sure you're logged into the same account
- Try refreshing the page

### "Token expired" errors
- Click "CONNECT SPOTIFY" again to refresh authorization
- Make sure your Redirect URIs are correctly set

### Song not syncing automatically
- Ensure you're playing the correct track: "M.E.L.O.D.Y" by Niki
- Use manual controls if auto-sync isn't working
- Check that the track ID matches in `TRACK_URI`

## 🎵 Customizing the Track

To change the target song:
1. Find your desired song's Spotify URI (right-click → Share → Copy Spotify URI)
2. Replace `TRACK_URI` in `App.tsx` with your song's URI
3. Update the `EASY_LYRICS` array with your song's lyrics and timing

## 🚀 Advanced Usage

- **Multiple Songs**: Modify the code to accept different track URIs
- **Playlist Support**: Extend to work with entire playlists
- **Real-time Lyrics**: Integrate with lyrics APIs for automatic lyric fetching
- **Voice Control**: Add speech recognition for hands-free control
