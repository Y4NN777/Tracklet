import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/auth/callback',
    '/_next',
    '/favicon.ico',
    '/api'
  ]

  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route)
  )

  // Allow public routes and static files
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // For protected routes, let the client-side components handle auth
  // This allows for proper session checking and redirects
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}