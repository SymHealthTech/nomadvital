'use client'

import { usePathname } from 'next/navigation'
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

  return (
    <>
      {/* Regular navbar — hidden automatically in PWA mode via .regular-navbar CSS class */}
      {!isAdmin && (
        <div className="regular-navbar">
          <Navbar />
        </div>
      )}

      {/* PWA native top header — only visible in standalone mode (CSS controlled) */}
      {!isAdmin && <PWAHeader />}

      {!isAdmin && (
        <div className="install-banner">
          <InstallBanner />
        </div>
      )}

      <main className="flex-1">{children}</main>

      {!isAdmin && <Footer mobileHidden={isAsk} />}
      {!isAdmin && <MobileStickyBar />}
      {!isAdmin && <BackPressGuard />}

      {/* PWA native bottom tab bar — only visible in standalone mode (CSS controlled) */}
      {!isAdmin && <BottomTabBar />}
    </>
  )
}
