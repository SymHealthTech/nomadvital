'use client'

import { useEffect, useState } from 'react'
import { useIsPWA } from '@/hooks/useIsPWA'
import { usePWAInstall } from '@/hooks/usePWAInstall'

export default function InstallBanner() {
  const isPWA               = useIsPWA()
  const { canInstall, install, isInstalled } = usePWAInstall()

  const [isIOS,        setIsIOS]        = useState(false)
  const [show,         setShow]         = useState(false)
  const [showIOSSteps, setShowIOSSteps] = useState(false)
  const [dismissed,    setDismissed]    = useState(false)

  useEffect(() => {
    // Already running as installed PWA or user already dismissed this session
    if (isPWA || isInstalled) return
    if (sessionStorage.getItem('pwaInstallDismissed') === 'true') return

    const ios =
      /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) &&
      !window.navigator.standalone

    setIsIOS(ios)

    if (ios) {
      const t = setTimeout(() => setShow(true), 2500)
      return () => clearTimeout(t)
    }
  }, [isPWA, isInstalled])

  // Show banner when the native install prompt becomes available (Android/Chrome)
  useEffect(() => {
    if (isPWA || isInstalled || isIOS) return
    if (sessionStorage.getItem('pwaInstallDismissed') === 'true') return
    if (canInstall) setShow(true)
  }, [canInstall, isPWA, isInstalled, isIOS])

  function dismiss() {
    sessionStorage.setItem('pwaInstallDismissed', 'true')
    setDismissed(true)
    setShow(false)
  }

  async function handleInstall() {
    const accepted = await install()
    if (accepted) setShow(false)
  }

  if (!show || dismissed) return null

  return (
    <div className="md:hidden flex items-center justify-center" style={{
      background: '#0F6E56',
      borderBottom: '1px solid #085041',
      padding: '7px 16px',
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
