
"use client"

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Game } from '@/types/game';

interface GameContextType {
  allGames: Game[];
  loading: boolean;
  error: string | null;
  categories: string[];
}

const DEFAULT_GAMES: any[] = [
  {
    "id": "gm_1",
    "title": "Moto X3M",
    "description": "Moto X3M is an awesome bike racing game.",
    "thumb": "https://img.gamemonetize.com/3p8a6f8b9c8d2e1f0g7h6i5j4k3l2m1n/512x340.jpg",
    "category": "Racing",
    "iframe_url": "https://gamemonetize.com/moto-x3m",
    "slug": "moto-x3m",
    "rating": 4.9
  },
  {
    "id": "gm_2",
    "title": "Basketball Stars",
    "description": "Basketball Stars is a cool 2-player basketball game.",
    "thumb": "https://img.gamemonetize.com/8a7b6c5d4e3f2g1h0i9j8k7l6m5n4o3p/512x340.jpg",
    "category": "Sports",
    "iframe_url": "https://gamemonetize.com/basketball-stars",
    "slug": "basketball-stars",
    "rating": 4.8
  }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch('/games.json');
        if (!response.ok) throw new Error('Catalog signal lost');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setAllGames(data.map(g => ({
            ...g,
            thumbnail: g.thumb || g.thumbnail,
            iframe_url: g.iframe_url || g.url
          })));
        } else {
          setAllGames(DEFAULT_GAMES);
        }
      } catch (err: any) {
        console.error("Static fetch failed, using fallbacks:", err);
        setAllGames(DEFAULT_GAMES);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(allGames.map(g => g.category));
    return Array.from(set).sort();
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
