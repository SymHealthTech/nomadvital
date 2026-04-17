'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import PWAHeader from '@/components/public/PWAHeader'
import BottomTabBar from '@/components/public/BottomTabBar'
import BackPressGuard from '@/components/public/BackPressGuard'

// Pages where unauthenticated users are allowed through without a redirect.
// Auth pages use .pwa-guard-auth which is always visible regardless of pwa-ready.
const AUTH_PAGES = new Set([
  '/login', '/signup', '/forgot-password', '/pwa-launch', '/verify-email',
])

/**
 * Shell rendered exclusively for PWA (standalone) users.
 *
 * Contains: PWAHeader, auth guard (pwa-guard / pwa-ready body classes),
 * page content, BottomTabBar, and BackPressGuard.
 *
 * Owns all PWA-specific behaviour:
 *   - Hides protected content until session is confirmed (pwa-guard pattern)
 *   - Redirects unauthenticated users to /login
 *   - Kicks out sessions invalidated on another device
 *
 * Web-specific components (Navbar, Footer, InstallBanner, MobileStickyBar)
 * are never mounted in this layout.
 * Pages know nothing about this wrapper — they just render children.
 */
export default function PWALayout({ children }) {
  const pathname = usePathname()
  const router   = useRouter()
  const { data: session, status } = useSession()

  const isAuthPage = AUTH_PAGES.has(pathname)

  /* ── Auth guard: control pwa-ready body class ─────────────────────────── */
  useEffect(() => {
    if (status === 'authenticated') {
      document.body.classList.add('pwa-ready')

      // Kick out sessions invalidated by a login on another device.
      if (session?.user?.invalidated) {
        document.body.classList.remove('pwa-ready')
        signOut({ callbackUrl: '/login?reason=other_device' })
      }
    } else {
      // 'loading' or 'unauthenticated' — keep protected content hidden.
      // Auth pages (.pwa-guard-auth) remain visible without pwa-ready.
      document.body.classList.remove('pwa-ready')

      if (status === 'unauthenticated' && !AUTH_PAGES.has(pathname)) {
        router.replace('/login')
      }
    }
  }, [status, session, pathname, router])

  return (
    <>
      <PWAHeader />
      {/*
        .pwa-guard      — hidden by default in PWA (body.pwa-mode .pwa-guard { visibility:hidden })
                          revealed once body.pwa-mode.pwa-ready is both set (auth confirmed)
        .pwa-guard-auth — always visible (login, signup, etc.)
      */}
      <main className={`flex-1 ${isAuthPage ? 'pwa-guard-auth' : 'pwa-guard'}`}>
        {children}
      </main>
      <BottomTabBar />
      <BackPressGuard />
    </>
  )
}
