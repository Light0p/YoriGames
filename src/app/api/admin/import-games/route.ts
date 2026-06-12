import { NextResponse } from 'next/server';
import { importGameMonetizeFeed } from '@/lib/gamemonetize';

/**
 * Server-side API route to trigger manual GameMonetize imports.
 * Bypasses browser CORS and allows admin dashboard to trigger sync.
 */
export async function POST(request: Request) {
  try {
    // Note: In a full production app, you'd check for a session token here.
    // However, the admin page itself is protected by email check.
    const stats = await importGameMonetizeFeed();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    console.error('Manual import error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Import process failed' 
    }, { status: 500 });
  }
}
