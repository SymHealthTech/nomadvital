'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import MobileStickyBar from '@/components/public/MobileStickyBar'
import InstallBanner from '@/components/public/InstallBanner'

/**
 * Shell rendered for regular browser (non-PWA) users.
 *
 * Contains: top Navbar, install prompt banner, page content, Footer,
 * and the mobile sticky CTA bar.
 *
 * Pages know nothing about this wrapper — they just render children.
 * PWA-specific components (PWAHeader, BottomTabBar, BackPressGuard)
 * are never mounted in this layout.
 */
export default function WebLayout({ children }) {
  const pathname = usePathname()
  const isAsk = pathname === '/ask'

  return (
    <>
      <Navbar />
      <InstallBanner />
      <main className="flex-1">{children}</main>
      <Footer mobileHidden={isAsk} />
      <MobileStickyBar />
    </>
  )
}
