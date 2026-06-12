import { NextResponse } from 'next/server';
import { importGameMonetizeFeed } from '@/lib/gamemonetize';

/**
 * Automated import route for CRON jobs (Vercel Cron / Firebase Scheduled Functions).
 * Protected by a secret token to prevent unauthorized triggers.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await importGameMonetizeFeed();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
