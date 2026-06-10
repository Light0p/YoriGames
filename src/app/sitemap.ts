import { MetadataRoute } from 'next'
import gamesData from '@/data/games.json'

/**
 * @fileOverview Standards-compliant sitemap generator for YoriGames.
 * Ensures Google Search Console can fetch and validate the XML structure.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yorigamesonline.online'
  const currentDate = new Date().toISOString()

  // Game pages
  const gameEntries = gamesData.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: game.date_added ? new Date(game.date_added).toISOString() : currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Unique categories
  const categories = Array.from(new Set(gamesData.map((g) => g.category.toLowerCase())))
  const categoryEntries = categories.map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  return [...staticPages, ...gameEntries, ...categoryEntries]
}
