// This route is disabled for static export. 
// The actual logic has been moved to _route.ts
export const dynamic = 'force-static';
export async function GET() {
  return new Response('API Disabled for Static Export', { status: 404 });
}
