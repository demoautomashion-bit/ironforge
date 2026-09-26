import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define public routes/assets that don't require auth
  const isPublicPath =
    pathname === '/login' ||
    pathname === '/api/auth/login' ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/manifest.ts' ||
    pathname === '/sw.js'

  const sessionCookie = request.cookies.get('iron_session')?.value
  const isAuthenticated = Boolean(
    sessionCookie && sessionCookie.startsWith('iron_admin_session_valid_')
  )

  // 1. If admin is logged in and visits /login, redirect to homepage /
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 2. Block unauthenticated access to protected pages and APIs
  if (!isPublicPath && !isAuthenticated) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      )
    }

    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|sw.js).*)',
  ],
}
