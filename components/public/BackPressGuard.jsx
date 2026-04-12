'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * Professional 3-press back-button guard for PWA.
 *
 * Flow:
 *   1st back press  → toast  "Press back 2 more times to exit"
 *   2nd back press  → toast  "Press back once more to exit"
 *   3rd back press  → "Leave NomadVital?" confirmation dialog
 *   Physical back while dialog is open → dismiss dialog (stay), reset count
 *   "Cancel"  → dismiss dialog, reset count
 *   "Exit App"→ window.close() / fallback home
 *
 * A history guard is ALWAYS re-pushed after every handled press so the
 * browser can never silently close the PWA.
 */

const THRESHOLD   = 3      // presses before dialog
const GAP_RESET   = 3000   // ms — counter resets if gap between presses is too long
const TOAST_HIDE  = 2500   // ms — toast auto-hides

export default function BackPressGuard() {
  const [toast,      setToast]      = useState('')       // '' = hidden
  const [dialog,     setDialog]     = useState(false)

  // All mutable state lives in refs so the popstate handler never reads stale closures
  const countRef      = useRef(0)
  const dialogRef     = useRef(false)
  const lastPressRef  = useRef(0)
  const gapTimer      = useRef(null)
  const toastTimer    = useRef(null)

  /* keep dialogRef in sync with state */
  function openDialog() {
    dialogRef.current = true
    setDialog(true)
  }
  function closeDialog() {
    dialogRef.current = false
    setDialog(false)
  }

  /* always push one guard so next back press fires popstate */
  function pushGuard() {
    window.history.pushState({ nvGuard: true }, '')
  }

  /* reset press counter and clear toasts/timers */
  function resetCount() {
    countRef.current = 0
    clearTimeout(gapTimer.current)
    clearTimeout(toastTimer.current)
    setToast('')
  }

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), TOAST_HIDE)
  }

  useEffect(() => {
    /* Push the initial guard on mount */
    pushGuard()

    function onPopState() {
      const now     = Date.now()
      const elapsed = now - lastPressRef.current
      lastPressRef.current = now

      /* ── If dialog is open: physical back = dismiss dialog ── */
      if (dialogRef.current) {
        closeDialog()
        resetCount()
        pushGuard()   // re-arm
        return
      }

      /* ── Reset counter if gap between presses is too long ── */
      if (elapsed > GAP_RESET) {
        countRef.current = 0
      }

      /* ── Increment ── */
      countRef.current += 1

      /* ── Schedule gap-reset (so slow presses don't accumulate forever) ── */
      clearTimeout(gapTimer.current)
      gapTimer.current = setTimeout(() => {
        countRef.current = 0
        setToast('')
      }, GAP_RESET)

      /* ── Decide what to show ── */
      if (countRef.current >= THRESHOLD) {
        /* Third (or more) rapid press → confirmation dialog */
        clearTimeout(gapTimer.current)
        clearTimeout(toastTimer.current)
        setToast('')
        countRef.current = 0
        openDialog()
        pushGuard()   // guard so physical back on dialog dismisses it (handled above)
      } else {
        /* First or second press → progress toast */
        const remaining = THRESHOLD - countRef.current
        showToast(
          remaining === 1
            ? 'Press back once more to exit'
            : `Press back ${remaining} more times to exit`
        )
        pushGuard()   // re-arm for next press
      }
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      clearTimeout(gapTimer.current)
      clearTimeout(toastTimer.current)
    }
  }, [])

  /* ── Dialog buttons ── */
  function handleCancel() {
    closeDialog()
    resetCount()
    pushGuard()
  }

  function handleExit() {
    closeDialog()
    window.close()
    setTimeout(() => { window.location.href = '/' }, 200)
  }

  /* ── Render ── */
  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(6,46,37,0.93)',
            color: '#E1F5EE',
            fontSize: '13px',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            fontWeight: '500',
            padding: '11px 22px',
            borderRadius: '24px',
            zIndex: 9998,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
            animation: 'bpSlideUp 0.2s ease',
          }}
        >
          {toast}
        </div>
      )}

      {/* Confirmation dialog */}
      {dialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bp-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.52)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            animation: 'bpFadeIn 0.18s ease',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px 24px 24px',
              maxWidth: '310px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
              animation: 'bpPopIn 0.2s ease',
            }}
          >
            {/* Logo mark */}
            <div style={{
              width: '56px', height: '56px', background: '#E8F5EE', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
            }}>
              <svg width="26" height="26" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="#1D9E75" strokeWidth="1.2"/>
                <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#1D9E75" opacity="0.7"/>
                <circle cx="9" cy="9" r="2" fill="#085041"/>
              </svg>
            </div>

            <h3 id="bp-title" style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: '19px', fontWeight: '700', color: '#085041',
              marginBottom: '8px', lineHeight: '1.25',
            }}>
              Leave NomadVital?
            </h3>
            <p style={{
              fontSize: '13px', color: '#5F5E5A', lineHeight: '1.65',
              marginBottom: '24px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}>
              Are you sure you want to close the app?
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1, padding: '13px',
                  border: '1.5px solid #D3D1C7', borderRadius: '12px',
                  background: '#F9F8F5', color: '#085041',
                  fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleExit}
                style={{
                  flex: 1, padding: '13px',
                  border: 'none', borderRadius: '12px',
                  background: '#085041', color: '#ffffff',
                  fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                Exit App
              </button>
            </div>
          </div>

          <style>{`
            @keyframes bpSlideUp { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
            @keyframes bpFadeIn  { from{opacity:0} to{opacity:1} }
            @keyframes bpPopIn   { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
          `}</style>
        </div>
      )}
    </>
  )
}
