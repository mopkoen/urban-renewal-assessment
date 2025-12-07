// Cloudflare Worker to serve static files for React SPA
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Handle OPTIONS request for CORS
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      // Check if ASSETS binding exists
      if (!env.ASSETS) {
        return new Response('ASSETS binding not configured', { status: 500 });
      }

      // Try to get the file from the site bucket
      let response = await env.ASSETS.fetch(request);

      // If the file doesn't exist and it's not a file request (no extension),
      // serve index.html for SPA routing
      if (response.status === 404 && !pathname.includes('.')) {
        const indexRequest = new Request(new URL('/index.html', request.url));
        response = await env.ASSETS.fetch(indexRequest);
      }

      // Clone response to modify headers
      const headers = new Headers(response.headers);
      
      // Set proper content types
      const contentType = getContentType(pathname);
      if (contentType) {
        headers.set('Content-Type', contentType);
      }
      
      // Add CORS headers
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers,
      });
    } catch (error) {
      // Return error response
      return new Response(`Worker Error: ${error.message}`, {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  },
};

function getContentType(pathname) {
  if (pathname.endsWith('.html')) return 'text/html; charset=utf-8';
  if (pathname.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (pathname.endsWith('.css')) return 'text/css; charset=utf-8';
  if (pathname.endsWith('.json')) return 'application/json; charset=utf-8';
  if (pathname.endsWith('.png')) return 'image/png';
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return 'image/jpeg';
  if (pathname.endsWith('.svg')) return 'image/svg+xml';
  if (pathname.endsWith('.woff')) return 'font/woff';
  if (pathname.endsWith('.woff2')) return 'font/woff2';
  return null;
}

