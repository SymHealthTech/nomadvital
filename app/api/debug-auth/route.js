import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const isSecure = (process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? '').startsWith('https://')
const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

export async function GET(request) {
  if (new URL(request.url).searchParams.get('key') !== 'nv2024debug') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const cookieHeader = request.headers.get('cookie') ?? ''
  const cookieNames = cookieHeader
    .split(';')
    .map(c => c.split('=')[0].trim())
    .filter(Boolean)

  let secureResult, insecureResult

  try {
    const t = await getToken({ req: request, secret, secureCookie: true })
    secureResult = t
      ? { found: true, id: t.id, activeSessionToken: t.activeSessionToken ? 'present' : 'missing' }
      : 'null'
  } catch (e) {
    secureResult = `ERROR: ${e.message}`
  }

  try {
    const t = await getToken({ req: request, secret, secureCookie: false })
    insecureResult = t ? 'TOKEN_FOUND' : 'null'
  } catch (e) {
    insecureResult = `ERROR: ${e.message}`
  }

  let sessionResult = null
  try {
    const session = await auth()
    sessionResult = session
      ? {
          hasSession: true,
          userId: session.user?.id ? 'present' : 'missing',
          invalidated: session.user?.invalidated ?? false,
          plan: session.user?.plan,
        }
      : 'null'
  } catch (e) {
    sessionResult = `ERROR: ${e.message}`
  }

  return NextResponse.json({
    nextauth_url: process.env.NEXTAUTH_URL || 'NOT_SET',
    middleware_isSecure: isSecure,
    cookie_names: cookieNames,
    getToken_secure: secureResult,
    getToken_insecure: insecureResult,
    auth_session: sessionResult,
  })
}
