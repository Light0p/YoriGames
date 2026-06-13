"use client"

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Game } from '@/types/game';

// Bulletproof fallback data to ensure the UI never shows "0 games"
const DEFAULT_GAMES: Game[] = [
  {
    id: "gm_1",
    title: "Moto X3M",
    slug: "moto-x3m",
    description: "Moto X3M is an awesome bike racing game.",
    instructions: "Use arrows to move.",
    thumbnail: "https://img.gamemonetize.com/3p8a6f8b9c8d2e1f0g7h6i5j4k3l2m1n/512x340.jpg",
    category: "Racing",
    tags: ["racing", "bike", "physics"],
    iframe_url: "https://gamemonetize.com/moto-x3m",
    featured: true,
    trending: true,
    date_added: "2024-01-01",
    play_count: 15200,
    likes: 450,
    rating: 4.9,
    game_source: "gamemonetize"
  }
];

interface GameContextType {
  allGames: Game[];
  loading: boolean;
  error: string | null;
  categories: string[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [allGames, setAllGames] = useState<Game[]>(DEFAULT_GAMES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        // Fetch from the root path (public/games.json)
        const response = await fetch('/games.json');
        
        if (!response.ok) {
          console.warn('Game catalog fetch failed. Using internal defaults.');
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          // Standardize data from any source
          const normalizedGames = data.map((g: any) => ({
            ...g,
            id: g.id || g.gameId,
            thumbnail: g.thumb || g.thumbnail || '',
            iframe_url: g.iframe_url || g.url || '',
            slug: g.slug || (g.title ? g.title.toLowerCase().replace(/\s+/g, '-') : g.id)
          })) as Game[];
          
          setAllGames(normalizedGames);
        }
      } catch (err: any) {
        console.error('Game catalog system error:', err.message);
        setError('System operating on backup data uplink.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(allGames.map(g => g.category));
    const cats = Array.from(set).sort();
    return cats;
  }, [allGames]);

  return (
    <GameContext.Provider value={{ allGames, loading, error, categories }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameStore() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameStore must be used within a GameProvider');
  }
  return context;
}
