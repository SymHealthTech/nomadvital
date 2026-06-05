'use client'

import { usePathname } from 'next/navigation'
import { useIsPWA } from '@/hooks/useIsPWA'
import WebLayout from '@/components/layouts/WebLayout'
import PWALayout from '@/components/layouts/PWALayout'

/**
 * Layout router — the single place where PWA vs web layout is decided.
 *
 * Rules:
 *   /admin/*       → bare <main> (admin has its own shell)
 *   PWA mode       → PWALayout  (PWAHeader, BottomTabBar, auth guard, BackPressGuard)
 *   browser mode   → WebLayout  (Navbar, Footer, InstallBanner, MobileStickyBar)
 *
 * Flash prevention:
 *   useIsPWA() returns null during SSR (server doesn't know display mode).
 *   During SSR the server generates WebLayout markup.  On the client, the
 *   inline script in layout.jsx sets window.__NV_PWA__ BEFORE React hydrates,
 *   so useIsPWA()'s lazy useState initialiser reads the correct value
 *   synchronously on the first client render.
 *
 *   When isPWA is still null (SSR only — never seen client-side), we fall
 *   through to WebLayout so server and client HTML match on the first pass
 *   for non-PWA users.  For PWA users React detects a mismatch and immediately
 *   re-renders with PWALayout; the globals.css rule
 *   `body.pwa-mode .pwa-hide { display: none }` hides nav chrome visually
 *   while the re-render happens, so there is no visible flash.
 */
export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isPWA    = useIsPWA()

  if (pathname.startsWith('/admin')) {
    return <main className="flex-1">{children}</main>
  }

  // isPWA is only null during SSR. On the client the lazy initialiser in
  // useIsPWA reads window.__NV_PWA__ synchronously so isPWA is always a
  // boolean after the first client render.
  if (isPWA === true) {
    return <PWALayout>{children}</PWALayout>
  }

  return <WebLayout>{children}</WebLayout>
}
