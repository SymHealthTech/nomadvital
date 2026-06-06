import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

const isSecure = (process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? '').startsWith('https://')
const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

async function getSessionToken(req) {
  // Try the cookie name that matches NEXTAUTH_URL's protocol first,
  // then fall back to the other variant — handles dev/prod env mismatches
  let token = null
  try {
    token = await getToken({ req, secret, secureCookie: isSecure })
  } catch {}
  if (!token) {
    try {
      token = await getToken({ req, secret, secureCookie: !isSecure })
    } catch {}
  }
  return token
}

export async function middleware(req) {
  const { pathname } = req.nextUrl
  const token = await getSessionToken(req)

  if (pathname.startsWith('/admin')) {
    if (!token) return NextResponse.redirect(new URL('/login', req.url))
    if (token.role !== 'admin') return NextResponse.redirect(new URL('/?error=unauthorized', req.url))
  }

  if (pathname.startsWith('/api/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const loginRequired = ['/planner', '/dashboard', '/ask']
  if (loginRequired.some((route) => pathname.startsWith(route))) {
    if (!token) return NextResponse.redirect(new URL('/login', req.url))
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
