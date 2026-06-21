'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Game } from '@/types/game';

export function useGameDataWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const idCounter = useRef(0);
  const pendingSearches = useRef<Map<number, (value: Game[]) => void>>(new Map());
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL('../workers/gameData.worker.ts', import.meta.url));
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, allGames: games, results, id, error: err } = e.data;

      if (type === 'INIT_COMPLETE') {
        setAllGames(games);
        setLoading(false);
      } else if (type === 'SEARCH_RESULTS') {
        const resolve = pendingSearches.current.get(id);
        if (resolve) {
          resolve(results);
          pendingSearches.current.delete(id);
        }
      } else if (type === 'ERROR') {
        setError(err);
        setLoading(false);
      }
    };

    const buildVersion = Date.now();
    worker.postMessage({ type: 'INIT', data: { url: `/games.json?v=${buildVersion}` } });

    return () => {
      worker.terminate();
    };
  }, []);

  const searchGames = useCallback((query: string): Promise<Game[]> => {
    return new Promise((resolve) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      
      const id = ++idCounter.current;
      pendingSearches.current.set(id, resolve);

      debounceTimer.current = setTimeout(() => {
        workerRef.current?.postMessage({ type: 'SEARCH', data: { query, id } });
      }, 250);
    });
  }, []);

  return { allGames, searchGames, loading, error };
}
