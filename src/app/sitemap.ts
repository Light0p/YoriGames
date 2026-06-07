import { MetadataRoute } from 'next'
import gamesData from '@/data/games.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yorigames.app'

  const gameEntries = gamesData.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: new Date(game.date_added),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const categories = Array.from(new Set(gamesData.map((g) => g.category.toLowerCase())))
  const categoryEntries = categories.map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/arcade`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...gameEntries,
    ...categoryEntries,
  ]
}
