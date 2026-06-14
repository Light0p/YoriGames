"use client"

import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import { Game } from '@/types/game';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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

const SYNC_INTERVAL = 3 * 60 * 1000; // 3 minutes

export function GameProvider({ 
  children, 
  initialGames = [],
  initialTotalGames = 0
}: { 
  children: React.ReactNode; 
  initialGames?: Game[];
  initialTotalGames?: number;
}) {
  const [allGames] = useState<Game[]>(initialGames);
  const [totalGames] = useState<number>(initialTotalGames);
  const [totalPlays, setTotalPlays] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const pendingPlaysRef = useRef(0);
  const isSyncingRef = useRef(false);

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
    const interval = setInterval(syncPendingPlays, SYNC_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      if (pendingPlaysRef.current > 0) {
        syncPendingPlays();
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
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
      loading: false, 
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