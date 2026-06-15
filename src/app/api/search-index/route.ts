import { NextResponse } from 'next/server';
import { getSearchIndex } from '@/lib/games';

/**
 * Lightweight API to serve the global searchable index.
 * Only returns critical strings for client-side suggestions to save bandwidth.
 */
export async function GET() {
  try {
    const index = await getSearchIndex();
    return NextResponse.json(index, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=3600',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=3600',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to build index' }, { status: 500 });
  }
}
