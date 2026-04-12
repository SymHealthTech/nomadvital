'use client'

import { useEffect, useState, useRef } from 'react'

export default function BackPressGuard() {
  const [show, setShow] = useState(false)

  // Use refs so the popstate handler always reads current values
  const count     = useRef(0)
  const isOpen    = useRef(false)   // true while dialog is visible
  const resetTimer = useRef(null)

  useEffect(() => {
    // Push one guard entry so the very first back press fires popstate
    // instead of closing/minimising the PWA
    window.history.pushState(null, '')

    function onPop() {
      // ── Dialog is open: physical back = "Continue" (stay in app) ──
      if (isOpen.current) {
        isOpen.current = false
        setShow(false)
        count.current = 0
        window.history.pushState(null, '')   // re-arm guard
        return
      }

      // ── Always re-push guard so next press is also caught ──
      window.history.pushState(null, '')

      // ── Increment counter ──
      count.current += 1

      // ── Reset counter after 3 s of no further presses ──
      clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => { count.current = 0 }, 3000)

      // ── After 3 consecutive presses → show dialog ──
      if (count.current >= 3) {
        clearTimeout(resetTimer.current)
        count.current = 0
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
    window.history.pushState(null, '')   // re-arm guard
  }

  function handleClose() {
    isOpen.current = false
    setShow(false)
    window.close()                                  // closes PWA on Android
    setTimeout(() => { window.location.href = '/' }, 200)  // browser fallback
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
          Are you sure you want to close the app?
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
            onClick={handleClose}
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
