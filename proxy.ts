// middleware.ts (runs on Vercel Edge or your CDN)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest): NextResponse {
  // Safely access geo (may not be typed on some Next.js type definitions)
  // Use a local `geo` var with a loose type to avoid TS errors in environments
  // where `NextRequest.geo` isn't declared in the types.
  const geo = (request as unknown as {
    geo?: {
      country?: string;
      city?: string;
      region?: string;
      latitude?: number | string;
      longitude?: number | string;
    };
  }).geo;

  // Normalize values to strings so `response.headers.set` receives `string`.
  const country = String(
    geo?.country ??
      request.headers.get('cloudfront-viewer-country') ??
      request.headers.get('cf-ipcountry') ??
      'US'
  );

  const city = String(
    geo?.city ?? request.headers.get('cloudfront-viewer-city') ?? 'Unknown'
  );

  const region = String(
    geo?.region ?? request.headers.get('cloudfront-viewer-country-region') ?? ''
  );

  const latitude = String(
    geo?.latitude ?? request.headers.get('cloudfront-viewer-latitude') ?? '0'
  );

  const longitude = String(
    geo?.longitude ?? request.headers.get('cloudfront-viewer-longitude') ?? '0'
  );

  // Clone the response
  const response = NextResponse.next();

  // Add geo data as headers that your page can read
  response.headers.set('x-user-country', country);
  response.headers.set('x-user-city', city);
  response.headers.set('x-user-region', region);
  response.headers.set('x-user-latitude', latitude);
  response.headers.set('x-user-longitude', longitude);

  // IMPORTANT: Add to Vary header for proper caching
  // Use set here to ensure the header value is present; change to append
  // if you want to keep any existing Vary values.
  response.headers.set('Vary', 'x-user-country');

  console.log('middleware hit---> ', { country, city, region, latitude, longitude });

  return response;
}

// Apply middleware to specific routes (or all routes)
export const config = {
  matcher: [
    // Apply to all routes except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};