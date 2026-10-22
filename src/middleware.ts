import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and assets
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/videos') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Detect Telegram Mini App
  const userAgent = request.headers.get('user-agent') || '';
  const isTelegramApp = 
    userAgent.includes('Telegram') ||
    searchParams.has('tgWebAppPlatform') ||
    searchParams.has('tgWebAppVersion') ||
    searchParams.has('tgWebAppData');
  
  // If Telegram user and on landing page → redirect to dashboard
  if (isTelegramApp && pathname === '/') {
    const url = new URL('/dashboard', request.url);
    // Preserve all Telegram params
    searchParams.forEach((value, key) => {
      if (key.startsWith('tg')) {
        url.searchParams.set(key, value);
      }
    });
    return NextResponse.redirect(url);
  }
  
  // If web user tries to access dashboard → redirect to landing with message
  if (!isTelegramApp && pathname.startsWith('/dashboard')) {
    const url = new URL('/', request.url);
    url.searchParams.set('message', 'telegram-required');
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};
