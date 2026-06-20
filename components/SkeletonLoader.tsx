/**
 * Skeleton loader components for loading states
 */

export function ChannelCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-48 animate-pulse">
      <div className="aspect-video bg-neutral-800 rounded-xl" />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-neutral-800 rounded w-3/4" />
        <div className="h-3 bg-neutral-800 rounded w-1/2" />
      </div>
    </div>
  );
}

export function ChannelGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ChannelCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSectionSkeleton() {
  return (
    <div className="relative mb-8 overflow-hidden">
      <div className="h-96 bg-gradient-to-b from-neutral-900 to-neutral-950 animate-pulse rounded-lg" />
      <div className="relative px-4 sm:px-6 lg:px-8 -mt-16 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-neutral-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryRowSkeleton() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-neutral-800 rounded animate-pulse" />
        <div className="h-8 bg-neutral-800 rounded w-40 animate-pulse" />
      </div>
      <div className="flex gap-6 pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ChannelCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function SearchSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-neutral-800 rounded-xl w-full" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 bg-neutral-800 rounded-full w-20" />
        ))}
      </div>
    </div>
  );
}

export function VideoPlayerSkeleton() {
  return (
    <div className="w-full bg-black rounded-lg overflow-hidden shadow-2xl animate-pulse">
      <div className="w-full aspect-video bg-neutral-800" />
    </div>
  );
}
