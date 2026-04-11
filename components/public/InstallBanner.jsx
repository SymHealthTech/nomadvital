'use client'

import { useEffect, useState } from 'react'

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)
  const [show, setShow] = useState(false)
  const [showIOSSteps, setShowIOSSteps] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Already running as installed PWA — hide everything
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    // User already dismissed this session
    if (sessionStorage.getItem('pwaInstallDismissed') === 'true') return

    const ios =
      /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) &&
      !window.navigator.standalone

    setIsIOS(ios)

    if (ios) {
      // Show iOS hint automatically after a short delay
      const t = setTimeout(() => setShow(true), 2500)
      return () => clearTimeout(t)
    }

    // Android / Chrome — listen for the native install prompt
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    sessionStorage.setItem('pwaInstallDismissed', 'true')
    setShow(false)
  }

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setShow(false)
    }
    setDeferredPrompt(null)
  }

  if (!show || installed) return null

  return (
    <div style={{
      background: '#085041',
      borderBottom: '1px solid #0F6E56',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 49,
      position: 'relative',
    }}>
      {/* App icon */}
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: '#1D9E75', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
          <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
          <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
        </svg>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', fontFamily: 'var(--font-inter, Inter, sans-serif)', lineHeight: '1.3' }}>
          Add NomadVital to your home screen
        </div>
        {isIOS && !showIOSSteps && (
          <div style={{ fontSize: '11px', color: '#9FE1CB', fontFamily: 'var(--font-inter, Inter, sans-serif)', marginTop: '1px' }}>
            Install it as an app — works offline too
          </div>
        )}
        {isIOS && showIOSSteps && (
          <div style={{ fontSize: '11px', color: '#9FE1CB', fontFamily: 'var(--font-inter, Inter, sans-serif)', marginTop: '3px', lineHeight: '1.5' }}>
            Tap the <strong style={{ color: '#5DCAA5' }}>Share</strong> button{' '}
            <svg style={{ display: 'inline', verticalAlign: 'middle' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" strokeWidth="2">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
            </svg>
            {' '}then <strong style={{ color: '#5DCAA5' }}>"Add to Home Screen"</strong>
          </div>
        )}
      </div>

      {/* Action button */}
      {!isIOS ? (
        <button
          onClick={handleInstall}
          style={{
            background: '#1D9E75', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '7px 14px', fontSize: '12px',
            fontWeight: '600', cursor: 'pointer', flexShrink: 0,
            fontFamily: 'var(--font-inter, Inter, sans-serif)', whiteSpace: 'nowrap',
          }}
        >
          Install
        </button>
      ) : (
        <button
          onClick={() => setShowIOSSteps(s => !s)}
          style={{
            background: '#1D9E75', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '7px 14px', fontSize: '12px',
            fontWeight: '600', cursor: 'pointer', flexShrink: 0,
            fontFamily: 'var(--font-inter, Inter, sans-serif)', whiteSpace: 'nowrap',
          }}
        >
          How to
        </button>
      )}

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          background: 'none', border: 'none', color: '#5DCAA5',
          cursor: 'pointer', padding: '4px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}
