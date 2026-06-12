/**
 * Server-side compatible utility for fetching and transforming GameMonetize data.
 * This file transforms the raw feed into our standardized Game schema.
 */

const FEED_URL = 'https://gamemonetize.com/feed.php?format=0&num=100&page=1';

export interface GameMonetizeRaw {
  id: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  tags: string;
  thumb: string;
  url: string;
  width: string;
  height: string;
}

export async function fetchGameMonetizeFeed() {
  try {
    const response = await fetch(FEED_URL, {
      next: { revalidate: 0 } 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch GameMonetize feed: ${response.statusText}`);
    }
    
    const games = await response.json();
    
    if (!Array.isArray(games)) {
      throw new Error('Invalid feed format received from GameMonetize');
    }
    
    return games.map((gameData: GameMonetizeRaw, index: number) => {
      const slug = slugify(gameData.title);
      
      // Sensible defaults for homepage sections
      // Featured: Top 20 games
      // Trending: Randomly assigned to create variety
      const isFeatured = index < 20; 
      const isTrending = Math.random() > 0.6;
      
      return {
        gameId: gameData.id,
        title: gameData.title,
        slug: slug,
        description: gameData.description || 'No description provided.',
        instructions: gameData.instructions || 'Follow in-game instructions to play.',
        category: gameData.category || 'Arcade',
        tags: gameData.tags ? gameData.tags.split(',').map((t: string) => t.trim()) : [],
        thumbnail: gameData.thumb || '',
        iframe_url: gameData.url || '',
        width: gameData.width || '800',
        height: gameData.height || '600',
        game_source: 'gamemonetize',
        featured: isFeatured,
        trending: isTrending,
        date_added: new Date().toISOString().split('T')[0],
        play_count: Math.floor(Math.random() * 10000) + 500,
        likes: Math.floor(Math.random() * 1000) + 50,
        rating: Number((4 + Math.random()).toFixed(1)),
        updatedAt: new Date().toISOString()
      };
    });
  } catch (error) {
    console.error('Fetch process failed:', error);
    throw error;
  }
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
