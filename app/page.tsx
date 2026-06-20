'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import curatedChannels from '@/data/curated-channels.json';
import ChannelCard from '@/components/ChannelCard';
import HeroSection from '@/components/HeroSection';
import ThemeToggle from '@/components/ThemeToggle';
import ShowTypeSlideshow from '@/components/ShowTypeSlideshow';
import { CategoryRowSkeleton, HeroSectionSkeleton } from '@/components/SkeletonLoader';
import { useRecentlyWatched } from '@/hooks/useRecentlyWatched';
import {
  IconTV,
  IconKids,
  IconNews,
  IconMusic,
  IconSports,
  IconEntertainment,
  IconMovies,
  IconNigeria,
} from '@/components/Icons';
import type { Channel, ChannelCategory } from '@/types/channel';

const CATEGORIES: ChannelCategory[] = ['Kids', 'News', 'Music', 'Religious', 'Sports', 'Entertainment', 'Movies', 'Nigerian'];

interface CategoryIconMap {
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_ICONS: Record<ChannelCategory, CategoryIconMap> = {
  'Kids': { icon: IconKids },
  'News': { icon: IconNews },
  'Music': { icon: IconMusic },
  'Religious': { icon: IconEntertainment },
  'Sports': { icon: IconSports },
  'Entertainment': { icon: IconEntertainment },
  'Movies': { icon: IconMovies },
  'Nigerian': { icon: IconNigeria },
};

function CategoryRow({ category, channels }: { category: ChannelCategory; channels: Channel[] }) {
  if (channels.length === 0) return null;

  const IconComponent = CATEGORY_ICONS[category].icon;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <IconComponent className="w-8 h-8 text-red-500" />
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
        <div className="w-8 h-8">
          <svg className="w-full h-full text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
        </div>
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
            <IconTV className="w-8 h-8 text-red-500" />
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
        {/* Show Types Slideshow */}
        <ShowTypeSlideshow />

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
