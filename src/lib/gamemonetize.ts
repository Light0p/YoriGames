/**
 * Server-side compatible utility for fetching and transforming GameMonetize data.
 * This file transforms the raw feed into our standardized Game schema.
 * Now supports pagination to fetch the entire catalog.
 */

const BASE_FEED_URL = 'https://gamemonetize.com/feed.php?format=0&num=100';

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

export async function fetchGameMonetizeFeed(page: number = 1) {
  try {
    const response = await fetch(`${BASE_FEED_URL}&page=${page}`, {
      next: { revalidate: 0 } 
    });
    
    if (!response.ok) {
      // Create a rich error object to pass the status code back up
      const error: any = new Error(`Failed to fetch GameMonetize feed (Page ${page}): ${response.statusText}`);
      error.status = response.status;
      throw error;
    }
    
    const games = await response.json();
    
    if (!Array.isArray(games)) {
      // If we get something that isn't an array, it might be the end of the feed or an error
      return [];
    }
    
    return games.map((gameData: GameMonetizeRaw, index: number) => {
      const slug = slugify(gameData.title);
      
      // Sensible defaults for homepage sections
      // Featured: Top 20 games of the first page
      // Trending: Randomly assigned to create variety
      const isFeatured = page === 1 && index < 20; 
      const isTrending = Math.random() > 0.7;
      
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
    console.error(`Fetch process failed for page ${page}:`, error);
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
