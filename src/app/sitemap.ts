import { MetadataRoute } from 'next'
import { db } from '@/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

/**
 * Standards-compliant sitemap generator for YoriGames.
 * Updated to pull dynamic GameMonetize data from Firestore.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yorigamesonline.online'
  const currentDate = new Date().toISOString()

  // Fetch all games from Firestore (limit to 1000 for sitemap safety)
  const gamesRef = collection(db, 'games');
  const gamesSnapshot = await getDocs(query(gamesRef, limit(1000)));
  
  const gameEntries = gamesSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      url: `${baseUrl}/games/${data.slug}`,
      lastModified: data.updatedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  // Unique categories from the fetched games
  const categories = Array.from(new Set(gamesSnapshot.docs.map(doc => doc.data().category.toLowerCase())));
  const categoryEntries = categories.map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/games`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/trending`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/categories`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
  ]

  return [...staticPages, ...gameEntries, ...categoryEntries] as any;
}
