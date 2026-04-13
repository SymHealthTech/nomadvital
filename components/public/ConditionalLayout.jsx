'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileStickyBar from './MobileStickyBar'
import InstallBanner from './InstallBanner'
import BackPressGuard from './BackPressGuard'
import BottomTabBar from './BottomTabBar'
import PWAHeader from './PWAHeader'

const AUTH_PAGES = new Set([
  '/login', '/signup', '/forgot-password', '/pwa-launch', '/verify-email',
])

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const router   = useRouter()
  const { data: session, status } = useSession()

  const isAdmin = pathname.startsWith('/admin')
  const isAsk   = pathname === '/ask'

  /* ── PWA detection: set body class and confirm session ── */
  useEffect(() => {
    // 1. Detect standalone mode and keep body class in sync
    function detect() {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        !!window.navigator.standalone ||
        document.referrer.includes('android-app://')
      if (standalone) {
        document.body.classList.add('pwa-mode')
        window.__NV_PWA__ = true
      } else {
        document.body.classList.remove('pwa-mode')
        window.__NV_PWA__ = false
      }
      return standalone
    }

    const isPWA = detect()
    const mq    = window.matchMedia('(display-mode: standalone)')
    mq.addEventListener('change', detect)

    // 2. Guard: hide protected content until auth confirmed
    //    Controlled via pwa-ready class (see globals.css .pwa-guard rule)
    if (isPWA) {
      const isAuthPage = AUTH_PAGES.has(pathname)

      if (isAuthPage || status === 'authenticated') {
        // Safe to show content
        document.body.classList.add('pwa-ready')
      } else if (status === 'unauthenticated') {
        // Not signed in on a protected page — redirect, keep content hidden
        document.body.classList.remove('pwa-ready')
        router.replace('/login')
      } else {
        // status === 'loading' — content stays hidden via CSS; wait for next run
        document.body.classList.remove('pwa-ready')
      }

      // Kick out sessions invalidated by a newer login on another device
      if (status === 'authenticated' && session?.user?.invalidated) {
        signOut({ callbackUrl: '/login?reason=other_device' })
      }
    } else {
      // Not PWA — always show content
      document.body.classList.add('pwa-ready')
    }

    return () => mq.removeEventListener('change', detect)
  }, [status, session, pathname, router])

  if (isAdmin) {
    return <main className="flex-1">{children}</main>
  }

  // Determine if the current page is an auth page (always visible)
  const isAuthPage = AUTH_PAGES.has(pathname)

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

      {/*
        .pwa-guard  — hidden by default in PWA (body.pwa-mode .pwa-guard { visibility:hidden })
                      revealed when body.pwa-mode.pwa-ready is set (auth confirmed)
        .pwa-guard-auth — always visible (used for auth pages like /login)
      */}
      <main className={`flex-1 ${isAuthPage ? 'pwa-guard-auth' : 'pwa-guard'}`}>
        {children}
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
