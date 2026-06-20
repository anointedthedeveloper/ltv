'use client';

import { useState, useEffect, useCallback } from 'react';

interface RecentlyWatchedItem {
  channelId: string;
  timestamp: number;
}

export function useRecentlyWatched() {
  const [recentlyWatched, setRecentlyWatched] = useState<RecentlyWatchedItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('recentlyWatched');
    if (saved) {
      setRecentlyWatched(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('recentlyWatched', JSON.stringify(recentlyWatched));
    }
  }, [recentlyWatched, mounted]);

  const addToRecentlyWatched = useCallback((channelId: string) => {
    setRecentlyWatched(prev => {
      const filtered = prev.filter(item => item.channelId !== channelId);
      return [{ channelId, timestamp: Date.now() }, ...filtered].slice(0, 10);
    });
  }, []);

  const getRecentlyWatchedIds = useCallback(() => {
    return recentlyWatched.map(item => item.channelId);
  }, [recentlyWatched]);

  return { recentlyWatched, addToRecentlyWatched, getRecentlyWatchedIds };
}
