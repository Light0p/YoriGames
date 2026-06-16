'use client';

import { useSyncExternalStore, useCallback } from 'react';

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

const STORAGE_KEY_RECENT = 'yori_recent_plays';
const STORAGE_KEY_FAVORITES = 'yori_favorites_map';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('arcade-state-update', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('arcade-state-update', callback);
  };
}

const getDefaultState = (): ArcadeState => ({
  recent: [],
  favorites: {},
});

// Module-level caches for reference stability
let _rawCache: string | null = null;
let _parsedCache: ArcadeState | null = null;

function getSnapshot(): ArcadeState {
  if (typeof window === 'undefined') return getDefaultState();

  const recentRaw = localStorage.getItem(STORAGE_KEY_RECENT) ?? '[]';
  const favoritesRaw = localStorage.getItem(STORAGE_KEY_FAVORITES) ?? '{}';
  const combinedRaw = `${recentRaw}|${favoritesRaw}`;

  if (combinedRaw !== _rawCache) {
    _rawCache = combinedRaw;
    try {
      _parsedCache = {
        recent: JSON.parse(recentRaw),
        favorites: JSON.parse(favoritesRaw),
      };
    } catch (e) {
      console.error("Arcade state parse failed", e);
      _parsedCache = getDefaultState();
    }
  }

  return _parsedCache!;
}

function getServerSnapshot() {
  return getDefaultState();
}

export function useArcadeState() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addRecent = useCallback((game: Omit<ArcadeGame, 'timestamp'>) => {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY_RECENT) || '[]') as ArcadeGame[];
    const filtered = current.filter((g) => g.slug !== game.slug);
    const updated = [{ ...game, timestamp: Date.now() }, ...filtered].slice(0, 10);
    localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updated));
    window.dispatchEvent(new Event('arcade-state-update'));
  }, []);

  const toggleFavorite = useCallback((game: Omit<ArcadeGame, 'timestamp'>) => {
    const currentRaw = localStorage.getItem(STORAGE_KEY_FAVORITES) || '{}';
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

    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(current));
    window.dispatchEvent(new Event('arcade-state-update'));
  }, []);

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
