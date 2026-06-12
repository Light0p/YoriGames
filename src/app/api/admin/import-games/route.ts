import { NextResponse } from 'next/server';
import { fetchGameMonetizeFeed } from '@/lib/gamemonetize';

/**
 * Server-side API route to fetch GameMonetize feed.
 * This bypasses CORS for the browser, but leaves the Firestore 
 * mutation to the client to satisfy Auth security rules.
 */
export async function POST(request: Request) {
  try {
    const games = await fetchGameMonetizeFeed();
    return NextResponse.json({ success: true, games });
  } catch (error: any) {
    console.error('Manual fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Fetch process failed' 
    }, { status: 500 });
  }
}
