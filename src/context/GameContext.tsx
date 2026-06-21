"use client"

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { Game } from '@/types/game';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useGameDataWorker } from '@/hooks/useGameDataWorker';

interface GameContextType {
  allGames: Game[];
  totalGames: number;
  loading: boolean;
  error: string | null;
  categories: string[];
  totalPlays: number;
  recordPlay: () => void;
  searchGames: (query: string) => Promise<Game[]>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ 
  children, 
  initialGames = [],
  initialTotalGames = 0
}: { 
  children: React.ReactNode; 
  initialGames?: Game[];
  initialTotalGames?: number;
}) {
  const { allGames: workerGames, loading: workerLoading, error: workerError, searchGames } = useGameDataWorker();
  const [allGames, setAllGames] = useState<Game[]>(initialGames);
  const [totalGames, setTotalGames] = useState<number>(initialTotalGames);
  const [totalPlays, setTotalPlays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const pendingPlaysRef = useRef(0);
  const isSyncingRef = useRef(false);

  // Sync worker data to context state
  useEffect(() => {
    if (!workerLoading) {
      setAllGames(workerGames);
      setTotalGames(workerGames.length);
      setLoading(false);
      setError(workerError);
    }
  }, [workerLoading, workerGames, workerError]);

  // Fetch Global Stats (Main Thread only as it uses Firebase Auth/SDK)
  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const statsRef = doc(db, 'stats', 'global');
        const snap = await getDoc(statsRef);
        
        if (snap.exists()) {
          setTotalPlays(snap.data().totalPlays || 0);
        } else {
          setDoc(statsRef, { totalPlays: 0 }, { merge: true }).catch((err: any) => {
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
    .catch(async (err: any) => {
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

  const categories = useMemo(() => {
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
      recordPlay,
      searchGames
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
