'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import channels from '@/data/channels.json';
import ChannelCard from '@/components/ChannelCard';
import ThemeToggle from '@/components/ThemeToggle';

export default function LivePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Kids', 'News', 'Education', 'Religious', 'Entertainment'] as const;
  
  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || channel.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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
            <Link href="/live" className="text-white dark:text-white text-zinc-900 font-medium hover:text-red-500 transition-colors">
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
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900 dark:bg-zinc-900 bg-white border border-zinc-800 dark:border-zinc-800 border-zinc-300 rounded-lg text-white dark:text-white text-zinc-900 placeholder-zinc-500 dark:placeholder-zinc-500 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-900 dark:bg-zinc-900 bg-zinc-200 text-zinc-400 dark:text-zinc-400 text-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-800 hover:bg-zinc-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredChannels.map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>

        {filteredChannels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400 dark:text-zinc-400 text-zinc-600 text-lg">No channels found</p>
          </div>
        )}
      </main>
    </div>
  );
}
