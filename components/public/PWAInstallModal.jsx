'use client'

import { useEffect, useState } from 'react'
import { useIsPWA } from '@/hooks/useIsPWA'

const SESSION_KEY = 'showPWAPrompt'

/**
 * Shown automatically after a successful Pro payment.
 * PaymentSuccessRefresh sets sessionStorage[SESSION_KEY] = 'true' before
 * redirecting to /dashboard (clean URL). This component detects that flag,
 * clears it, and shows the install prompt.
 */
export default function PWAInstallModal() {
  const isPWA = useIsPWA()
  const [show,           setShow]     = useState(false)
  const [platform,       setPlatform] = useState(null)
  const [deferredPrompt, setPrompt]   = useState(null)
  const [installing,     setInstalling] = useState(false)
  const [done,           setDone]     = useState(false)
  const [showIOSSteps,   setShowIOS]  = useState(false)

  useEffect(() => {
    /* Check flag */
    if (sessionStorage.getItem(SESSION_KEY) !== 'true') return
    sessionStorage.removeItem(SESSION_KEY)

    /* Already installed as PWA — skip */
    if (isPWA) return

    const ua  = navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(ua) && !window.navigator.standalone
    setPlatform(ios ? 'ios' : /android/.test(ua) ? 'android' : 'desktop')
    setShow(true)

    const handler = e => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [isPWA])

  async function handleInstall() {
    if (!deferredPrompt) return
    setInstalling(true)
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDone(true)
    setInstalling(false)
    setPrompt(null)
    setShow(false)
  }

  function dismiss() { setShow(false) }

  if (!show) return null

  const isIOS     = platform === 'ios'
  const isAndroid = platform === 'android'
  const isDesktop = platform === 'desktop'

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'pwaFadeIn 0.2s ease',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: '22px',
        padding: '32px 28px 28px',
        maxWidth: '360px', width: '100%',
        textAlign: 'center',
        boxShadow: '0 28px 80px rgba(0,0,0,0.22)',
        animation: 'pwaPopIn 0.25s ease',
        position: 'relative',
      }}>

        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: '#F1EFE8', border: 'none', borderRadius: '50%',
            width: '28px', height: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#5F5E5A',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Confetti / celebration icon */}
        <div style={{ fontSize: '44px', marginBottom: '6px', lineHeight: 1 }}>🎉</div>

        {/* Pro badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#E1F5EE', borderRadius: '20px',
          padding: '4px 12px', marginBottom: '14px',
        }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1D9E75' }} />
          <span style={{
            fontSize: '11px', fontWeight: '700', color: '#085041',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            letterSpacing: '0.5px',
          }}>
            PRO ACTIVATED
          </span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize: '20px', fontWeight: '700', color: '#085041',
          marginBottom: '8px', lineHeight: '1.25',
        }}>
          Welcome to NomadVital Pro!
        </h2>
        <p style={{
          fontSize: '13px', color: '#5F5E5A', lineHeight: '1.65',
          marginBottom: '24px',
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}>
          One last step — add NomadVital to your{' '}
          {isDesktop ? 'browser' : 'home screen'} for the best experience.
          No app store needed.
        </p>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #E8E6E0', marginBottom: '20px' }} />

        {/* Platform-specific install UI */}
        {isIOS && (
          <>
            <button
              onClick={() => setShowIOS(s => !s)}
              style={{
                width: '100%', padding: '13px',
                background: '#085041', color: '#fff',
                border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                marginBottom: showIOSSteps ? '16px' : 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              {showIOSSteps ? 'Hide steps' : 'Add to Home Screen'}
            </button>
            {showIOSSteps && (
              <div style={{
                background: '#F1EFE8', borderRadius: '12px', padding: '16px',
                textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                {[
                  "Tap the Share button in Safari's bottom bar",
                  'Scroll and tap "Add to Home Screen"',
                  'Tap "Add" in the top-right corner',
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: '#1D9E75', color: '#fff', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: '700',
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    }}>
                      {i + 1}
                    </div>
                    <span style={{
                      fontSize: '13px', color: '#085041', lineHeight: '1.5', paddingTop: '3px',
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {(isAndroid || isDesktop) && (
          <button
            onClick={handleInstall}
            disabled={installing || !deferredPrompt}
            style={{
              width: '100%', padding: '13px',
              background: deferredPrompt ? '#085041' : '#D3D1C7',
              color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: '600',
              cursor: deferredPrompt ? 'pointer' : 'default',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.15s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 18v-6M9 15l3 3 3-3M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/>
            </svg>
            {installing
              ? 'Installing…'
              : deferredPrompt
              ? `Install App — ${isDesktop ? 'Desktop' : 'Android'}`
              : 'Use browser menu → "Install App"'}
          </button>
        )}

        {/* Skip link */}
        <button
          onClick={dismiss}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '12px', color: '#888780', marginTop: '14px', display: 'block', width: '100%',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
          }}
        >
          Maybe later — continue in browser
        </button>
      </div>

      <style>{`
        @keyframes pwaFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pwaPopIn  { from{opacity:0;transform:scale(0.93) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>
    </div>
  )
}
