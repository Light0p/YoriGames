import { db } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Game } from '@/types/game';

const FEED_URL = 'https://gamemonetize.com/feed.php?format=0&num=50&page=1';

/**
 * Server-side function to import or update games from GameMonetize.
 * Standardizes data and adds defaults for homepage sections (featured/trending).
 */
export async function importGameMonetizeFeed() {
  const stats = { imported: 0, updated: 0, failed: 0 };
  
  try {
    const response = await fetch(FEED_URL, {
      next: { revalidate: 0 } // Bypass cache for import
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch GameMonetize feed: ${response.statusText}`);
    }
    
    const games = await response.json();
    
    if (!Array.isArray(games)) {
      throw new Error('Invalid feed format received from GameMonetize');
    }
    
    for (const gameData of games) {
      try {
        const gameId = gameData.id;
        const slug = slugify(gameData.title);
        
        const gameRef = doc(db, 'games', `gm_${gameId}`);
        
        // Sensible defaults for homepage visibility
        // We make about 20% featured and 30% trending randomly if not specified
        const isFeatured = Math.random() > 0.8;
        const isTrending = Math.random() > 0.7;
        
        const gameObj: Partial<Game> = {
          gameId: gameId,
          title: gameData.title,
          slug: slug,
          description: gameData.description || '',
          instructions: gameData.instructions || '',
          category: gameData.category || 'Arcade',
          tags: gameData.tags ? gameData.tags.split(',').map((t: string) => t.trim()) : [],
          thumbnail: gameData.thumb || '',
          iframe_url: gameData.url || '',
          width: gameData.width || '800',
          height: gameData.height || '600',
          game_source: 'gamemonetize',
          featured: isFeatured,
          trending: isTrending,
          // Standardize date for "New Arrivals" sorting
          date_added: new Date().toISOString().split('T')[0],
          play_count: Math.floor(Math.random() * 5000),
          likes: Math.floor(Math.random() * 500),
          rating: Number((4 + Math.random()).toFixed(1)),
          updatedAt: new Date().toISOString()
        };

        await setDoc(gameRef, gameObj, { merge: true });
        stats.imported++;
      } catch (err) {
        console.error(`Failed to process game ${gameData.title}:`, err);
        stats.failed++;
      }
    }
  } catch (error) {
    console.error('Import process failed at server:', error);
    throw error;
  }
  
  return stats;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
