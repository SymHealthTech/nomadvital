'use client'

import { useEffect, useState, useRef } from 'react'

export default function BackPressGuard() {
  const [show, setShow]     = useState(false)
  const count               = useRef(0)
  const isOpen              = useRef(false)
  const resetTimer          = useRef(null)

  /* Always push with the explicit current URL — more reliable on Android WebView */
  function pushGuard() {
    window.history.pushState({ nvGuard: true }, '', window.location.href)
  }

  useEffect(() => {
    /* Push 3 guards on mount — belt-and-suspenders buffer */
    pushGuard()
    pushGuard()
    pushGuard()

    function onPop() {
      /*
       * ── STEP 1: Re-arm the guard FIRST, before any other logic. ──
       * This guarantees the app can never silently exit even if the
       * dialog logic below throws or the component is mid-render.
       */
      pushGuard()

      /* ── STEP 2: If dialog is open, physical back = "Continue" ── */
      if (isOpen.current) {
        isOpen.current = false
        setShow(false)
        count.current = 0
        clearTimeout(resetTimer.current)
        return
      }

      /* ── STEP 3: Count consecutive presses ── */
      count.current += 1

      clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => {
        count.current = 0
      }, 3000)

      /* ── STEP 4: After 3 presses → show confirmation dialog ── */
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

  function handleLeave() {
    isOpen.current = false
    setShow(false)
    /* Navigate to home — works in both browser and PWA standalone mode */
    window.location.href = '/'
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
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
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>

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
