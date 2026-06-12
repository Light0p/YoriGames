import { NextResponse } from 'next/server';
import { importGameMonetizeFeed } from '@/lib/gamemonetize';

/**
 * Automated import route for CRON jobs.
 * Protected by a secret token to prevent unauthorized triggers.
 * Bypasses CORS as it runs on the server.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  // Verify CRON secret
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
