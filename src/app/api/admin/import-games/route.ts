import { NextResponse } from 'next/server';
import { fetchGameMonetizeFeed } from '@/lib/gamemonetize';

/**
 * Server-side API route to fetch GameMonetize feed.
 * Supports pagination via query parameters.
 * Passes through status codes (like 429) for client-side retry handling.
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    const games = await fetchGameMonetizeFeed(page);
    return NextResponse.json({ success: true, games, page });
  } catch (error: any) {
    console.error('Manual fetch error:', error);
    // Extract status code if available from the library error
    const status = error.status || 500;
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Fetch process failed' 
    }, { status });
  }
}
