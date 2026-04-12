'use client'

import { useEffect, useState } from 'react'

/**
 * Persistent "Install app" badge shown in the hero section.
 * Renders null when already running as an installed PWA.
 * No dismiss — always visible to browser users.
 */
export default function HeroInstallBadge() {
  const [platform, setPlatform]     = useState(null)   // null | 'ios' | 'android' | 'desktop' | 'installed'
  const [prompt,   setPrompt]       = useState(null)
  const [showTip,  setShowTip]      = useState(false)  // iOS tooltip
  const [done,     setDone]         = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setPlatform('installed')
      return
    }
    const ua  = navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(ua) && !window.navigator.standalone
    if (ios) { setPlatform('ios'); return }
    if (/android/.test(ua)) { setPlatform('android'); return }
    setPlatform('desktop')

    const handler = e => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') { setDone(true) }
    setPrompt(null)
  }

  if (!platform || platform === 'installed' || done) return null

  const isIOS = platform === 'ios'

  return (
    <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>

      {/* Badge pill */}
      <button
        onClick={isIOS ? () => setShowTip(s => !s) : handleInstall}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(93,202,165,0.45)',
          borderRadius: '40px',
          padding: '8px 18px 8px 10px',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
      >
        {/* App icon bubble */}
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: '#1D9E75',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
            <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
            <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
          </svg>
        </div>

        {/* Text */}
        <div style={{ textAlign: 'left' }}>
          <div style={{
            fontSize: '12px', fontWeight: '700', color: '#E1F5EE',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            lineHeight: '1.2',
          }}>
            {isIOS ? 'Add to Home Screen' : 'Install App — Free'}
          </div>
          <div style={{
            fontSize: '10px', color: '#9FE1CB',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            lineHeight: '1.2',
          }}>
            {isIOS ? 'Tap for quick steps' : 'Works like a native app · No app store'}
          </div>
        </div>

        {/* Arrow / download icon */}
        {isIOS ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}>
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}>
            <path d="M12 18v-6M9 15l3 3 3-3M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/>
          </svg>
        )}
      </button>

      {/* iOS expanded steps */}
      {isIOS && showTip && (
        <div style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(93,202,165,0.3)',
          borderRadius: '14px',
          padding: '14px 18px',
          maxWidth: '280px',
          width: '100%',
          textAlign: 'left',
          animation: 'hbSlideDown 0.2s ease',
        }}>
          {[
            'Tap the Share  button in Safari',
            'Tap "Add to Home Screen"',
            'Tap "Add" — done!',
          ].map((text, i) => (
            <div key={i} style={{
              display: 'flex', gap: '10px', alignItems: 'center',
              marginBottom: i < 2 ? '8px' : 0,
            }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#1D9E75', color: '#fff', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: '700',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}>
                {i + 1}
              </div>
              <span style={{
                fontSize: '12px', color: '#E1F5EE', lineHeight: '1.4',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}>
                {text}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes hbSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
