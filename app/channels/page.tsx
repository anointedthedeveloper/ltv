'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import curatedChannels from '@/data/curated-channels.json';
import ThemeToggle from '@/components/ThemeToggle';
import type { Channel, ChannelCategory } from '@/types/channel';

const CATEGORIES: ChannelCategory[] = ['Kids', 'News', 'Music', 'Religious', 'Sports', 'Entertainment', 'Movies', 'Nigerian'];

interface FilterState {
  search: string;
  category: string;
  country: string;
  language: string;
}

export default function ChannelsDirectoryPage() {
  const channels = curatedChannels as Channel[];
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    country: 'All',
    language: 'All',
  });
  
  // Extract unique values for filters
  const countries = useMemo(() => {
    const c = new Set(channels.map(ch => ch.country));
    return Array.from(c).sort();
  }, [channels]);

  const languages = useMemo(() => {
    const l = new Set(channels.map(ch => ch.language));
    return Array.from(l).sort();
  }, [channels]);

  // Filter channels
  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'All' || channel.category === filters.category;
      const matchesCountry = filters.country === 'All' || channel.country === filters.country;
      const matchesLanguage = filters.language === 'All' || channel.language === filters.language;
      return matchesSearch && matchesCategory && matchesCountry && matchesLanguage;
    });
  }, [channels, filters]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-3xl">📺</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
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
            <Link href="/channels" className="text-white font-semibold hover:text-red-500 transition-colors">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Channel Directory</h1>
          <p className="text-neutral-400">Browse and filter all available live TV channels</p>
        </div>

        {/* Filters */}
        <div className="bg-neutral-900 rounded-lg p-6 mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search channel name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Country</label>
                <select
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="All">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="All">All Languages</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {/* Active Status */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Status</label>
                <select
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="active">Active Streams</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Results <span className="text-red-500">({filteredChannels.length})</span>
            </h2>
            <p className="text-sm text-neutral-400">
              Showing channels matching your filters
            </p>
          </div>
        </div>

        {/* Channels Table */}
        {filteredChannels.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-300">Channel</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-300">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-300">Country</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-300">Language</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-300">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredChannels.map((channel) => (
                  <tr
                    key={channel.id}
                    className="border-b border-neutral-800 hover:bg-neutral-900/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center flex-shrink-0">
                          {channel.logo ? (
                            <img
                              src={channel.logo}
                              alt={channel.name}
                              className="w-full h-full object-contain p-1 rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-xs text-neutral-500">N/A</span>
                          )}
                        </div>
                        <span className="font-medium truncate">{channel.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-400">{channel.category}</td>
                    <td className="py-3 px-4 text-neutral-400">{channel.country}</td>
                    <td className="py-3 px-4 text-neutral-400">{channel.language.toUpperCase()}</td>
                    <td className="py-3 px-4">
                      {channel.active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                          <span className="w-2 h-2 bg-green-400 rounded-full" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-700/50 text-neutral-400 rounded text-xs font-medium">
                          <span className="w-2 h-2 bg-neutral-600 rounded-full" />
                          Offline
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/watch/${channel.slug}`}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        Watch
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-medium text-neutral-300">No channels found</p>
            <p className="text-sm text-neutral-400 mt-2">Try adjusting your filters</p>
          </div>
        )}
      </main>
    </div>
  );
}
