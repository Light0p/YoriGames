import gamesData from '@/data/games.json';
import { Game } from '@/types/game';

/**
 * Static-First Data Access Layer
 * No Firestore reads are performed here for public catalog data.
 */

const allGames = gamesData as Game[];

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
  return allGames.find(g => g.slug === slug) || null;
};

export const getFeaturedGames = async (max: number = 10): Promise<Game[]> => {
  return allGames.filter(g => g.featured).slice(0, max);
};

export const getTrendingGames = async (max: number = 10): Promise<Game[]> => {
  return allGames.filter(g => g.trending).slice(0, max);
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
