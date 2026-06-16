import { MetadataRoute } from 'next';
import { getSearchableGames } from '@/lib/games';

// Static export ke liye yeh line compulsory hai
export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yorigamesonline.online';
  const currentDate = new Date().toISOString();

  try {
    const allGames = await getSearchableGames(49000);

    const gameEntries = allGames
      .filter(game => game && (game.slug || game.id))
      .map((game) => ({
        url: `${baseUrl}/games/${game.slug || game.id}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

    const staticPages = [
      { url: baseUrl, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
      { url: `${baseUrl}/games`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    ];

    return [...staticPages, ...gameEntries];
  } catch (error) {
    return [{ url: baseUrl, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 }];
  }
}