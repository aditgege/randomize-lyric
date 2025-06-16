
  import { useRef, useState, useEffect } from "react";

  export default function App() {
    const embedRef = useRef(null);
    const spotifyEmbedControllerRef = useRef(null);
    const [iFrameAPI, setIFrameAPI] = useState(undefined);
    const [playerLoaded, setPlayerLoaded] = useState(false);
    const [uri, setUri] = useState("spotify:track:4s8W4gutSQnFIDNThqUPSI");

    useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }, []);

    useEffect(() => {
      if (iFrameAPI) {
        return;
      }

      window.onSpotifyIframeApiReady = (SpotifyIframeApi) => {
        setIFrameAPI(SpotifyIframeApi);
      };
    }, [iFrameAPI]);

    useEffect(() => {
      if (playerLoaded || iFrameAPI === undefined) {
        return;
      }

      iFrameAPI.createController(
        embedRef.current,
        {
          width: "100%",
          height: "352",
          uri: uri,
        },
        (spotifyEmbedController) => {
          spotifyEmbedController.addListener("ready", () => {
            setPlayerLoaded(true);
          });

          const handlePlaybackUpdate = (e) => {
            const { position, duration, isBuffering, isPaused, playingURI } =
              e.data;
            console.log(
              `Playback State updates:
              position - ${position},
              duration - ${duration},
              isBuffering - ${isBuffering},
              isPaused - ${isPaused},
              playingURI - ${playingURI},
              duration - ${duration}`
            );
          };

          spotifyEmbedController.addListener(
            "playback_update",
            handlePlaybackUpdate
          );

          spotifyEmbedController.addListener("playback_started", (e) => {
            const { playingURI } = e.data;
            console.log(`The playback has started for: ${playingURI}`);
          });

          spotifyEmbedControllerRef.current = spotifyEmbedController;
        }
      );

      return () => {
        if (spotifyEmbedControllerRef.current) {
          spotifyEmbedControllerRef.current.removeListener("playback_update");
        }
      };
    }, [playerLoaded, iFrameAPI, uri]);

    const onPauseClick = () => {
      if (spotifyEmbedControllerRef.current) {
        spotifyEmbedControllerRef.current.pause();
      }
    };

    const onPlayClick = () => {
      if (spotifyEmbedControllerRef.current) {
        spotifyEmbedControllerRef.current.play();
      }
    };

    const onUriChange = (event) => {
      setUri(event.target.value);
      if (spotifyEmbedControllerRef.current) {
        spotifyEmbedControllerRef.current.loadUri(event.target.value);
      }
    };

    return (
      <div>
        <div ref={embedRef} />
        {!playerLoaded && <p>Loading...</p>}
        <div>
          <button aria-label="Play" onClick={onPlayClick}>
            Play
          </button>
          <button aria-label="Pause" onClick={onPauseClick}>
            Pause
          </button>
        </div>
        <div>
          <p>Change URI:</p>
          <input
            type="text"
            value={uri}
            onChange={onUriChange}
            placeholder="Enter Spotify URI"
          />
        </div>
      </div>
    );
  }
  