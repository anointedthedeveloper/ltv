'use client';

import Link from 'next/link';
import channels from '@/data/channels.json';
import ChannelCard from '@/components/ChannelCard';
import ThemeToggle from '@/components/ThemeToggle';
import { useRecentlyWatched } from '@/hooks/useRecentlyWatched';

export default function Home() {
  const categories = ['Kids', 'News', 'Education', 'Religious', 'Entertainment'] as const;
  const { getRecentlyWatchedIds } = useRecentlyWatched();
  const featuredChannels = channels.filter(c => c.featured);
  const recentlyWatchedIds = getRecentlyWatchedIds();
  const recentlyWatchedChannels = recentlyWatchedIds
    .map(id => channels.find(c => c.id === id))
    .filter((c): c is typeof channels[0] => c !== undefined);

  return (
    <div className="min-h-screen bg-zinc-950 dark:bg-zinc-950 bg-zinc-50 text-white dark:text-white text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/95 dark:bg-zinc-950/95 bg-white/95 backdrop-blur-sm border-b border-zinc-800 dark:border-zinc-800 border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Live TV
          </h1>
          <nav className="flex gap-6 items-center">
            <Link href="/" className="text-white dark:text-white text-zinc-900 font-medium hover:text-red-500 transition-colors">
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
        {/* Recently Watched */}
        {recentlyWatchedChannels.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Continue Watching</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recentlyWatchedChannels.map(channel => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          </section>
        )}

        {/* Trending Channels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Trending Channels</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {featuredChannels.slice(0, 5).map(channel => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </section>

        {/* Categories */}
        {categories.map(category => {
          const categoryChannels = featuredChannels.filter(c => c.category === category);
          if (categoryChannels.length === 0) return null;

          return (
            <section key={category} className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {categoryChannels.map(channel => (
                  <ChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
