'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import channels from '@/data/channels.json';
import ChannelCard from '@/components/ChannelCard';
import ThemeToggle from '@/components/ThemeToggle';

export default function LivePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Kids', 'Sports', 'News', 'Education', 'Religious', 'Entertainment'] as const;
  
  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || channel.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'All': '📺',
      'Kids': '👶',
      'Sports': '⚽',
      'News': '📰',
      'Education': '🎓',
      'Religious': '⛪',
      'Entertainment': '🎬',
    };
    return icons[category] || '📺';
  };

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
            <Link href="/live" className="text-neutral-900 dark:text-white font-semibold hover:text-red-600 dark:hover:text-red-500 transition-colors">
              All Channels
            </Link>
            <Link href="/favorites" className="text-neutral-600 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-white transition-colors">
              Favorites
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search */}
        <div className="space-y-4">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                <span>{getCategoryIcon(category)}</span>
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Found <span className="font-semibold text-neutral-900 dark:text-white">{filteredChannels.length}</span> channels
          </p>
        </div>

        {/* Channel Grid */}
        {filteredChannels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredChannels.map(channel => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg font-medium mb-2">No channels found</p>
            <p className="text-neutral-500 dark:text-neutral-500 text-sm">Try searching with different keywords or select another category</p>
          </div>
        )}
      </main>
    </div>
  );
}
