export interface Game {
  id: string;
  gameId?: string; // Original GameMonetize ID
  title: string;
  slug: string;
  description: string;
  instructions: string;
  thumbnail: string;
  category: string;
  tags: string[];
  iframe_url: string;
  featured: boolean;
  trending: boolean;
  date_added: string;
  play_count: number;
  likes: number;
  rating: number;
  game_source: 'local' | 'gamemonetize';
  width?: string;
  height?: string;
  importedAt?: string;
  updatedAt?: string;
}
