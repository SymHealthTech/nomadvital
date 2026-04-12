'use client'

import { useEffect, useState } from 'react'

const benefits = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3"/>
      </svg>
    ),
    title: 'Home screen shortcut',
    desc: 'Launch instantly — no typing URLs',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Feels like a native app',
    desc: 'Full screen, no browser bar clutter',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 6l5 5 4-4 4 4 4-4 5 5"/>
        <path d="M1 12l5 5 4-4 4 4 4-4 5 5"/>
      </svg>
    ),
    title: 'No app store required',
    desc: 'Install in seconds, always up-to-date',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Works in poor connectivity',
    desc: 'Cached guides load even when signal is weak',
  },
]

const iosSteps = [
  { step: '1', text: 'Tap the Share icon in Safari' },
  { step: '2', text: 'Scroll down and tap "Add to Home Screen"' },
  { step: '3', text: 'Tap "Add" — done!' },
]

export default function AppInstallSection() {
  const [platform, setPlatform]         = useState(null)   // null | 'ios' | 'android' | 'desktop' | 'installed'
  const [deferredPrompt, setPrompt]     = useState(null)
  const [installing, setInstalling]     = useState(false)
  const [installed, setInstalled]       = useState(false)
  const [showIOS, setShowIOS]           = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setPlatform('installed')
      return
    }
    const ua = navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(ua) && !window.navigator.standalone
    if (ios) { setPlatform('ios'); return }
    if (/android/.test(ua)) { setPlatform('android'); return }
    setPlatform('desktop')

    const handler = e => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    setInstalling(true)
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setInstalling(false)
    setPrompt(null)
  }

  /* Don't render if already installed */
  if (platform === 'installed' || installed) return null
  /* Don't flash on server / before detection */
  if (!platform) return null

  const isAndroid = platform === 'android'
  const isDesktop = platform === 'desktop'
  const isIOS     = platform === 'ios'

  return (
    <section style={{ background: '#085041', padding: '64px 16px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Label */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <span style={{
            fontSize: '11px', fontWeight: '600', letterSpacing: '2.5px',
            color: '#5DCAA5', textTransform: 'uppercase',
          }}>
            Available as an App
          </span>
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
          fontWeight: '700', color: '#E1F5EE',
          textAlign: 'center', marginBottom: '8px', lineHeight: '1.3',
        }}>
          Use NomadVital like a native app
        </h2>
        <p style={{
          fontSize: '15px', color: '#9FE1CB', textAlign: 'center',
          marginBottom: '48px', lineHeight: '1.6',
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}>
          No download needed — install directly from your browser in seconds.
        </p>

        {/* Two-column: benefits + CTA */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          alignItems: 'center',
        }}>

          {/* Benefits list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(29,158,117,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#5DCAA5', flexShrink: 0,
                }}>
                  {b.icon}
                </div>
                <div>
                  <div style={{
                    fontWeight: '600', fontSize: '14px', color: '#E1F5EE',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)', marginBottom: '2px',
                  }}>
                    {b.title}
                  </div>
                  <div style={{
                    fontSize: '13px', color: '#9FE1CB', lineHeight: '1.5',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}>
                    {b.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Install card */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px',
            padding: '32px 28px',
            textAlign: 'center',
          }}>

            {/* Phone / desktop icon */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: '#1D9E75',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              {isDesktop ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E1F5EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E1F5EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3"/>
                </svg>
              )}
            </div>

            <h3 style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: '18px', fontWeight: '700', color: '#E1F5EE',
              marginBottom: '8px',
            }}>
              {isDesktop ? 'Install on your computer' : isIOS ? 'Add to Home Screen' : 'Install on Android'}
            </h3>
            <p style={{
              fontSize: '13px', color: '#9FE1CB', lineHeight: '1.6',
              marginBottom: '24px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}>
              {isDesktop
                ? 'Click the install icon in your browser address bar, or use the button below.'
                : isIOS
                ? 'Follow the 3 quick steps to add NomadVital to your iPhone home screen.'
                : 'Tap the button below and follow the prompt to install the app.'}
            </p>

            {/* iOS steps */}
            {isIOS && (
              <>
                <button
                  onClick={() => setShowIOS(s => !s)}
                  style={{
                    background: '#1D9E75', color: '#fff', border: 'none',
                    borderRadius: '12px', padding: '13px 28px',
                    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    width: '100%', marginBottom: showIOS ? '20px' : 0,
                  }}
                >
                  {showIOS ? 'Hide steps ↑' : 'Show me how ↓'}
                </button>
                {showIOS && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                    {iosSteps.map(s => (
                      <div key={s.step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          background: '#1D9E75', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', fontWeight: '700', flexShrink: 0,
                          fontFamily: 'var(--font-inter, Inter, sans-serif)',
                        }}>
                          {s.step}
                        </div>
                        <span style={{
                          fontSize: '13px', color: '#E1F5EE', lineHeight: '1.5', paddingTop: '4px',
                          fontFamily: 'var(--font-inter, Inter, sans-serif)',
                        }}>
                          {s.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Android + Desktop install button */}
            {(isAndroid || isDesktop) && (
              <button
                onClick={handleInstall}
                disabled={installing || !deferredPrompt}
                style={{
                  background: deferredPrompt ? '#1D9E75' : 'rgba(29,158,117,0.4)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  padding: '13px 28px', fontSize: '15px', fontWeight: '600',
                  cursor: deferredPrompt ? 'pointer' : 'default',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  width: '100%', transition: 'background 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 18v-6M9 15l3 3 3-3M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/>
                </svg>
                {installing ? 'Installing…' : deferredPrompt ? 'Install App — Free' : 'Open in browser menu to install'}
              </button>
            )}

            <p style={{
              fontSize: '11px', color: '#5DCAA5', marginTop: '14px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}>
              Free · No app store · Works on all devices
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
