import { MetadataRoute } from 'next';
import { getSearchableGames } from '@/lib/games';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await getSearchableGames(5000);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://yorigamesonline.online',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://yorigamesonline.online/games',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://yorigamesonline.online/categories',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const gameUrls: MetadataRoute.Sitemap = games.map((game) => ({
    url: `https://yorigamesonline.online/games/${game.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...gameUrls];
}
