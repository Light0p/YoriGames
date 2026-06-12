import { NextResponse } from 'next/server';
import { fetchGameMonetizeFeed } from '@/lib/gamemonetize';

/**
 * Server-side API route to fetch GameMonetize feed.
 * Supports pagination via query parameters.
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    const games = await fetchGameMonetizeFeed(page);
    return NextResponse.json({ success: true, games, page });
  } catch (error: any) {
    console.error('Manual fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Fetch process failed' 
    }, { status: 500 });
  }
}
