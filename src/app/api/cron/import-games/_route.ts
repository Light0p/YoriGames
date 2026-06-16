import { NextResponse } from 'next/server';
import { importGameMonetizeFeed } from '@/lib/gamemonetize';

/**
 * Automated import route for CRON jobs.
 * (Renamed to _route.ts to exclude from static export)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (token !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await importGameMonetizeFeed();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    console.error('Automated CRON import error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
