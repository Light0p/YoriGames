// This route is disabled for static export. 
export const dynamic = 'force-static';
export async function POST() {
  return new Response('API Disabled for Static Export', { status: 404 });
}
