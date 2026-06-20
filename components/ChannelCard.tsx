import Link from 'next/link';
import Image from 'next/image';
import { Channel } from '@/types/channel';
import { useFavorites } from '@/hooks/useFavorites';

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
      <div className="group relative flex-shrink-0 w-48 cursor-pointer transition-transform hover:scale-105">
        <div className="relative aspect-video bg-zinc-200 dark:bg-zinc-900 rounded-lg overflow-hidden">
          <Image
            src={channel.logo}
            alt={channel.name}
            fill
            unoptimized
            className="object-contain p-4"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white px-4 py-2 rounded-full font-semibold">
              ▶ Live
            </div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-5 h-5 ${favorite ? 'text-red-500 fill-current' : 'text-white'}`}
              fill={favorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {channel.name}
        </p>
      </div>
    </Link>
  );
}
