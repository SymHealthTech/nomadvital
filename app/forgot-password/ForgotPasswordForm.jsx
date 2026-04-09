'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setLoading(false)

    if (!res.ok) {
      setError('Something went wrong. Please try again.')
      return
    }

    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%',
    border: '1px solid #D3D1C7',
    borderRadius: '10px',
    padding: '11px 14px',
    fontSize: '14px',
    fontFamily: 'var(--font-inter, Inter, sans-serif)',
    color: '#085041',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  }

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

        {submitted ? (
          /* Success state */
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '22px', fontWeight: '700', color: '#085041', marginBottom: '10px' }}>
              Check your email
            </h1>
            <p style={{ fontSize: '14px', color: '#5F5E5A', lineHeight: '1.6', marginBottom: '24px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link. Check your inbox — it expires in 1 hour.
            </p>
            <p style={{ fontSize: '12px', color: '#888780', marginBottom: '20px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Didn&apos;t receive it? Check your spam folder or{' '}
              <button
                onClick={() => setSubmitted(false)}
                style={{ background: 'none', border: 'none', color: '#1D9E75', cursor: 'pointer', fontSize: '12px', padding: 0, fontFamily: 'inherit' }}
              >
                try again
              </button>.
            </p>
            <Link href="/login" style={{ display: 'block', textAlign: 'center', background: '#085041', color: '#fff', fontWeight: '600', fontSize: '14px', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Back to sign in
            </Link>
          </div>
        ) : (
          /* Request form */
          <>
            <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '22px', fontWeight: '700', color: '#085041', marginBottom: '6px', textAlign: 'center' }}>
              Reset your password
            </h1>
            <p style={{ fontSize: '13px', color: '#888780', textAlign: 'center', marginBottom: '24px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Enter your email and we&apos;ll send you a reset link
            </p>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#B91C1C', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5F5E5A', marginBottom: '5px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#9FE1CB' : '#1D9E75',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  transition: 'background 0.15s',
                }}
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#888780', marginTop: '20px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Remember it?{' '}
              <Link href="/login" style={{ color: '#1D9E75', fontWeight: '500', textDecoration: 'none' }}>
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
