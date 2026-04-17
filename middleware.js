import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth({ ...authConfig, trustHost: true })

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Admin page routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (session.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/?error=unauthorized', req.url))
    }
  }

  // Admin API routes
  if (pathname.startsWith('/api/admin')) {
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Routes that require a real account (login or signup)
  const loginRequired = ['/planner', '/dashboard', '/ask']
  if (loginRequired.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/planner/:path*',
    '/dashboard/:path*',
    '/ask/:path*',
    '/ask',
  ],
}
