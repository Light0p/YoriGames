import { Game } from '@/types/game';
import gamesData from './games-data.json';

/**
 * Static-First Data Access Layer
 * Standardizes data on the server side to match the UI keys.
 */
const allGames = (gamesData as any[]).map(g => ({
  ...g,
  id: g.id || g.gameId,
  title: g.title,
  thumbnail: g.thumb || g.thumbnail,
  description: g.description,
  iframe_url: g.iframe_url || g.url,
  category: g.category || 'Arcade',
  slug: g.slug || (g.title ? g.title.toLowerCase().replace(/\s+/g, '-') : g.id),
  rating: g.rating || 5.0,
  play_count: g.play_count || 1000,
  tags: g.tags || [],
  date_added: g.date_added || new Date().toISOString()
})) as Game[];

export const getPaginatedGames = async (page: number = 1, pageSize: number = 24): Promise<{ games: Game[], total: number }> => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const sorted = [...allGames].sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime());
  
  return {
    games: sorted.slice(start, end),
    total: allGames.length
  };
};

export const getSearchableGames = async (max: number = 5000): Promise<Game[]> => {
  return allGames.slice(0, max);
};

export const getDiscoveryGames = async (max: number = 100): Promise<Game[]> => {
  return allGames.slice(0, max);
};

export const getPaginatedGamesByCategory = async (category: string, page: number = 1, pageSize: number = 24): Promise<{ games: Game[], total: number }> => {
  const filtered = allGames.filter(g => g.category.toLowerCase() === category.toLowerCase());
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    games: filtered.slice(start, end),
    total: filtered.length
  };
};

export const getGameBySlug = async (slug: string): Promise<Game | null> => {
  return allGames.find(g => g.slug === slug || g.id === slug) || null;
};

export const getFeaturedGames = async (max: number = 10): Promise<Game[]> => {
  return allGames.slice(0, max);
};

export const getTrendingGames = async (max: number = 10): Promise<Game[]> => {
  return [...allGames].reverse().slice(0, max);
};

export const getNewArrivals = async (max: number = 10): Promise<Game[]> => {
  return [...allGames]
    .sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime())
    .slice(0, max);
};

export const getRelatedGames = async (category: string, currentGameId: string, limitMax: number = 6): Promise<Game[]> => {
  return allGames
    .filter(g => g.category === category && g.id !== currentGameId)
    .slice(0, limitMax);
};

export const getTotalGameCount = async (): Promise<number> => {
  return allGames.length;
};
