import gamesData from '@/data/games.json';
import { Game } from '@/types/game';

/**
 * Data Access Layer for the YoriGames catalog.
 * This abstraction allows us to swap local JSON for Firestore/API fetching later.
 */

export const getAllGames = (): Game[] => {
  return gamesData as Game[];
};

export const getGameBySlug = (slug: string): Game | undefined => {
  return getAllGames().find((g) => g.slug === slug);
};

export const getGamesByCategory = (category: string): Game[] => {
  return getAllGames().filter((g) => g.category.toLowerCase() === category.toLowerCase());
};

export const getFeaturedGames = (): Game[] => {
  return getAllGames().filter((g) => g.featured);
};

export const getTrendingGames = (): Game[] => {
  return getAllGames().filter((g) => g.trending);
};

export const getNewArrivals = (limit: number = 5): Game[] => {
  return [...getAllGames()]
    .sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime())
    .slice(0, limit);
};

export const searchGames = (query: string): Game[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  return getAllGames().filter((g) => 
    g.title.toLowerCase().includes(q) || 
    g.category.toLowerCase().includes(q) ||
    g.tags.some(t => t.toLowerCase().includes(q))
  );
};

export const getRelatedGames = (currentGame: Game, limit: number = 4): Game[] => {
  return getAllGames()
    .filter(g => g.id !== currentGame.id && g.category === currentGame.category)
    .slice(0, limit);
};
