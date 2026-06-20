'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import curatedChannels from '@/data/curated-channels.json';
import VideoPlayer from '@/components/VideoPlayer';
import ChannelCard from '@/components/ChannelCard';
import ThemeToggle from '@/components/ThemeToggle';
import { IconTV } from '@/components/Icons';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecentlyWatched } from '@/hooks/useRecentlyWatched';
import type { Channel } from '@/types/channel';
import { VideoPlayerSkeleton } from '@/components/SkeletonLoader';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToRecentlyWatched } = useRecentlyWatched();

  useEffect(() => {
    const channels = curatedChannels as Channel[];
    const slug = Array.isArray(params.id) ? params.id[0] : params.id;
    
    // Try finding by slug first, then by id for backwards compatibility
    const found = channels.find(c => c.slug === slug) || channels.find(c => c.id === slug);
    
    if (!found) {
      router.push('/404');
      return;
    }

    setChannel(found);
    addToRecentlyWatched(found.id);
    setIsLoading(false);
  }, [params.id, router, addToRecentlyWatched]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <IconTV className="w-6 h-6 text-red-500" />
              <span className="text-xl font-bold text-white">Live TV</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <VideoPlayerSkeleton />
        </main>
      </div>
    );
  }

  if (!channel) {
    return null;
  }

  const channels = curatedChannels as Channel[];
  const favorite = isFavorite(channel.id);
  const relatedChannels = channels
    .filter((c) => c.category === channel.category && c.id !== channel.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <IconTV className="w-8 h-8 text-red-500" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              Live TV
            </h1>
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/live" className="text-neutral-400 hover:text-white transition-colors">
              All Channels
            </Link>
            <Link href="/channels" className="text-neutral-400 hover:text-white transition-colors">
              Directory
            </Link>
            <ThemeToggle />
          </nav>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Video Player */}
        <VideoPlayer streamUrl={channel.streamUrl} channelName={channel.name} autoplay={true} />

        {/* Channel Information */}
        <div className="bg-neutral-900 rounded-lg p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{channel.name}</h1>
              <p className="text-neutral-400 mb-4">
                {channel.category} • {channel.country} • {channel.language.toUpperCase()}
              </p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Live
                </span>
                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-sm font-medium">
                  {channel.category}
                </span>
                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-sm font-medium">
                  {channel.country}
                </span>
              </div>
            </div>

            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(channel.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                favorite
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favorite ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Related Channels */}
        {relatedChannels.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Channels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedChannels.map((related) => (
                <ChannelCard key={related.id} channel={related} />
              ))}
            </div>
          </section>
        )}

        {/* Back Navigation */}
        <div className="flex justify-center pt-8">
          <Link
            href="/live"
            className="flex items-center gap-2 px-6 py-3 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Channels
          </Link>
        </div>
      </main>
    </div>
  );
}
