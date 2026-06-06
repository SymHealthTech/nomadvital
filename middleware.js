import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

// Match the secureCookie setting used during login:
// NextAuth uses NEXTAUTH_URL's protocol to decide whether to use __Secure- prefix
const isSecure = (process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? '').startsWith('https://')
const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

export async function middleware(req) {
  const { pathname } = req.nextUrl

  const token = await getToken({ req, secret, secureCookie: isSecure })

  // Admin page routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/?error=unauthorized', req.url))
    }
  }

  // Admin API routes
  if (pathname.startsWith('/api/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Routes that require a real account (login or signup)
  const loginRequired = ['/planner', '/dashboard', '/ask']
  if (loginRequired.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/planner',
    '/planner/:path*',
    '/dashboard/:path*',
    '/ask/:path*',
    '/ask',
  ],
}
