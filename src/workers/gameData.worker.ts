/// <reference lib="webworker" />

import Fuse from 'fuse.js';
import { Game } from '../types/game';

let allGames: Game[] = [];
let fuse: Fuse<Game> | null = null;

function normalizeGame(g: any): Game {
  let tags: string[] = [];
  if (Array.isArray(g.tags)) {
    tags = g.tags;
  } else if (typeof g.tags === 'string') {
    tags = g.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
  }

  const title = g.title as string | undefined;
  return {
    ...g,
    slug: g.slug || (title ? String(title).toLowerCase().replace(/\s+/g, '-') : String(g.id)),
    tags,
  } as Game;
}

self.onmessage = async (e: MessageEvent) => {
  const { type, data } = e.data;

  if (type === 'INIT') {
    try {
      const response = await fetch(data.url);
      if (!response.ok) throw new Error('Uplink failed');
      const raw = await response.json();
      
      allGames = (raw as any[]).map(normalizeGame);
      
      fuse = new Fuse(allGames, {
        keys: ['title', 'category', 'tags'],
        threshold: 0.35,
        minMatchCharLength: 2,
      });

      self.postMessage({ type: 'INIT_COMPLETE', allGames });
    } catch (error) {
      self.postMessage({ type: 'ERROR', error: 'FETCH_FAILED' });
    }
  }

  if (type === 'SEARCH') {
    const { query, id } = data;
    
    if (!query || !query.trim()) {
      self.postMessage({ type: 'SEARCH_RESULTS', results: [], id });
      return;
    }

    let results: Game[] = [];

    // Handle Hashtag Search
    if (query.startsWith('#')) {
      const tag = query.substring(1).toLowerCase();
      results = allGames.filter(g => {
        const gameTags = Array.isArray(g.tags) ? g.tags : [];
        const gameCategory = (g.category || "").toLowerCase();
        return gameTags.some(t => String(t).toLowerCase() === tag) || 
               gameCategory === tag;
      });
    } else if (fuse) {
      // Standard Fuzzy Search
      const searchRes = fuse.search(query);
      results = searchRes.map(r => r.item).filter(g => !!g.slug);
    }

    self.postMessage({ type: 'SEARCH_RESULTS', results, id });
  }
};
