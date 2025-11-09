import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

// For Firebase client-side auth, we'll let the client components handle authentication
// This middleware only handles static redirects and allows all authenticated routes
export function middleware(request: NextRequest) {
  // Let all requests through - auth checking happens client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
