'use client';

import { useSyncExternalStore, useCallback, useMemo } from 'react';
import { useUser } from '@/firebase';

export interface ArcadeGame {
  slug: string;
  title: string;
  category: string;
  thumb: string;
  timestamp: number;
}

interface ArcadeState {
  recent: ArcadeGame[];
  favorites: Record<string, ArcadeGame>;
}

const DEFAULT_STATE: ArcadeState = {
  recent: [],
  favorites: {},
};

// Module-level caches for reference stability, keyed by UID to prevent leakage
const _rawCaches: Record<string, string> = {};
const _parsedCaches: Record<string, ArcadeState> = {};

export function useArcadeState() {
  const { user } = useUser();
  const uid = user?.uid || 'guest';

  // Scoped keys for strict auth isolation
  const RECENT_KEY = `yori_recent_${uid}`;
  const FAVORITES_KEY = `yori_favs_${uid}`;

  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback);
    window.addEventListener('arcade-state-update', callback);
    return () => {
      window.removeEventListener('storage', callback);
      window.removeEventListener('arcade-state-update', callback);
    };
  }, []);

  const getSnapshot = useCallback((): ArcadeState => {
    if (typeof window === 'undefined') return DEFAULT_STATE;

    const recentRaw = localStorage.getItem(RECENT_KEY) ?? '[]';
    const favoritesRaw = localStorage.getItem(FAVORITES_KEY) ?? '{}';
    const combinedRaw = `${uid}|${recentRaw}|${favoritesRaw}`;

    if (combinedRaw !== _rawCaches[uid]) {
      _rawCaches[uid] = combinedRaw;
      try {
        _parsedCaches[uid] = {
          recent: JSON.parse(recentRaw),
          favorites: JSON.parse(favoritesRaw),
        };
      } catch (e) {
        console.error("Arcade state parse failed for user", uid, e);
        _parsedCaches[uid] = DEFAULT_STATE;
      }
    }

    return _parsedCaches[uid];
  }, [uid, RECENT_KEY, FAVORITES_KEY]);

  const getServerSnapshot = () => DEFAULT_STATE;

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addRecent = useCallback((game: Omit<ArcadeGame, 'timestamp'>) => {
    const current = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as ArcadeGame[];
    const filtered = current.filter((g) => g.slug !== game.slug);
    const updated = [{ ...game, timestamp: Date.now() }, ...filtered].slice(0, 12);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('arcade-state-update'));
  }, [RECENT_KEY]);

  const toggleFavorite = useCallback((game: Omit<ArcadeGame, 'timestamp'>) => {
    const currentRaw = localStorage.getItem(FAVORITES_KEY) || '{}';
    let current: Record<string, ArcadeGame> = {};
    try {
      current = JSON.parse(currentRaw);
    } catch (e) {
      current = {};
    }

    if (current[game.slug]) {
      delete current[game.slug];
    } else {
      current[game.slug] = { ...game, timestamp: Date.now() };
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('arcade-state-update'));
  }, [FAVORITES_KEY]);

  const isFavorite = useCallback((slug: string) => {
    return !!state.favorites[slug];
  }, [state.favorites]);

  return {
    recent: state.recent,
    favorites: Object.values(state.favorites).sort((a, b) => b.timestamp - a.timestamp),
    addRecent,
    toggleFavorite,
    isFavorite,
  };
}
