'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('[Page Error]', error)
  }, [error])

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      background: '#F1EFE8',
      fontFamily: 'var(--font-inter, Inter, sans-serif)',
    }}>
      <div style={{
        width: '56px', height: '56px', background: '#E1F5EE', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
      }}>
        <svg width="24" height="24" fill="none" stroke="#1D9E75" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
      </div>
      <h1 style={{
        fontFamily: 'var(--font-playfair, Georgia, serif)',
        fontSize: '22px', fontWeight: '700', color: '#085041', marginBottom: '8px',
      }}>
        Something went wrong
      </h1>
      <p style={{ fontSize: '14px', color: '#5F5E5A', maxWidth: '360px', lineHeight: '1.6', marginBottom: '24px' }}>
        We couldn&apos;t load this page right now. This is usually a temporary issue — please try again.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            background: '#1D9E75', color: '#fff', border: 'none', cursor: 'pointer',
            fontWeight: '600', fontSize: '14px', padding: '11px 24px', borderRadius: '10px',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
          }}
        >
          Try again
        </button>
        <Link href="/" style={{
          background: '#fff', color: '#085041', border: '1px solid #D3D1C7',
          fontWeight: '600', fontSize: '14px', padding: '11px 24px', borderRadius: '10px',
          textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}>
          Go home
        </Link>
      </div>
    </div>
  )
}
