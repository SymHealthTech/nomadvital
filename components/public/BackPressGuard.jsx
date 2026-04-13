'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * Intercepts the hardware / browser back button.
 *
 * How it works (reliably, even on Android PWA):
 *   • On mount: push ONE guard entry so the first back press fires popstate
 *     rather than immediately closing the app.
 *   • On every popstate (back press detected):
 *       – Call history.go(1) to CANCEL the back navigation immediately.
 *       – Increment a counter; reset it if 3 s pass between presses.
 *   • After 3 consecutive presses: show "Leave NomadVital?" dialog.
 *   • Physical back while dialog is open = "Continue" (dismiss dialog).
 *   • "Continue" button  → dismiss, stay in app.
 *   • "Leave Site" button → navigate to home page.
 *
 * Why history.go(1) instead of pushState?
 *   Chrome (Android) silently deduplicates consecutive pushState entries that
 *   share the same URL, so the guards evaporate and the app exits too early.
 *   history.go(1) never modifies the history stack — it just moves the pointer
 *   forward, which is 100 % reliable.
 *
 * Why intercept history.pushState?
 *   Next.js uses pushState for every client-side page navigation.  Without
 *   resetting the counter on forward navigation, pressing Back through 3
 *   legitimate pages would wrongly trigger the dialog.
 */

export default function BackPressGuard() {
  const [show, setShow]   = useState(false)

  const count      = useRef(0)
  const isOpen     = useRef(false)   // true while dialog is on screen
  const skipNext   = useRef(false)   // skip the forward-popstate from our go(1)
  const resetTimer = useRef(null)

  useEffect(() => {
    /* ── 1. Push the initial guard ── */
    window.history.pushState({ nvGuard: true }, '', window.location.href)

    /* ── 2. Reset counter on forward navigation (Next.js page changes) ── */
    const origPushState = window.history.pushState.bind(window.history)
    window.history.pushState = function (state, title, url) {
      if (!state?.nvGuard) {           // ignore our own guard pushes
        count.current = 0
        clearTimeout(resetTimer.current)
      }
      return origPushState(state, title, url)
    }

    /* ── 3. popstate handler ── */
    function onPop() {
      /* Skip the popstate that our own history.go(1) fires */
      if (skipNext.current) {
        skipNext.current = false
        return
      }

      /* ALWAYS cancel the back navigation first */
      skipNext.current = true
      window.history.go(1)

      /* Physical back while dialog is showing = "Continue" */
      if (isOpen.current) {
        isOpen.current = false
        setShow(false)
        count.current = 0
        clearTimeout(resetTimer.current)
        return
      }

      /* Increment counter, auto-reset after 3 s of inactivity */
      count.current += 1
      clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => { count.current = 0 }, 3000)

      /* Third consecutive press → show dialog */
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
      window.history.pushState = origPushState   // restore original
      clearTimeout(resetTimer.current)
    }
  }, [])

  function handleContinue() {
    isOpen.current = false
    setShow(false)
    count.current = 0
  }

  function handleLeave() {
    isOpen.current = false
    setShow(false)
    window.location.href = '/'
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
          Do you want to leave the site or stay and continue?
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
            onClick={handleLeave}
            style={{
              flex: 1, padding: '13px',
              border: 'none', borderRadius: '12px',
              background: '#085041', color: '#fff',
              fontWeight: '600', fontSize: '14px', cursor: 'pointer',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            Leave Site
          </button>
        </div>
      </div>
    </div>
  )
}
