'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

// Root tabs — hardware back on these triggers the exit-confirmation flow.
// Any other pathname is a sub-page and hardware back navigates to its parent.
const ROOT_PAGES = new Set(['/', '/ask', '/destinations', '/blog', '/dashboard', '/planner'])

// Returns the logical parent path for known sub-pages, or null for unknown ones.
function getParentPath(pathname) {
  if (pathname.startsWith('/blog/'))         return '/blog'
  if (pathname.startsWith('/destinations/')) return '/destinations'
  if (pathname === '/pricing')               return '/dashboard'
  if (pathname === '/privacy' ||
      pathname === '/disclaimer' ||
      pathname === '/contact')               return '/'
  if (pathname === '/forgot-password' ||
      pathname === '/verify-email')          return '/login'
  return null
}

function isPWAMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    !!window.navigator.standalone ||
    document.referrer.includes('android-app://')
  )
}

export default function BackPressGuard() {
  const [show, setShow] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  const count      = useRef(0)
  const isOpen     = useRef(false)
  const resetTimer = useRef(null)
  const allowExit  = useRef(false)
  // Refs that stay current inside the stable effect closure
  const pathnameRef = useRef(pathname)
  const routerRef   = useRef(router)

  // Update every render — no stale closure in the event handler
  pathnameRef.current = pathname
  routerRef.current   = router

  // ── Sentinel management ──────────────────────────────────────────────────
  // Push a sentinel entry above every real page so that popstate fires
  // reliably on hardware back regardless of how we got here.
  // Runs on mount AND after every pathname change (navigation).
  useEffect(() => {
    if (!isPWAMode()) return
    // Don't push new sentinels while the close-app sequence is running —
    // that would prevent history from draining to position 0.
    if (allowExit.current) return
    window.history.pushState({ nvGuard: true }, '', window.location.href)

    // Reset the consecutive-back counter whenever the user navigates to
    // a new page (replaces the old patched-pushState approach).
    count.current = 0
    clearTimeout(resetTimer.current)
  }, [pathname])

  // ── popstate listener ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPWAMode()) return

    function onPop() {
      // After "Close App" — let all back presses reach the OS so the PWA closes.
      if (allowExit.current) return

      // Allow navigations triggered by the PWAHeader back button.
      if (window.__NV_HEADER_BACK__) {
        window.__NV_HEADER_BACK__ = false
        return
      }

      const currentPath = pathnameRef.current
      const isRoot = ROOT_PAGES.has(currentPath)

      // Re-arm: push a fresh sentinel so the NEXT hardware back is also caught.
      // This replaces the old history.go(1) + skipNext approach which had
      // async-timing races when router.push() completed before go(1) fired.
      window.history.pushState({ nvGuard: true }, '', window.location.href)

      if (!isRoot) {
        // Sub-page: navigate to its logical parent.
        const parent = getParentPath(currentPath) || '/'
        routerRef.current.push(parent)
        return
      }

      // Root page: dismiss dialog on back press if it's open.
      if (isOpen.current) {
        isOpen.current = false
        setShow(false)
        count.current = 0
        clearTimeout(resetTimer.current)
        return
      }

      // Root page: count consecutive back presses for the exit dialog.
      count.current += 1
      clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => { count.current = 0 }, 3000)

      if (count.current >= 3) {
        count.current = 0
        clearTimeout(resetTimer.current)
        isOpen.current = true
        setShow(true)
      }
    }

    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      clearTimeout(resetTimer.current)
    }
  }, [])

  function handleContinue() {
    isOpen.current = false
    setShow(false)
    count.current = 0
  }

  function handleCloseApp() {
    isOpen.current = false
    setShow(false)

    // Allow all subsequent back presses to pass through the guard
    // so the OS can close the PWA window.
    allowExit.current = true

    // Try to close programmatically (works in some environments).
    window.close()

    // Fallback: drain history back to position 0 so the very next
    // hardware back press exits the PWA on Android Chrome.
    // The sentinel effect is suppressed (allowExit = true) so no new
    // entries are pushed while we drain.
    setTimeout(() => {
      const stepsBack = window.history.length - 1
      if (stepsBack > 0) {
        window.history.go(-stepsBack)
      }
    }, 100)
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.52)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '32px 24px 24px',
        maxWidth: '300px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
      }}>
        {/* Icon */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: '#E8F5EE',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <svg width="26" height="26" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="#1D9E75" strokeWidth="1.2"/>
            <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#1D9E75" opacity="0.7"/>
            <circle cx="9" cy="9" r="2" fill="#085041"/>
          </svg>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize: '19px', fontWeight: '700', color: '#085041',
          marginBottom: '8px',
        }}>
          Leave NomadVital?
        </h3>

        <p style={{
          fontSize: '13px', color: '#5F5E5A', lineHeight: '1.65',
          marginBottom: '24px',
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}>
          Do you want to close the app or stay and continue?
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleContinue}
            style={{
              flex: 1, padding: '13px',
              border: '1.5px solid #D3D1C7', borderRadius: '12px',
              background: '#F9F8F5', color: '#085041',
              fontWeight: '600', fontSize: '14px', cursor: 'pointer',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            Continue
          </button>
          <button
            onClick={handleCloseApp}
            style={{
              flex: 1, padding: '13px',
              border: 'none', borderRadius: '12px',
              background: '#085041', color: '#fff',
              fontWeight: '600', fontSize: '14px', cursor: 'pointer',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            Close App
          </button>
        </div>
      </div>
    </div>
  )
}
