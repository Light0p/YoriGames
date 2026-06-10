import { MetadataRoute } from 'next'

/**
 * @fileOverview Robots.txt configuration for YoriGames.
 * Explicitly points to the canonical sitemap URL.
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/profile/', '/api/'],
    },
    sitemap: 'https://yorigamesonline.online/sitemap.xml',
  }
}
