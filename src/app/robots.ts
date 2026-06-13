import { MetadataRoute } from 'next';

/**
 * Standard Robots.txt for YoriGames.
 * Allows all crawlers and points to the dynamic sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/profile/', '/admin/'],
    },
    sitemap: 'https://yorigamesonline.online/sitemap.xml',
  };
}
