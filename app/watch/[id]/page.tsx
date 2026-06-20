'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Hls from 'hls.js';
import channels from '@/data/channels.json';
import ThemeToggle from '@/components/ThemeToggle';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecentlyWatched } from '@/hooks/useRecentlyWatched';

export default function WatchPage() {
  const params = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [channel, setChannel] = useState<typeof channels[0] | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToRecentlyWatched } = useRecentlyWatched();

  useEffect(() => {
    const channelData = channels.find(c => c.id === params.id);
    setChannel(channelData || null);

    if (channelData) {
      addToRecentlyWatched(channelData.id);
    }

    if (channelData?.stream && videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls();
        hls.loadSource(channelData.stream);
        hls.attachMedia(video);
        hlsRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(console.error);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = channelData.stream;
        video.play().catch(console.error);
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [params.id]);

  if (!channel) {
    return (
      <div className="min-h-screen bg-zinc-950 dark:bg-zinc-950 bg-zinc-50 text-white dark:text-white text-zinc-900 flex items-center justify-center">
        <p>Channel not found</p>
      </div>
    );
  }

  const favorite = isFavorite(channel.id);
  const relatedChannels = channels
    .filter(c => c.category === channel.category && c.id !== channel.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-zinc-950 dark:bg-zinc-950 bg-zinc-50 text-white dark:text-white text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/95 dark:bg-zinc-950/95 bg-white/95 backdrop-blur-sm border-b border-zinc-800 dark:border-zinc-800 border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Live TV
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/" className="text-zinc-400 dark:text-zinc-400 text-zinc-600 hover:text-white dark:hover:text-white hover:text-zinc-900 transition-colors">
              Home
            </Link>
            <Link href="/live" className="text-zinc-400 dark:text-zinc-400 text-zinc-600 hover:text-white dark:hover:text-white hover:text-zinc-900 transition-colors">
              All Channels
            </Link>
            <Link href="/favorites" className="text-zinc-400 dark:text-zinc-400 text-zinc-600 hover:text-white dark:hover:text-white hover:text-zinc-900 transition-colors">
              Favorites
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Video Player */}
        <div className="mb-8">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {channel.stream ? (
              <video
                ref={videoRef}
                className="w-full h-full"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="mx-auto mb-4 w-48 h-48 object-contain"
                  />
                  <p className="text-zinc-400">Stream URL not configured</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Channel Info */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <img
              src={channel.logo}
              alt={channel.name}
              className="w-20 h-20 rounded-lg bg-zinc-900 dark:bg-zinc-900 bg-zinc-200 p-2 object-contain"
            />
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold">{channel.name}</h1>
                <button
                  onClick={() => toggleFavorite(channel.id)}
                  className="p-2 rounded-full bg-zinc-900 dark:bg-zinc-900 bg-zinc-200 hover:bg-zinc-800 dark:hover:bg-zinc-800 hover:bg-zinc-300 transition-colors"
                  aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg
                    className={`w-6 h-6 ${favorite ? 'text-red-500 fill-current' : 'text-zinc-400 dark:text-zinc-400 text-zinc-600'}`}
                    fill={favorite ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex gap-2 text-sm text-zinc-400 dark:text-zinc-400 text-zinc-600">
                <span className="px-2 py-1 bg-zinc-900 dark:bg-zinc-900 bg-zinc-200 rounded">{channel.category}</span>
                <span className="px-2 py-1 bg-zinc-900 dark:bg-zinc-900 bg-zinc-200 rounded">{channel.country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Channels */}
        {relatedChannels.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Next Channels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedChannels.map(relatedChannel => (
                <Link
                  key={relatedChannel.id}
                  href={`/watch/${relatedChannel.id}`}
                  className="group relative flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                >
                  <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden">
                    <img
                      src={relatedChannel.logo}
                      alt={relatedChannel.name}
                      className="w-full h-full object-contain p-4"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ▶ Watch
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-zinc-300 dark:text-zinc-300 text-zinc-700 truncate">
                    {relatedChannel.name}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
