'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const ROOT_TABS = new Set(['/', '/ask', '/destinations', '/blog', '/dashboard'])

const PAGE_META = {
  '/':             { title: 'NomadVital',      showLogo: true  },
  '/ask':          { title: 'Ask AI',           showLogo: false },
  '/destinations': { title: 'Destinations',     showLogo: false },
  '/blog':         { title: 'Blog',             showLogo: false },
  '/dashboard':    { title: 'My Account',       showLogo: false },
  '/planner':      { title: 'Travel Planner',   showLogo: false },
  '/pricing':      { title: 'Pricing',          showLogo: false },
  '/privacy':      { title: 'Privacy Policy',   showLogo: false },
  '/disclaimer':   { title: 'Disclaimer',       showLogo: false },
  '/contact':      { title: 'Contact',          showLogo: false },
  '/login':        { title: 'Sign In',          showLogo: false },
  '/signup':       { title: 'Create Account',   showLogo: false },
}

function getPageMeta(pathname) {
  if (PAGE_META[pathname]) return PAGE_META[pathname]
  if (pathname.startsWith('/blog/'))         return { title: 'Article',     showLogo: false }
  if (pathname.startsWith('/destinations/')) return { title: 'Destination', showLogo: false }
  return { title: 'NomadVital', showLogo: false }
}

export default function PWAHeader() {
  const pathname = usePathname()
  const router   = useRouter()
  const { data: session } = useSession()

  const isRootTab  = ROOT_TABS.has(pathname)
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const { title, showLogo } = getPageMeta(pathname)

  const isPro    = session?.user?.plan === 'pro'
  const userName = session?.user?.name
  const isGuest  = session?.user?.isGuest

  const initials = userName
    ? userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : null

  return (
    <header className="pwa-header" role="banner">

      {/* Left — back button or logo */}
      <div className="pwa-header-left">
        {isRootTab ? (
          /* Logo — just branding on root tabs, not a nav button */
          <div style={{
            width: '30px', height: '30px', borderRadius: '9px',
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
              <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="rgba(255,255,255,0.9)" opacity="0.85"/>
              <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
            </svg>
          </div>
        ) : (
          <button onClick={() => router.back()} className="pwa-back-btn" aria-label="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
        )}
      </div>

      {/* Centre — page title */}
      <div className="pwa-header-title">
        {showLogo ? (
          <span style={{
            fontFamily: 'Georgia, serif', fontSize: '17px',
            fontWeight: 700, color: '#fff', letterSpacing: '-0.3px',
          }}>
            Nomad<span style={{ fontWeight: 400, fontStyle: 'italic', color: '#5DCAA5' }}>Vital</span>
          </span>
        ) : (
          <span style={{
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            fontSize: '16px', fontWeight: '700', color: '#fff',
          }}>
            {title}
          </span>
        )}
      </div>

      {/* Right — user avatar, sign-in, or nothing on auth pages */}
      <div className="pwa-header-right">
        {isAuthPage ? (
          /* nothing on login/signup — already on auth page */
          null
        ) : session && !isGuest ? (
          <Link href="/dashboard" aria-label="My account" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: isPro ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.18)',
              border: '1.5px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700', color: '#fff',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              position: 'relative',
            }}>
              {initials || '?'}
              {isPro && (
                <div style={{
                  position: 'absolute', bottom: '-2px', right: '-2px',
                  width: '11px', height: '11px', borderRadius: '50%',
                  background: '#5DCAA5', border: '2px solid #085041',
                }} />
              )}
            </div>
          </Link>
        ) : (
          <Link href="/login" style={{
            fontSize: '12px', fontWeight: '600', color: '#085041',
            textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)',
            background: '#fff', padding: '5px 13px', borderRadius: '20px',
            whiteSpace: 'nowrap', lineHeight: '1',
          }}>
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}
