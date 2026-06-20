'use client';

import Link from 'next/link';
import { Channel } from '@/types/channel';
import { useFavorites } from '@/hooks/useFavorites';
import ChannelImage from './ChannelImage';

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(channel.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(channel.id);
  };

  return (
    <Link href={`/watch/${channel.id}`}>
      <div className="group relative flex-shrink-0 w-48 cursor-pointer">
        <div className="relative aspect-video bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0">
            <ChannelImage
              src={channel.logo}
              alt={channel.name}
              icon={channel.icon}
              className="p-4"
            />
          </div>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/0 group-hover:from-black/80 transition-colors opacity-0 group-hover:opacity-100 flex items-end justify-between p-3">
            <div className="flex-1">
              <p className="text-white text-sm font-semibold line-clamp-1">{channel.name}</p>
              <p className="text-neutral-300 text-xs">{channel.country}</p>
            </div>
            <div className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity delay-100 pl-2">
              ▶
            </div>
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-5 h-5 ${favorite ? 'text-red-500 fill-current' : 'text-white'}`}
              fill={favorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={favorite ? 0 : 2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
        
        {/* Title below card */}
        <div className="mt-3 space-y-1">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
            {channel.name}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {channel.category}
          </p>
        </div>
      </div>
    </Link>
  );
}
