'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Offline fallback — served by the service worker when a navigation
 * request fails because the device has no network connection.
 * Design mirrors the pwa-launch splash so it feels native and on-brand.
 */
export default function OfflinePage() {
  const router = useRouter()
  const [online, setOnline] = useState(false)

  useEffect(() => {
    function handleOnline() {
      setOnline(true)
      // Give the browser a moment to stabilise the connection, then retry
      setTimeout(() => router.back(), 800)
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [router])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#085041',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '32px',
        textAlign: 'center',
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: '#1D9E75',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1" />
          <path
            d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z"
            fill="#E1F5EE"
            opacity="0.85"
          />
          <circle cx="9" cy="9" r="2" fill="#085041" />
        </svg>
      </div>

      {/* Wordmark */}
      <span
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '26px',
          fontWeight: 700,
          color: '#E1F5EE',
          letterSpacing: '-0.3px',
        }}
      >
        Nomad
        <span style={{ fontWeight: 400, fontStyle: 'italic', color: '#4ECFA0' }}>
          Vital
        </span>
      </span>

      {/* Offline icon */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '8px',
        }}
      >
        {online ? (
          /* Checkmark when connection restored */
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4ECFA0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          /* Wi-Fi off icon */
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9FE1CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="2" x2="22" y2="22" />
            <path d="M8.5 16.5a5 5 0 017 0" />
            <path d="M2 8.82a15 15 0 014.17-2.65" />
            <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
            <path d="M16.85 11.25a10 10 0 012.22 1.68" />
            <path d="M5 12.5a10 10 0 015.17-2.39" />
            <circle cx="12" cy="20" r="1" fill="#9FE1CB" stroke="none" />
          </svg>
        )}
      </div>

      {/* Message */}
      <div style={{ maxWidth: '280px' }}>
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            fontWeight: 700,
            color: '#E1F5EE',
            marginBottom: '10px',
            lineHeight: 1.3,
          }}
        >
          {online ? 'Back online!' : "You're offline"}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            fontSize: '14px',
            color: '#9FE1CB',
            lineHeight: 1.65,
          }}
        >
          {online
            ? 'Reconnecting you now…'
            : 'Check your Wi-Fi or mobile data, then try again. Your previously visited pages are cached and available.'}
        </p>
      </div>

      {/* Retry button — only shown when offline */}
      {!online && (
        <button
          onClick={() => router.back()}
          style={{
            marginTop: '8px',
            padding: '13px 32px',
            background: '#1D9E75',
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            boxShadow: '0 4px 16px rgba(29,158,117,0.4)',
          }}
        >
          Try Again
        </button>
      )}
    </div>
  )
}
