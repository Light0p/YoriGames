"use client"

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Game } from '@/types/game';
import fallbackGames from '@/data/games.json';

interface GameContextType {
  allGames: Game[];
  loading: boolean;
  error: string | null;
  categories: string[];
}

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
        
        if (Array.isArray(data) && data.length > 0) {
          setAllGames(data);
        } else {
          console.warn("Catalog empty, using local backup.");
          setAllGames(fallbackGames as Game[]);
        }
      } catch (err) {
        console.error("Static fetch failed, using fallback:", err);
        setAllGames(fallbackGames as Game[]);
        setError("Local storage active.");
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
