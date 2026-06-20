'use client';

import Link from 'next/link';
import channels from '@/data/channels.json';
import ChannelCard from '@/components/ChannelCard';
import ThemeToggle from '@/components/ThemeToggle';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  
  const favoriteChannels = channels.filter(channel => favorites.includes(channel.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-3xl">📺</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Live TV
            </h1>
          </Link>
          <nav className="flex gap-8 items-center">
            <Link href="/" className="text-neutral-600 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/live" className="text-neutral-600 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-white transition-colors">
              All Channels
            </Link>
            <Link href="/favorites" className="text-neutral-900 dark:text-white font-semibold hover:text-red-600 dark:hover:text-red-500 transition-colors">
              Favorites
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">❤️</span>
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-auto">({favoriteChannels.length} channels)</span>
        </div>

        {favoriteChannels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favoriteChannels.map(channel => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg font-medium mb-6">
              No favorites yet
            </p>
            <Link
              href="/live"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <span>Browse Channels</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
