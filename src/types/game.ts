export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
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
  game_source: 'local' | 'gamedistribution';
}
