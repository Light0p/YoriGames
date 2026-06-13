import { MetadataRoute } from 'next';
import { getSearchableGames } from '@/lib/games';

/**
 * Bulletproof Sitemap Generator for YoriGames
 * Implements strict URL sanitization and XML entity escaping for Google Search compliance.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yorigamesonline.online';
  const currentDate = new Date().toISOString();

  /**
   * Helper: Sanitizes path segments by removing illegal characters 
   * and ensuring proper URI encoding.
   */
  const sanitizePath = (segment: string): string => {
    if (!segment) return '';
    return segment
      .split('/')
      .map(part => encodeURIComponent(part.trim().replace(/\s+/g, '-')))
      .join('/');
  };

  /**
   * Helper: Explicitly escapes problematic XML characters to prevent parsing errors.
   * Although Next.js handles some escaping, this provides a "bulletproof" layer.
   */
  const xmlEscape = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  try {
    // Fetch all games from the consolidated static source
    const allGames = await getSearchableGames(5000);
    
    // 1. Generate Game Page Entries
    const gameEntries = allGames
      .filter(game => game && (game.slug || game.id))
      .map((game) => {
        const slug = game.slug || game.id;
        const safeUrl = `${baseUrl}/games/${sanitizePath(slug)}`;
        return {
          url: xmlEscape(safeUrl),
          lastModified: currentDate,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      });

    // 2. Generate Unique Category Entries
    const categories = Array.from(new Set(allGames.map(g => g.category.toLowerCase())));
    const categoryEntries = categories
      .filter(Boolean)
      .map((slug) => {
        const safeUrl = `${baseUrl}/categories/${sanitizePath(slug)}`;
        return {
          url: xmlEscape(safeUrl),
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        };
      });

    // 3. Core Platform Pages
    const staticPages = [
      { path: '', freq: 'daily', priority: 1.0 },
      { path: '/games', freq: 'daily', priority: 0.9 },
      { path: '/trending', freq: 'daily', priority: 0.8 },
      { path: '/categories', freq: 'weekly', priority: 0.8 },
      { path: '/about', freq: 'monthly', priority: 0.5 },
      { path: '/contact', freq: 'monthly', priority: 0.5 },
      { path: '/privacy', freq: 'monthly', priority: 0.3 },
      { path: '/terms', freq: 'monthly', priority: 0.3 },
    ].map(page => ({
      url: xmlEscape(`${baseUrl}${page.path}`),
      lastModified: currentDate,
      changeFrequency: page.freq as any,
      priority: page.priority,
    }));

    // Combine all entries and filter out any potential malformed data
    const fullSitemap = [...staticPages, ...gameEntries, ...categoryEntries].filter(
      entry => entry.url && entry.url.startsWith('http')
    );

    return fullSitemap as MetadataRoute.Sitemap;

  } catch (error) {
    console.error('CRITICAL: Sitemap generation failed:', error);
    // Fallback: Index only the home page to prevent a total sitemap outage
    return [
      {
        url: xmlEscape(baseUrl),
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
