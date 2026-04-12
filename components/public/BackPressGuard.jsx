'use client'

import { useEffect, useState, useRef } from 'react'

const PRESS_THRESHOLD = 3
const RAPID_WINDOW = 2500 // ms — resets counter if gap is too long

/**
 * Global back-button guard.
 * After 3 rapid consecutive back presses (within 2.5s) the app shows a
 * "Leave NomadVital?" confirmation dialog.
 * Added to ConditionalLayout so it is always active across the whole app.
 */
export default function BackPressGuard() {
  const [showDialog, setShowDialog] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const pressCount = useRef(0)
  const lastPressTime = useRef(0)
  const resetTimer = useRef(null)
  const toastTimer = useRef(null)

  function showToast(msg) {
    setToastMsg(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(''), 1800)
  }

  function resetCount() {
    pressCount.current = 0
    setToastMsg('')
  }

  function handleStay() {
    setShowDialog(false)
    resetCount()
    // Push a fresh guard so the next back press is caught
    window.history.pushState({ nvGuard: true }, '')
  }

  function handleLeave() {
    setShowDialog(false)
    // Try to close PWA window; fall back to navigating to home
    window.close()
    setTimeout(() => { window.location.href = '/' }, 150)
  }

  useEffect(() => {
    // Push one guard state so the very first back press is caught here
    // rather than exiting the app immediately
    window.history.pushState({ nvGuard: true }, '')

    function handlePopState() {
      const now = Date.now()

      // Reset counter if the last press was too long ago
      if (now - lastPressTime.current > RAPID_WINDOW) {
        pressCount.current = 0
      }
      lastPressTime.current = now
      pressCount.current += 1

      // Schedule auto-reset
      clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(resetCount, RAPID_WINDOW)

      if (pressCount.current >= PRESS_THRESHOLD) {
        // Show exit confirmation
        pressCount.current = 0
        clearTimeout(resetTimer.current)
        setShowDialog(true)
      } else {
        // Show progress toast
        const remaining = PRESS_THRESHOLD - pressCount.current
        showToast(`Press back ${remaining} more time${remaining !== 1 ? 's' : ''} to exit`)
        // Push guard again so next press is caught
        window.history.pushState({ nvGuard: true }, '')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      clearTimeout(resetTimer.current)
      clearTimeout(toastTimer.current)
    }
  }, [])

  return (
    <>
      {/* Toast notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(8,80,65,0.92)', color: '#E1F5EE', fontSize: '13px',
          fontFamily: 'var(--font-inter, Inter, sans-serif)', fontWeight: '500',
          padding: '10px 20px', borderRadius: '24px', zIndex: 9998,
          whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          animation: 'nvFadeIn 0.2s ease',
        }}>
          {toastMsg}
        </div>
      )}

      {/* Exit confirmation dialog */}
      {showDialog && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '28px 24px',
            maxWidth: '300px', width: '100%', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              width: '52px', height: '52px', background: '#F1EFE8', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#085041" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: '18px', fontWeight: '700', color: '#085041', marginBottom: '8px',
            }}>
              Leave NomadVital?
            </h3>
            <p style={{
              fontSize: '13px', color: '#5F5E5A', lineHeight: '1.6', marginBottom: '22px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}>
              Are you sure you want to exit the app?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleStay}
                style={{
                  flex: 1, padding: '12px', border: '1.5px solid #D3D1C7',
                  borderRadius: '12px', background: '#fff', color: '#085041',
                  fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                Stay
              </button>
              <button
                onClick={handleLeave}
                style={{
                  flex: 1, padding: '12px', border: 'none',
                  borderRadius: '12px', background: '#085041', color: '#fff',
                  fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                Exit
              </button>
            </div>
          </div>
          <style>{`@keyframes nvFadeIn{from{opacity:0;transform:translateX(-50%) translateY(6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
        </div>
      )}
    </>
  )
}
