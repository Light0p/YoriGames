import { MetadataRoute } from 'next';
import { getSearchableGames } from '@/lib/games';

/**
 * High-performance dynamic sitemap generator for YoriGames.
 * Consumes the static games.json to generate URLs for all 2,000+ games.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yorigamesonline.online';
  const currentDate = new Date().toISOString();

  // Fetch all games from the consolidated static source
  const allGames = await getSearchableGames(5000);
  
  const gameEntries = allGames.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Unique categories for sitemap
  const categories = Array.from(new Set(allGames.map(g => g.category.toLowerCase())));
  const categoryEntries = categories.map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Core platform pages with high priority
  const staticPages = [
    { url: baseUrl, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/games`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/trending`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/categories`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  return [...staticPages, ...gameEntries, ...categoryEntries] as any;
}
