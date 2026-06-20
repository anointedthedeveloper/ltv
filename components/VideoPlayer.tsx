'use client';

import { useEffect, useRef, useState } from 'react';
import HLS from 'hls.js';

interface VideoPlayerProps {
  streamUrl: string;
  channelName: string;
  onError?: (error: Error) => void;
  autoplay?: boolean;
}

export default function VideoPlayer({
  streamUrl,
  channelName,
  onError,
  autoplay = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<HLS | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if stream URL is valid
    if (!streamUrl || !streamUrl.trim()) {
      setHasError(true);
      setErrorMessage('Stream URL not available');
      setIsLoading(false);
      return;
    }

    const setupPlayer = () => {
      try {
        setIsLoading(true);
        setHasError(false);
        setErrorMessage('');

        // Check if HLS is supported (M3U8 streams)
        if (streamUrl.includes('.m3u8') || streamUrl.includes('.m3u')) {
          if (HLS.isSupported()) {
            const hls = new HLS({
              debug: false,
              enableWorker: true,
            });

            hls.loadSource(streamUrl);
            hls.attachMedia(video);

            // Handle HLS events
            hls.on(HLS.Events.MANIFEST_PARSED, () => {
              setIsLoading(false);
              if (autoplay) {
                video.play().catch(() => {
                  // Autoplay may be blocked by browser
                  setIsPlaying(false);
                });
              }
            });

            hls.on(HLS.Events.ERROR, (event, data) => {
              if (data.fatal) {
                switch (data.type) {
                  case HLS.ErrorTypes.NETWORK_ERROR:
                    setErrorMessage('Network error. Please check your connection.');
                    break;
                  case HLS.ErrorTypes.MEDIA_ERROR:
                    setErrorMessage('Stream playback error. Retrying...');
                    hls.recoverMediaError();
                    break;
                  default:
                    setErrorMessage('Unable to load stream');
                    break;
                }
                setHasError(true);
                setIsLoading(false);
                onError?.(new Error(`HLS Error: ${data.type}`));
              }
            });

            hlsRef.current = hls;
          } else {
            // Fallback for native HLS support (Safari)
            video.src = streamUrl;
            setIsLoading(false);
            if (autoplay) {
              video.play().catch(() => {
                setIsPlaying(false);
              });
            }
          }
        } else {
          // Direct stream URL (MPEG-TS, etc.)
          video.src = streamUrl;
          setIsLoading(false);
          if (autoplay) {
            video.play().catch(() => {
              setIsPlaying(false);
            });
          }
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        setErrorMessage(`Failed to load stream: ${errorMsg}`);
        setHasError(true);
        setIsLoading(false);
        onError?.(error instanceof Error ? error : new Error(errorMsg));
      }
    };

    setupPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.src = '';
    };
  }, [streamUrl, autoplay, onError]);

  // Update video time and duration
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.volume = Number(e.target.value);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Number(e.target.value);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen().catch(() => {
          // Fullscreen may be blocked
        });
      }
    }
  };

  const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds)) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* Video Container */}
      <div className="relative w-full bg-black aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full"
          controls={false}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-neutral-700 border-t-red-600 rounded-full animate-spin" />
              <p className="text-neutral-300 text-sm">Loading stream...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-white font-semibold">Stream Unavailable</p>
                <p className="text-neutral-400 text-sm mt-1">{errorMessage}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Custom Controls */}
        {!isLoading && !hasError && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity group p-4">
            {/* Progress Bar */}
            <div className="mb-3 flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className="flex-1 h-1 bg-neutral-700 rounded-full cursor-pointer accent-red-600"
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <button
                  onClick={handlePlayPause}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.04v8.05c1.48-.75 2.5-2.27 2.5-4.01z" />
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="1"
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-neutral-700 rounded-full cursor-pointer accent-red-600"
                  />
                </div>

                {/* Time Display */}
                <span className="text-white text-sm ml-2">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={handleFullscreen}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                aria-label="Fullscreen"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Channel Name Overlay (when loading/error) */}
        {!isLoading && !hasError && (
          <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-lg">
            <p className="text-white text-sm font-medium">{channelName}</p>
          </div>
        )}
      </div>
    </div>
  );
}
