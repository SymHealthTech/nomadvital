'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * Professional Android-style back-button guard for PWA.
 *
 * Behaviour:
 *   1st back press  → toast "Tap back once more to exit"
 *   2nd back press within 2s → "Leave NomadVital?" dialog
 *   Physical back while dialog is open → dismiss dialog (stay in app)
 *   Dialog "Cancel" → stay, reset counter
 *   Dialog "Exit"   → window.close() / fallback to home
 *
 * A guard history-state is always maintained so the browser never
 * exits the PWA silently.
 */
export default function BackPressGuard() {
  const [uiState, setUiState] = useState('idle') // 'idle' | 'toast' | 'dialog'
  const stateRef  = useRef('idle')   // mirror for use inside event handler (no stale closure)
  const lastPress = useRef(0)
  const toastTimer = useRef(null)
  const WINDOW_MS = 2000             // 2 s window to register second press

  /* ── helpers ── */
  function pushGuard() {
    window.history.pushState({ nvGuard: true }, '')
  }

  function transition(next) {
    stateRef.current = next
    setUiState(next)
  }

  /* ── popstate handler ── */
  useEffect(() => {
    pushGuard() // place first guard so back doesn't close app immediately

    function onPopState() {
      const now     = Date.now()
      const elapsed = now - lastPress.current
      lastPress.current = now

      const s = stateRef.current

      // ── Case 1: dialog is open → physical back = dismiss (treat as "Cancel")
      if (s === 'dialog') {
        clearTimeout(toastTimer.current)
        transition('idle')
        pushGuard()
        return
      }

      // ── Case 2: toast is visible and second press comes within 2 s → show dialog
      if (s === 'toast' && elapsed <= WINDOW_MS) {
        clearTimeout(toastTimer.current)
        transition('dialog')
        pushGuard()   // keep guard so physical back on dialog is caught (Case 1)
        return
      }

      // ── Case 3: idle, OR toast timeout already passed → first press, show toast
      clearTimeout(toastTimer.current)
      transition('toast')
      pushGuard()     // re-push guard so next press fires popstate again
      toastTimer.current = setTimeout(() => {
        // toast expired without a second press → reset
        if (stateRef.current === 'toast') transition('idle')
      }, WINDOW_MS + 200) // slightly longer than WINDOW_MS so Case 2 wins a tight race
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      clearTimeout(toastTimer.current)
    }
  }, [])

  /* ── dialog button handlers ── */
  function handleCancel() {
    clearTimeout(toastTimer.current)
    transition('idle')
    pushGuard()
  }

  function handleExit() {
    transition('idle')
    // Close PWA on Android; fallback navigates to home on browsers
    window.close()
    setTimeout(() => { window.location.href = '/' }, 200)
  }

  /* ── render ── */
  return (
    <>
      {/* ── Toast ── */}
      {uiState === 'toast' && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
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
            animation: 'nvSlideUp 0.22s ease',
            pointerEvents: 'none',
          }}
        >
          Tap back once more to exit
        </div>
      )}

      {/* ── Exit confirmation dialog ── */}
      {uiState === 'dialog' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-dialog-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.50)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            animation: 'nvFadeIn 0.18s ease',
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
              animation: 'nvPopIn 0.22s ease',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                background: '#E8F5EE',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
              }}
            >
              {/* NomadVital logo mark */}
              <svg width="26" height="26" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="#1D9E75" strokeWidth="1.2"/>
                <path
                  d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z"
                  fill="#1D9E75"
                  opacity="0.7"
                />
                <circle cx="9" cy="9" r="2" fill="#085041"/>
              </svg>
            </div>

            {/* Title */}
            <h3
              id="exit-dialog-title"
              style={{
                fontFamily: 'var(--font-playfair, Georgia, serif)',
                fontSize: '19px',
                fontWeight: '700',
                color: '#085041',
                marginBottom: '8px',
                lineHeight: '1.25',
              }}
            >
              Leave NomadVital?
            </h3>

            {/* Body */}
            <p
              style={{
                fontSize: '13px',
                color: '#5F5E5A',
                lineHeight: '1.65',
                marginBottom: '24px',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              Are you sure you want to close the app?
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: '13px',
                  border: '1.5px solid #D3D1C7',
                  borderRadius: '12px',
                  background: '#F9F8F5',
                  color: '#085041',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  transition: 'background 0.15s',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleExit}
                style={{
                  flex: 1,
                  padding: '13px',
                  border: 'none',
                  borderRadius: '12px',
                  background: '#085041',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  transition: 'background 0.15s',
                }}
              >
                Exit App
              </button>
            </div>
          </div>

          <style>{`
            @keyframes nvSlideUp  { from { opacity:0; transform:translateX(-50%) translateY(10px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
            @keyframes nvFadeIn   { from { opacity:0 } to { opacity:1 } }
            @keyframes nvPopIn    { from { opacity:0; transform:scale(0.93) } to { opacity:1; transform:scale(1) } }
          `}</style>
        </div>
      )}
    </>
  )
}
