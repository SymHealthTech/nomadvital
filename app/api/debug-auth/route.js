import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

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
    secureResult = t ? 'TOKEN_FOUND' : 'null'
  } catch (e) {
    secureResult = `ERROR: ${e.message}`
  }

  try {
    const t = await getToken({ req: request, secret, secureCookie: false })
    insecureResult = t ? 'TOKEN_FOUND' : 'null'
  } catch (e) {
    insecureResult = `ERROR: ${e.message}`
  }

  return NextResponse.json({
    nextauth_url: process.env.NEXTAUTH_URL || 'NOT_SET',
    auth_secret_present: !!process.env.AUTH_SECRET,
    nextauth_secret_present: !!process.env.NEXTAUTH_SECRET,
    middleware_isSecure: isSecure,
    middleware_secret_present: !!secret,
    cookie_names_in_request: cookieNames,
    getToken_secureCookie_true: secureResult,
    getToken_secureCookie_false: insecureResult,
  })
}
