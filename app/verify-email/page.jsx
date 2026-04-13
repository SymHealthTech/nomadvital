'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token. Please use the link from your email.')
      return
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus('success')
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed. Please try again.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Network error. Please try again.')
      })
  }, [token])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: '#F1EFE8',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #D3D1C7',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        padding: '36px 32px',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', justifyContent: 'center' }}>
          <div style={{ width: '34px', height: '34px', backgroundColor: '#1D9E75', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
              <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
              <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', letterSpacing: '-0.5px', color: '#085041', fontWeight: 700 }}>
            Nomad<span style={{ fontWeight: 400, fontStyle: 'italic', color: '#1D9E75' }}>Vital</span>
          </span>
        </div>

        {status === 'loading' && (
          <>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <div style={{ width: '22px', height: '22px', border: '3px solid #1D9E75', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '700', color: '#085041', marginBottom: '8px' }}>
              Verifying your email…
            </h1>
            <p style={{ fontSize: '14px', color: '#888780', fontFamily: 'system-ui,sans-serif' }}>
              Just a moment.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '700', color: '#085041', marginBottom: '8px' }}>
              Email verified!
            </h1>
            <p style={{ fontSize: '14px', color: '#5F5E5A', lineHeight: '1.6', marginBottom: '24px', fontFamily: 'system-ui,sans-serif' }}>
              Your email address has been verified. You can now sign in to your NomadVital account.
            </p>
            <Link href="/login" style={{ display: 'block', background: '#1D9E75', color: '#fff', fontWeight: '700', fontSize: '14px', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'system-ui,sans-serif' }}>
              Sign in now →
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '700', color: '#085041', marginBottom: '8px' }}>
              Verification failed
            </h1>
            <p style={{ fontSize: '14px', color: '#5F5E5A', lineHeight: '1.6', marginBottom: '24px', fontFamily: 'system-ui,sans-serif' }}>
              {message}
            </p>
            <Link href="/login" style={{ display: 'block', background: '#085041', color: '#fff', fontWeight: '700', fontSize: '14px', padding: '12px', borderRadius: '10px', textDecoration: 'none', marginBottom: '12px', fontFamily: 'system-ui,sans-serif' }}>
              Back to sign in
            </Link>
            <p style={{ fontSize: '12px', color: '#888780', fontFamily: 'system-ui,sans-serif' }}>
              Need a new link?{' '}
              <Link href="/signup" style={{ color: '#1D9E75', textDecoration: 'none', fontWeight: '500' }}>
                Sign up again
              </Link>
            </p>
          </>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  )
}
