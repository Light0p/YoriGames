"use client"

import React, { createContext, useContext, useState, useMemo } from 'react';
import { Game } from '@/types/game';

interface GameContextType {
  allGames: Game[];
  loading: boolean;
  error: string | null;
  categories: string[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * GameProvider - Hydrated with static data from the server to prevent loading flickers.
 */
export function GameProvider({ 
  children, 
  initialGames = [] 
}: { 
  children: React.ReactNode; 
  initialGames?: Game[] 
}) {
  // Use initialGames passed from the server (layout.tsx) for instant UI population
  const [allGames] = useState<Game[]>(initialGames);
  const [error] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(allGames.map(g => g.category));
    const cats = Array.from(set).sort();
    return ['All', ...cats.filter(c => c !== 'All')];
  }, [allGames]);

  return (
    <GameContext.Provider value={{ allGames, loading: false, error, categories }}>
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
