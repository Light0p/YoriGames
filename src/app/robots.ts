import { MetadataRoute } from 'next';

// Static export ke liye zaroori line
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/profile/', '/admin/'],
    },
    sitemap: 'https://www.yorigamesonline.online/sitemap.xml',
  };
}