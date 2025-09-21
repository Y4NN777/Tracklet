import { type NextRequest } from 'next/server'
import { intlayerMiddleware } from "next-intlayer/middleware";

export function middleware(req: NextRequest) {
  return intlayerMiddleware(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};