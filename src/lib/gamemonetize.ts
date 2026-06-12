import { db } from '@/firebase';
import { collection, doc, setDoc, getDocs, query, where, limit } from 'firebase/firestore';
import { Game } from '@/types/game';

const FEED_URL = 'https://gamemonetize.com/feed.php?format=0&num=50&page=1';

export async function importGameMonetizeFeed() {
  const stats = { imported: 0, updated: 0, failed: 0 };
  
  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) throw new Error('Failed to fetch GameMonetize feed');
    
    const games = await response.json();
    
    for (const gameData of games) {
      try {
        const slug = slugify(gameData.title);
        const gameId = gameData.id;
        
        const gameRef = doc(db, 'games', `gm_${gameId}`);
        
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
          featured: Math.random() > 0.8, // Randomly feature some games
          trending: Math.random() > 0.7,
          date_added: new Date().toISOString().split('T')[0],
          play_count: Math.floor(Math.random() * 5000),
          likes: Math.floor(Math.random() * 500),
          rating: 4 + Math.random(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(gameRef, gameObj, { merge: true });
        stats.imported++;
      } catch (err) {
        console.error(`Failed to import game ${gameData.title}:`, err);
        stats.failed++;
      }
    }
  } catch (error) {
    console.error('Import process failed:', error);
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
