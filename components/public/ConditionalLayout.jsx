'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileStickyBar from './MobileStickyBar'
import InstallBanner from './InstallBanner'
import BackPressGuard from './BackPressGuard'
import BottomTabBar from './BottomTabBar'
import PWAHeader from './PWAHeader'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isAsk = pathname === '/ask'

  /* Sync PWA detection after hydration (inline script handles the first paint) */
  useEffect(() => {
    function detect() {
      const standalone =
        localStorage.getItem('nvPWA') === '1' ||
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

      {/* Install banner — hidden by CSS when body.pwa-mode */}
      <div className="pwa-hide install-banner">
        <InstallBanner />
      </div>

      <main className="flex-1">{children}</main>

      {/* Footer + mobile sticky — hidden by CSS when body.pwa-mode */}
      <div className="pwa-hide">
        <Footer mobileHidden={isAsk} />
      </div>
      <div className="pwa-hide">
        <MobileStickyBar />
      </div>

      <BackPressGuard />

      {/* PWA native bottom tab bar — shown by CSS when body.pwa-mode */}
      <div className="pwa-show">
        <BottomTabBar />
      </div>
    </>
  )
}
