'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileStickyBar from './MobileStickyBar'
import InstallBanner from './InstallBanner'
import BackPressGuard from './BackPressGuard'
import BottomTabBar from './BottomTabBar'
import PWAHeader from './PWAHeader'

const AUTH_PAGES = new Set(['/login', '/signup', '/forgot-password', '/pwa-launch', '/verify-email'])

// Read the synchronous PWA flag set by the inline script in layout.jsx
// This is available before React hydrates, so there is no flash of wrong content.
function getInitialPWA() {
  if (typeof window === 'undefined') return false
  return !!window.__NV_PWA__
}

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const router   = useRouter()
  const { data: session, status } = useSession()

  const isAdmin = pathname.startsWith('/admin')
  const isAsk   = pathname === '/ask'

  // Initialise from the synchronous inline script flag — no layout shift
  const [isPWA, setIsPWA] = useState(getInitialPWA)

  /* ── PWA detection (confirm/update after hydration) ── */
  useEffect(() => {
    function detect() {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        !!window.navigator.standalone ||
        document.referrer.includes('android-app://')
      setIsPWA(standalone)
      if (standalone) {
        document.body.classList.add('pwa-mode')
      } else {
        document.body.classList.remove('pwa-mode')
      }
    }
    detect()
    const mq = window.matchMedia('(display-mode: standalone)')
    mq.addEventListener('change', detect)
    return () => mq.removeEventListener('change', detect)
  }, [])

  /* ── PWA: force sign-in (no guest), handle invalidated session ── */
  useEffect(() => {
    if (!isPWA) return

    if (status === 'unauthenticated' && !AUTH_PAGES.has(pathname)) {
      router.replace('/login')
      return
    }

    if (status === 'authenticated' && session?.user?.invalidated) {
      signOut({ callbackUrl: '/login?reason=other_device' })
    }
  }, [status, session, pathname, router, isPWA])

  if (isAdmin) {
    return <main className="flex-1">{children}</main>
  }

  // In PWA mode, hide protected page content until the session is confirmed.
  // This prevents a brief flash of page content before the redirect fires
  // when the user is not authenticated.
  const isProtectedPWA = isPWA && !AUTH_PAGES.has(pathname)
  const showContent     = !isProtectedPWA || status === 'authenticated'

  return (
    <>
      {/* Regular web navbar — hidden by CSS when body.pwa-mode */}
      <div className="pwa-hide regular-navbar">
        <Navbar />
      </div>

      {/* PWA native top header — shown by CSS when body.pwa-mode */}
      <div className="pwa-show">
        <PWAHeader />
      </div>

      {/* Install banner — only in browser */}
      <div className="pwa-hide install-banner">
        <InstallBanner />
      </div>

      <main className="flex-1">
        {showContent ? children : (
          // Minimal loading state — shown while session check completes in PWA
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 'calc(100dvh - 56px - 68px)',
          }}>
            <div style={{
              width: '28px', height: '28px',
              border: '3px solid #E1F5EE',
              borderTopColor: '#1D9E75',
              borderRadius: '50%',
              animation: 'nvSpin 0.7s linear infinite',
            }} />
            <style>{`@keyframes nvSpin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </main>

      {/* Footer + mobile sticky — hidden in PWA */}
      <div className="pwa-hide">
        <Footer mobileHidden={isAsk} />
      </div>
      <div className="pwa-hide">
        <MobileStickyBar />
      </div>

      <BackPressGuard />

      {/* PWA bottom tab bar */}
      <div className="pwa-show">
        <BottomTabBar />
      </div>
    </>
  )
}
