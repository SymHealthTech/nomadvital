'use client'

import { useEffect, useState } from 'react'

/**
 * Permanent "Install as App" card rendered at the bottom of HowItWorksSection.
 * Hides automatically when the user is already running as an installed PWA.
 */
export default function HowItWorksInstallCard() {
  const [platform, setPlatform] = useState(null)
  const [prompt,   setPrompt]   = useState(null)
  const [showTip,  setShowTip]  = useState(false)
  const [done,     setDone]     = useState(false)

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
    if (outcome === 'accepted') setDone(true)
    setPrompt(null)
  }

  if (!platform || platform === 'installed' || done) return null

  const isIOS     = platform === 'ios'
  const isAndroid = platform === 'android'
  const isDesktop = platform === 'desktop'

  return (
    <div style={{ marginTop: '40px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #085041 0%, #0F6E56 100%)',
        borderRadius: '20px',
        padding: '28px 28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 8px 32px rgba(8,80,65,0.15)',
      }}>

        {/* Left: icon + text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '220px' }}>
          {/* App icon */}
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: '#1D9E75',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}>
            <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
              <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
              <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
            </svg>
          </div>

          <div>
            <div style={{
              fontSize: '16px', fontWeight: '700', color: '#E1F5EE',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              marginBottom: '3px',
            }}>
              {isDesktop ? 'Install on your desktop' : 'Add to your home screen'}
            </div>
            <div style={{
              fontSize: '12px', color: '#9FE1CB', lineHeight: '1.5',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}>
              Use NomadVital like a native app · No app store · Always up-to-date
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <div style={{ flexShrink: 0 }}>
          {isIOS ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <button
                onClick={() => setShowTip(s => !s)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  background: '#fff', color: '#085041',
                  border: 'none', borderRadius: '12px',
                  padding: '11px 20px', fontSize: '14px', fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                Add to Home Screen
              </button>

              {showTip && (
                <div style={{
                  background: 'rgba(0,0,0,0.35)',
                  borderRadius: '12px', padding: '12px 14px',
                  animation: 'hiwSlide 0.2s ease',
                  minWidth: '210px',
                }}>
                  {[
                    'Open in Safari browser',
                    'Tap Share  → "Add to Home Screen"',
                    'Tap "Add" to install',
                  ].map((t, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '8px', alignItems: 'center',
                      marginBottom: i < 2 ? '7px' : 0,
                    }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: '#1D9E75', color: '#fff', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '9px', fontWeight: '700',
                        fontFamily: 'var(--font-inter, Inter, sans-serif)',
                      }}>{i + 1}</div>
                      <span style={{
                        fontSize: '11px', color: '#E1F5EE',
                        fontFamily: 'var(--font-inter, Inter, sans-serif)',
                      }}>{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleInstall}
              disabled={!prompt}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                background: prompt ? '#fff' : 'rgba(255,255,255,0.2)',
                color: prompt ? '#085041' : '#9FE1CB',
                border: 'none', borderRadius: '12px',
                padding: '11px 20px', fontSize: '14px', fontWeight: '700',
                cursor: prompt ? 'pointer' : 'default',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 18v-6M9 15l3 3 3-3M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/>
              </svg>
              {prompt
                ? (isDesktop ? 'Install on Desktop' : 'Install Android App')
                : 'Use browser menu → Install'}
            </button>
          )}
        </div>
      </div>

      <style>{`@keyframes hiwSlide { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  )
}
