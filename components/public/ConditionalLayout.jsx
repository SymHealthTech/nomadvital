'use client'

import { usePathname } from 'next/navigation'
import { useIsPWA } from '@/hooks/useIsPWA'
import WebLayout from '@/components/layouts/WebLayout'
import PWALayout from '@/components/layouts/PWALayout'

/**
 * Layout router — the single place where PWA vs web layout is decided.
 *
 * Rules:
 *   /admin/*  → bare <main> (admin has its own shell)
 *   isPWA     → PWALayout  (PWAHeader, BottomTabBar, auth guard, BackPressGuard)
 *   otherwise → WebLayout  (Navbar, Footer, InstallBanner, MobileStickyBar)
 *
 * Adding a new page requires zero changes here or anywhere else — the correct
 * layout is applied automatically based on how the app was launched.
 */
export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isPWA    = useIsPWA()

  if (pathname.startsWith('/admin')) {
    return <main className="flex-1">{children}</main>
  }

  if (isPWA) {
    return <PWALayout>{children}</PWALayout>
  }

  return <WebLayout>{children}</WebLayout>
}
