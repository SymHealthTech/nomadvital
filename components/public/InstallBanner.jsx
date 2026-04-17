'use client'

import { useEffect, useState } from 'react'

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)
  const [show, setShow] = useState(false)
  const [showIOSSteps, setShowIOSSteps] = useState(false) // iOS: toggle tap instructions
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
    <div className="md:hidden" style={{
      background: '#0F6E56',
      borderBottom: '1px solid #085041',
      padding: '7px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      zIndex: 49,
    }}>
      <button
        onClick={isIOS ? () => setShowIOSSteps(s => !s) : handleInstall}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 18v-6M9 15l3 3 3-3M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/>
        </svg>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#5DCAA5', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          {showIOSSteps ? 'Tap Share → "Add to Home Screen"' : 'Install like an app'}
        </span>
      </button>

      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{ background: 'none', border: 'none', color: '#9FE1CB', cursor: 'pointer', padding: '2px', display: 'flex', lineHeight: 1 }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}
