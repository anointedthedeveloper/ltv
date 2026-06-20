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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Live TV
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/live" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              All Channels
            </Link>
            <Link href="/favorites" className="text-zinc-900 dark:text-white font-medium hover:text-red-500 transition-colors">
              Favorites
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

        {favoriteChannels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favoriteChannels.map(channel => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-4">
              No favorites yet
            </p>
            <Link
              href="/live"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Browse Channels
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
