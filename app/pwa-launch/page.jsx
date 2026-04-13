'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * PWA launch gateway — this is the start_url in manifest.json.
 * Every time the installed app opens from the home screen it lands here first.
 * We stamp localStorage so the rest of the app knows it's running as a PWA,
 * then immediately redirect to the normal auth-redirect flow.
 */
export default function PWALaunch() {
  const router = useRouter()

  useEffect(() => {
    try {
      localStorage.setItem('nvPWA', '1')
    } catch (_) {}
    router.replace('/auth/redirect')
  }, [router])

  /* Splash screen — matches the manifest background_color */
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#085041',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    }}>
      {/* Logo mark */}
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '20px',
        background: '#1D9E75',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}>
        <svg width="36" height="36" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
          <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z"
            fill="#E1F5EE" opacity="0.85"/>
          <circle cx="9" cy="9" r="2" fill="#085041"/>
        </svg>
      </div>

      {/* Wordmark */}
      <span style={{
        fontFamily: 'Georgia, serif',
        fontSize: '26px',
        fontWeight: 700,
        color: '#E1F5EE',
        letterSpacing: '-0.3px',
      }}>
        Nomad<span style={{ fontWeight: 400, fontStyle: 'italic', color: '#4ECFA0' }}>Vital</span>
      </span>
    </div>
  )
}
