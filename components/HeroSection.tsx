'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Channel } from '@/types/channel';

interface HeroSectionProps {
  channels: Channel[];
}

export default function HeroSection({ channels }: HeroSectionProps) {
  if (channels.length === 0) return null;

  // Rotate featured channels
  const featured = channels[0];
  const secondaryChannels = channels.slice(1, 4);

  return (
    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8 overflow-hidden">
      {/* Main Hero Banner */}
      <div className="relative h-96 bg-gradient-to-b from-neutral-900 to-neutral-950 overflow-hidden group">
        {/* Background Logo */}
        <div className="absolute inset-0 opacity-20">
          <img
            src={featured.logo}
            alt={featured.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

        {/* Content */}
        <div className="relative h-full px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Now Streaming
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
              {featured.name}
            </h1>

            {/* Description */}
            <p className="text-neutral-300 text-lg max-w-xl">
              {featured.category} • {featured.country} • Live Stream
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-4">
              <Link
                href={`/watch/${featured.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </Link>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More Info
              </button>
            </div>
          </div>
        </div>

        {/* Live Indicator Animation */}
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="text-white text-xs font-semibold">LIVE</span>
        </div>
      </div>

      {/* Secondary Featured Cards */}
      {secondaryChannels.length > 0 && (
        <div className="relative px-4 sm:px-6 lg:px-8 -mt-16 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {secondaryChannels.map((channel) => (
              <Link
                key={channel.id}
                href={`/watch/${channel.slug}`}
                className="group relative h-48 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-neutral-950" />
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity p-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-4">
                  <div>
                    <p className="text-white font-semibold text-sm">{channel.name}</p>
                    <p className="text-neutral-400 text-xs">{channel.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
