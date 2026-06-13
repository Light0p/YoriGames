"use client"

import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import { Game } from '@/types/game';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';

interface GameContextType {
  allGames: Game[];
  loading: boolean;
  error: string | null;
  categories: string[];
  totalPlays: number;
  recordPlay: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const SYNC_INTERVAL = 3 * 60 * 1000; // 3 minutes (Optimization for quota)

export function GameProvider({ 
  children, 
  initialGames = [] 
}: { 
  children: React.ReactNode; 
  initialGames?: Game[] 
}) {
  const [allGames] = useState<Game[]>(initialGames);
  const [totalPlays, setTotalPlays] = useState(0); // STRICT ZERO INITIAL STATE
  const [error, setError] = useState<string | null>(null);
  
  const pendingPlaysRef = useRef(0);
  const isSyncingRef = useRef(false);

  // 1. Fetch initial count from Firestore
  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const statsRef = doc(db, 'stats', 'global');
        const snap = await getDoc(statsRef);
        
        if (snap.exists()) {
          // Use the real number from database, strictly fallback to 0 if missing
          setTotalPlays(snap.data().totalPlays || 0);
        } else {
          // Initialize doc with zero if it doesn't exist. NO MOCK FALLBACKS.
          await setDoc(statsRef, { totalPlays: 0 }, { merge: true });
        }
      } catch (err) {
        console.warn("Stats uplink currently unreachable. Plays will sync when restored.");
      }
    };
    fetchGlobalStats();
  }, []);

  // 2. Batch Sync Logic - Sends accumulated plays to Firestore in one operation
  const syncPendingPlays = async () => {
    if (pendingPlaysRef.current <= 0 || isSyncingRef.current) return;
    
    isSyncingRef.current = true;
    const playsToSync = pendingPlaysRef.current;
    
    try {
      const statsRef = doc(db, 'stats', 'global');
      await updateDoc(statsRef, {
        totalPlays: increment(playsToSync)
      });
      pendingPlaysRef.current -= playsToSync;
    } catch (err) {
      console.error("Failed to sync batched plays:", err);
    } finally {
      isSyncingRef.current = false;
    }
  };

  // Periodic Sync Timer
  useEffect(() => {
    const interval = setInterval(syncPendingPlays, SYNC_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Final Sync attempt on page close
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
    // Instant Optimistic UI Update
    setTotalPlays(prev => prev + 1);
    // Add to queue for batched write
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
