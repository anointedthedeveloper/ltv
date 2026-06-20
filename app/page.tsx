'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import curatedChannels from '@/data/curated-channels.json';
import ChannelCard from '@/components/ChannelCard';
import HeroSection from '@/components/HeroSection';
import ThemeToggle from '@/components/ThemeToggle';
import { CategoryRowSkeleton, HeroSectionSkeleton } from '@/components/SkeletonLoader';
import { useRecentlyWatched } from '@/hooks/useRecentlyWatched';
import type { Channel, ChannelCategory } from '@/types/channel';

const CATEGORIES: ChannelCategory[] = ['Kids', 'News', 'Music', 'Religious', 'Sports', 'Entertainment', 'Movies', 'Nigerian'];

const CATEGORY_ICONS: Record<ChannelCategory, string> = {
  'Kids': '👶',
  'News': '📰',
  'Music': '🎵',
  'Religious': '⛪',
  'Sports': '⚽',
  'Entertainment': '🎬',
  'Movies': '🎭',
  'Nigerian': '🇳🇬',
};

function CategoryRow({ category, channels }: { category: ChannelCategory; channels: Channel[] }) {
  if (channels.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{CATEGORY_ICONS[category]}</span>
        <h2 className="text-3xl font-bold text-balance">{category}</h2>
        <span className="ml-auto text-sm text-neutral-500">
          {channels.length} channels
        </span>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
        {channels.map((channel) => (
          <div key={channel.id} className="flex-shrink-0">
            <ChannelCard channel={channel} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ContinueWatching({ channels }: { channels: Channel[] }) {
  if (channels.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">⏱️</span>
        <h2 className="text-3xl font-bold">Continue Watching</h2>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
        {channels.map((channel) => (
          <div key={channel.id} className="flex-shrink-0">
            <ChannelCard channel={channel} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { getRecentlyWatchedIds } = useRecentlyWatched();
  
  const channels = curatedChannels as Channel[];
  const recentlyWatchedIds = getRecentlyWatchedIds();
  const recentlyWatchedChannels = recentlyWatchedIds
    .map((id) => channels.find((c) => c.id === id))
    .filter((c): c is Channel => c !== undefined)
    .slice(0, 10);

  const featuredChannels = channels.filter((c) => c.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-3xl">📺</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Live TV
            </h1>
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/" className="text-white font-semibold hover:text-red-500 transition-colors">
              Home
            </Link>
            <Link href="/live" className="text-neutral-400 hover:text-white transition-colors">
              All Channels
            </Link>
            <Link href="/channels" className="text-neutral-400 hover:text-white transition-colors">
              Directory
            </Link>
            <Link href="/favorites" className="text-neutral-400 hover:text-white transition-colors">
              Favorites
            </Link>
            <ThemeToggle />
          </nav>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <Suspense fallback={<HeroSectionSkeleton />}>
          <HeroSection channels={featuredChannels} />
        </Suspense>

        {/* Continue Watching */}
        {recentlyWatchedChannels.length > 0 && (
          <ContinueWatching channels={recentlyWatchedChannels} />
        )}

        {/* Category Sections */}
        {CATEGORIES.map((category) => {
          const categoryChannels = channels.filter((c) => c.category === category);
          
          return (
            <Suspense key={category} fallback={<CategoryRowSkeleton />}>
              <CategoryRow category={category} channels={categoryChannels} />
            </Suspense>
          );
        })}

        {/* Call to Action */}
        <section className="mt-16 mb-8">
          <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-3">Discover More Channels</h2>
            <p className="text-neutral-100 mb-6">Browse our complete channel directory with advanced filters</p>
            <Link
              href="/live"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Browse All Channels
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
