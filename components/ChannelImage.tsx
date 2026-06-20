'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ChannelImageProps {
  src: string;
  alt: string;
  icon?: string;
  fallback?: string;
  fill?: boolean;
  className?: string;
}

export default function ChannelImage({
  src,
  alt,
  icon = '📺',
  fallback,
  fill = false,
  className = '',
}: ChannelImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(!src);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Show fallback if no image or image failed to load
  if (hasError || !src) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">{icon || fallback || '📺'}</div>
          <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{alt}</p>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <>
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          onLoadingComplete={handleLoadingComplete}
          onError={handleError}
          className={`object-contain p-4 ${className}`}
        />
        {(isLoading || hasError) && (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">{icon || fallback || '📺'}</div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        onLoad={handleLoadingComplete}
        onError={handleError}
        className={`object-contain w-full h-full ${className}`}
      />
      {(isLoading || hasError) && (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-2">{icon || fallback || '📺'}</div>
          </div>
        </div>
      )}
    </>
  );
}
