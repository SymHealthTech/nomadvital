'use client'

import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

// Root tabs — hardware back on these triggers the exit-confirmation dialog.
// Any other pathname is a sub-page and hardware back navigates to its logical parent.
const ROOT_PAGES = new Set([
  '/', '/ask', '/destinations', '/blog', '/dashboard', '/planner', '/guest',
])

// Returns the logical parent path for known sub-pages, or null for unknown ones.
function getParentPath(pathname) {
  if (pathname.startsWith('/blog/'))         return '/blog'
  if (pathname.startsWith('/destinations/')) return '/destinations'
  if (pathname.startsWith('/for/'))          return '/'
  if (pathname === '/pricing')               return '/dashboard'
  if (pathname === '/privacy' ||
      pathname === '/disclaimer' ||
      pathname === '/contact')               return '/'
  if (pathname === '/forgot-password' ||
      pathname === '/reset-password' ||
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

// useLayoutEffect runs synchronously before paint on the client, cutting the
// race window where a fast back press could fire before the sentinel is pushed.
// On the server (SSR) useLayoutEffect is not available, so fall back to useEffect
// to avoid the React warning — the effect never actually runs on the server anyway.
const useClientLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function BackPressGuard() {
  const [show, setShow] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  const isOpen     = useRef(false)
  const allowExit  = useRef(false)

  // Keep current values accessible inside the stable popstate closure
  const pathnameRef = useRef(pathname)
  const routerRef   = useRef(router)
  pathnameRef.current = pathname
  routerRef.current   = router

  // ── Sentinel management ──────────────────────────────────────────────────
  // Push one sentinel entry above every real page so that popstate fires
  // reliably on every hardware back press regardless of how we arrived here.
  //
  // Using useClientLayoutEffect (synchronous before paint) minimises the race
  // window between page load and the first back press.  If the user somehow
  // presses back before this fires, the browser's own entry for the page
  // still acts as a partial guard on most Android Chrome builds.
  //
  // Runs on mount AND after every pathname change (SPA navigation).
  // Suppressed while the close-app drain sequence is in progress so the
  // history stack isn't refilled while we're trying to empty it.
  useClientLayoutEffect(() => {
    if (typeof window === 'undefined') return
    if (!isPWAMode()) return
    if (allowExit.current) return
    window.history.pushState({ nvGuard: true }, '', window.location.href)
  }, [pathname])

  // ── popstate listener ────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isPWAMode()) return

    function onPop() {
      // Close-app drain in progress — let all events pass through to the OS.
      if (allowExit.current) return

      // Navigation triggered by the PWAHeader back button — already handled
      // by the header component, so BackPressGuard should stay silent.
      if (window.__NV_HEADER_BACK__) {
        window.__NV_HEADER_BACK__ = false
        return
      }

      const currentPath = pathnameRef.current
      const isRoot = ROOT_PAGES.has(currentPath)

      // Re-arm: push a fresh sentinel immediately so the NEXT hardware back
      // press is also intercepted.  This replaces the old history.go(1) +
      // "skip next event" approach, which had async-timing races.
      window.history.pushState({ nvGuard: true }, '', window.location.href)

      // ── Sub-page: navigate to logical parent ─────────────────────────────
      if (!isRoot) {
        const parent = getParentPath(currentPath) ?? '/'
        routerRef.current.push(parent)
        return
      }

      // ── Root page: dismiss dialog if it is currently open ────────────────
      if (isOpen.current) {
        isOpen.current = false
        setShow(false)
        return
      }

      // ── Root page: show exit confirmation on the very first back press ────
      isOpen.current = true
      setShow(true)
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // ── Dialog handlers ──────────────────────────────────────────────────────

  function handleContinue() {
    isOpen.current  = false
    allowExit.current = false // re-enable guard in case it was partially armed
    setShow(false)
  }

  function handleCloseApp() {
    isOpen.current = false
    setShow(false)

    // Allow all subsequent popstate events to pass through so the OS can
    // close the PWA window after the history stack is empty.
    allowExit.current = true

    // Attempt programmatic close (only works in windows opened by JS;
    // will silently no-op in a home-screen PWA — that's expected).
    window.close()

    // Primary exit path for Android Chrome PWA: drain the entire history
    // stack back to position 0.  Once at position 0, the next hardware back
    // press is handled by the OS and closes the PWA activity.
    //
    // The sentinel useClientLayoutEffect is suppressed (allowExit = true)
    // during the drain so no new entries are pushed while we go back.
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
      aria-labelledby="exit-dialog-title"
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

        <h3
          id="exit-dialog-title"
          style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: '19px', fontWeight: '700', color: '#085041',
            marginBottom: '8px',
          }}
        >
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
