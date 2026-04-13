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

const AUTH_PAGES = new Set(['/login', '/signup', '/forgot-password', '/pwa-launch'])

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const router   = useRouter()
  const { data: session, status } = useSession()

  const isAdmin = pathname.startsWith('/admin')
  const isAsk   = pathname === '/ask'

  /* ── PWA detection ── */
  useEffect(() => {
    function detect() {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        !!window.navigator.standalone ||
        document.referrer.includes('android-app://')
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
    const isPWA = document.body.classList.contains('pwa-mode')
    if (!isPWA) return

    // No guest browsing in PWA — redirect unauthenticated users to login
    if (status === 'unauthenticated' && !AUTH_PAGES.has(pathname)) {
      router.replace('/login')
      return
    }

    // Kick out sessions that were invalidated by a newer login on another device
    if (status === 'authenticated' && session?.user?.invalidated) {
      signOut({ callbackUrl: '/login?reason=other_device' })
    }
  }, [status, session, pathname, router])

  if (isAdmin) {
    return <main className="flex-1">{children}</main>
  }

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

      <main className="flex-1">{children}</main>

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
