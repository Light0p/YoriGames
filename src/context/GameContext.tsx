"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Game } from '@/types/game';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { yieldToMain } from '@/lib/yieldToMain';

interface GameContextType {
  allGames: Game[];
  totalGames: number;
  loading: boolean;
  error: string | null;
  categories: string[];
  totalPlays: number;
  recordPlay: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const buildVersion = typeof window !== 'undefined' ? Date.now() : 0;
const NORMALIZE_CHUNK_SIZE = 250;

function normalizeGame(g: Record<string, unknown>): Game {
  let tags: string[] = [];
  if (Array.isArray(g.tags)) {
    tags = g.tags as string[];
  } else if (typeof g.tags === 'string') {
    tags = g.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
  }

  const title = g.title as string | undefined;
  return {
    ...(g as unknown as Game),
    slug: (g.slug as string) || (title ? String(title).toLowerCase().replace(/\s+/g, '-') : String(g.id)),
    tags,
  };
}

/** Process 5,000+ games in chunks so the main thread can paint between batches. */
async function normalizeLibraryInChunks(raw: Record<string, unknown>[]): Promise<Game[]> {
  const result: Game[] = [];

  for (let i = 0; i < raw.length; i += NORMALIZE_CHUNK_SIZE) {
    const end = Math.min(i + NORMALIZE_CHUNK_SIZE, raw.length);
    for (let j = i; j < end; j++) {
      result.push(normalizeGame(raw[j]));
    }
    if (end < raw.length) {
      await yieldToMain();
    }
  }

  return result;
}

export function GameProvider({ 
  children, 
  initialGames = [],
  initialTotalGames = 0
}: { 
  children: React.ReactNode; 
  initialGames?: Game[];
  initialTotalGames?: number;
}) {
  const [allGames, setAllGames] = useState<Game[]>(initialGames);
  const [totalGames, setTotalGames] = useState<number>(initialTotalGames);
  const [totalPlays, setTotalPlays] = useState(0);
  const [loading, setLoading] = useState(allGames.length === 0);
  const [error, setError] = useState<string | null>(null);
  
  const pendingPlaysRef = useRef(0);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const loadLibrary = async () => {
      try {
        const response = await fetch(`/games.json?v=${buildVersion}`);
        if (!response.ok) throw new Error('Uplink failed');
        const data = await response.json();

        const normalized = await normalizeLibraryInChunks(data as Record<string, unknown>[]);
        if (cancelled) return;

        setAllGames(normalized);
        setTotalGames(normalized.length);
      } catch (err) {
        console.error("Failed to load game library:", err);
        if (!cancelled) setError("SEARCH_OFFLINE");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (allGames.length === 0) {
      loadLibrary();
    }

    return () => {
      cancelled = true;
    };
  }, [allGames.length]);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const statsRef = doc(db, 'stats', 'global');
        const snap = await getDoc(statsRef);
        
        if (snap.exists()) {
          setTotalPlays(snap.data().totalPlays || 0);
        } else {
          setDoc(statsRef, { totalPlays: 0 }, { merge: true }).catch((err: { code?: string }) => {
            if (err.code === 'permission-denied') {
              const permissionError = new FirestorePermissionError({
                path: statsRef.path,
                operation: 'write',
                requestResourceData: { totalPlays: 0 }
              });
              errorEmitter.emit('permission-error', permissionError);
            }
          });
        }
      } catch (err) {
        console.warn("Stats uplink currently unreachable.");
      }
    };
    fetchGlobalStats();
  }, []);

  const syncPendingPlays = () => {
    if (pendingPlaysRef.current <= 0 || isSyncingRef.current) return;
    
    isSyncingRef.current = true;
    const playsToSync = pendingPlaysRef.current;
    const statsRef = doc(db, 'stats', 'global');
    
    updateDoc(statsRef, {
      totalPlays: increment(playsToSync)
    })
    .then(() => {
      pendingPlaysRef.current -= playsToSync;
    })
    .catch(async (err: { code?: string }) => {
      if (err.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
          path: statsRef.path,
          operation: 'update',
          requestResourceData: { totalPlays: `increment(${playsToSync})` }
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    })
    .finally(() => {
      isSyncingRef.current = false;
    });
  };

  useEffect(() => {
    const interval = setInterval(syncPendingPlays, 180000);
    return () => clearInterval(interval);
  }, []);

  const recordPlay = () => {
    setTotalPlays(prev => prev + 1);
    pendingPlaysRef.current += 1;
  };

  const categories = React.useMemo(() => {
    const set = new Set(allGames.map(g => g.category));
    const cats = Array.from(set).sort();
    return ['All', ...cats.filter(c => c !== 'All')];
  }, [allGames]);

  return (
    <GameContext.Provider value={{ 
      allGames,
      totalGames,
      loading, 
      error, 
      categories, 
      totalPlays,
      recordPlay
    }}>
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
