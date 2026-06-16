import { NextResponse } from 'next/server';
import { fetchGameMonetizeFeed } from '@/lib/gamemonetize';

/**
 * Server-side API route to fetch GameMonetize feed.
 * (Renamed to _route.ts to exclude from static export)
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    const games = await fetchGameMonetizeFeed(page);
    return NextResponse.json({ success: true, games, page });
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Fetch process failed' 
    }, { status });
  }
}
