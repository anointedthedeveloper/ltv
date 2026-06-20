'use client';

import Link from 'next/link';
import channels from '@/data/channels.json';
import ChannelCard from '@/components/ChannelCard';
import ThemeToggle from '@/components/ThemeToggle';
import { useRecentlyWatched } from '@/hooks/useRecentlyWatched';

export default function Home() {
  const categories = ['Kids', 'Sports', 'News', 'Education', 'Religious', 'Entertainment'] as const;
  const { getRecentlyWatchedIds } = useRecentlyWatched();
  const featuredChannels = channels.filter(c => c.featured);
  const recentlyWatchedIds = getRecentlyWatchedIds();
  const recentlyWatchedChannels = recentlyWatchedIds
    .map(id => channels.find(c => c.id === id))
    .filter((c): c is typeof channels[0] => c !== undefined);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Kids': '👶',
      'Sports': '⚽',
      'News': '📰',
      'Education': '🎓',
      'Religious': '⛪',
      'Entertainment': '🎬',
      'African': '🌍',
    };
    return icons[category] || '📺';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-3xl">📺</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Live TV
            </h1>
          </Link>
          <nav className="flex gap-8 items-center">
            <Link href="/" className="text-neutral-900 dark:text-white font-semibold hover:text-red-600 dark:hover:text-red-500 transition-colors">
              Home
            </Link>
            <Link href="/live" className="text-neutral-600 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-white transition-colors">
              All Channels
            </Link>
            <Link href="/favorites" className="text-neutral-600 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-white transition-colors">
              Favorites
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Recently Watched */}
        {recentlyWatchedChannels.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">⏱️</span>
              <h2 className="text-3xl font-bold">Continue Watching</h2>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
              {recentlyWatchedChannels.map(channel => (
                <div key={channel.id} className="flex-shrink-0">
                  <ChannelCard channel={channel} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Channels */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🔥</span>
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
            {featuredChannels.slice(0, 8).map(channel => (
              <div key={channel.id} className="flex-shrink-0">
                <ChannelCard channel={channel} />
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        {categories.map(category => {
          const categoryChannels = featuredChannels.filter(c => c.category === category);
          if (categoryChannels.length === 0) return null;

          return (
            <section key={category}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{getCategoryIcon(category)}</span>
                <h2 className="text-3xl font-bold">{category}</h2>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
                {categoryChannels.map(channel => (
                  <div key={channel.id} className="flex-shrink-0">
                    <ChannelCard channel={channel} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
