'use client';

import { useSyncExternalStore, useCallback } from 'react';

export interface ArcadeGame {
  slug: string;
  title: string;
  category: string;
  thumb: string;
  timestamp: number;
}

const STORAGE_KEY_RECENT = 'yori_recent_plays';
const STORAGE_KEY_FAVORITES = 'yori_favorites';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('arcade-state-update', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('arcade-state-update', callback);
  };
}

function getSnapshot() {
  if (typeof window === 'undefined') return { recent: [], favorites: [] };
  try {
    return {
      recent: JSON.parse(localStorage.getItem(STORAGE_KEY_RECENT) || '[]') as ArcadeGame[],
      favorites: JSON.parse(localStorage.getItem(STORAGE_KEY_FAVORITES) || '[]') as ArcadeGame[],
    };
  } catch (e) {
    return { recent: [], favorites: [] };
  }
}

function getServerSnapshot() {
  return { recent: [], favorites: [] };
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
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY_FAVORITES) || '[]') as ArcadeGame[];
    const isFav = current.some((g) => g.slug === game.slug);
    let updated;
    if (isFav) {
      updated = current.filter((g) => g.slug !== game.slug);
    } else {
      updated = [{ ...game, timestamp: Date.now() }, ...current];
    }
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
    window.dispatchEvent(new Event('arcade-state-update'));
  }, []);

  const isFavorite = useCallback((slug: string) => {
    return state.favorites.some((g) => g.slug === slug);
  }, [state.favorites]);

  return {
    recent: state.recent,
    favorites: state.favorites,
    addRecent,
    toggleFavorite,
    isFavorite,
  };
}
