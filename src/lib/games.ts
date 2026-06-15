import { Game } from '@/types/game';
import gamesData from '../../public/games.json';
import { cache } from 'react';

/**
 * Static-First Data Access Layer (SERVER ONLY)
 * This logic runs only on the server in Next.js Server Components.
 * It prevents the 5,000+ entries in games.json from being sent to the client.
 */
const allGames = (gamesData as any[]).map(g => {
  let normalizedTags: string[] = [];
  if (Array.isArray(g.tags)) {
    normalizedTags = g.tags;
  } else if (typeof g.tags === 'string') {
    normalizedTags = g.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
  }

  return {
    ...g,
    id: g.id || g.gameId,
    title: g.title,
    thumb: g.thumb || g.thumbnail,
    thumbnail: g.thumb || g.thumbnail,
    description: g.description,
    iframe_url: g.iframe_url || g.url,
    category: g.category || 'Arcade',
    slug: g.slug || (g.title ? g.title.toLowerCase().replace(/\s+/g, '-') : g.id),
    rating: g.rating || 5.0,
    play_count: g.play_count || 1000,
    tags: normalizedTags,
    date_added: g.date_added || new Date().toISOString()
  };
}) as Game[];

/**
 * Strategy: Memory-Efficient Pagination
 * Fetches only the requested chunk of data (e.g., 50 games).
 */
export const getPaginatedGames = async (page: number = 1, pageSize: number = 50): Promise<{ games: Game[], total: number }> => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    games: allGames.slice(start, end),
    total: allGames.length
  };
};

export const getPaginatedGamesByCategory = async (category: string, page: number = 1, pageSize: number = 50): Promise<{ games: Game[], total: number }> => {
  const filtered = allGames.filter(g => g.category.toLowerCase() === category.toLowerCase());
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    games: filtered.slice(start, end),
    total: filtered.length
  };
};

export const getSearchableGames = async (max: number = 5000): Promise<Game[]> => {
  return allGames.slice(0, max);
};

export const getDiscoveryGames = async (max: number = 100): Promise<Game[]> => {
  return allGames.slice(0, max);
};

/**
 * Cached Game Fetcher
 * Deduplicates calls within a single render pass (e.g. Metadata + Page)
 */
export const getGameBySlug = cache(async (slug: string): Promise<Game | null> => {
  return allGames.find(g => g.slug === slug || g.id === slug) || null;
});

export const getFeaturedGames = async (max: number = 10): Promise<Game[]> => {
  return allGames.slice(0, max);
};

export const getTrendingGames = async (max: number = 10): Promise<Game[]> => {
  return [...allGames].reverse().slice(0, max);
};

export const getNewArrivals = async (max: number = 10): Promise<Game[]> => {
  return [...allGames].slice(0, max);
};

/**
 * Cached Related Games Fetcher
 */
export const getRelatedGames = cache(async (category: string, currentGameId: string, limitMax: number = 6): Promise<Game[]> => {
  return allGames
    .filter(g => g.category === category && g.id !== currentGameId)
    .slice(0, limitMax);
});

export const getTotalGameCount = async (): Promise<number> => {
  return allGames.length;
};
