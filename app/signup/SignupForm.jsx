'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignupForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [resending, setResending] = useState(false)
  const [resendDone, setResendDone] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.')
      return
    }

    // Show "check your email" screen
    setSubmittedEmail(form.email)
    setVerificationSent(true)
  }

  async function handleResend() {
    setResending(true)
    await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: submittedEmail }),
    }).catch(() => {})
    setResending(false)
    setResendDone(true)
    setTimeout(() => setResendDone(false), 5000)
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
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
  }

  /* ── "Check your email" state ── */
  if (verificationSent) {
    return (
      <div className="auth-screen-outer" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: '#F1EFE8',
      }}>
        <div className="auth-card" style={{
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #D3D1C7',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          padding: '36px 32px',
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center',
        }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>

          <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '22px', fontWeight: '700', color: '#085041', marginBottom: '10px' }}>
            Check your email
          </h1>
          <p style={{ fontSize: '14px', color: '#5F5E5A', lineHeight: '1.6', marginBottom: '8px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            We sent a verification link to:
          </p>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#085041', marginBottom: '20px', fontFamily: 'var(--font-inter, Inter, sans-serif)', wordBreak: 'break-all' }}>
            {submittedEmail}
          </p>
          <p style={{ fontSize: '13px', color: '#5F5E5A', lineHeight: '1.6', marginBottom: '24px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Click the link in the email to activate your account. Check your spam folder if you don&apos;t see it.
          </p>

          {resendDone ? (
            <p style={{ fontSize: '13px', color: '#1D9E75', fontWeight: '600', marginBottom: '16px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              ✓ New verification email sent!
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              style={{
                background: 'none', border: '1px solid #D3D1C7', borderRadius: '10px',
                padding: '10px 20px', fontSize: '13px', fontWeight: '600',
                color: resending ? '#888780' : '#085041', cursor: resending ? 'default' : 'pointer',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                marginBottom: '16px', width: '100%',
              }}
            >
              {resending ? 'Sending…' : 'Resend verification email'}
            </button>
          )}

          <Link href="/login" style={{ fontSize: '13px', color: '#888780', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Already verified?{' '}
            <span style={{ color: '#1D9E75', fontWeight: '500' }}>Sign in →</span>
          </Link>
        </div>
      </div>
    )
  }

  /* ── Sign-up form ── */
  return (
    <div className="auth-screen-outer" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: '#F1EFE8',
    }}>
      <div className="auth-card" style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #D3D1C7',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        padding: '36px 32px',
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Logo */}
        <div className="auth-logo-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', justifyContent: 'center' }}>
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

        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '22px', fontWeight: '700', color: '#085041', marginBottom: '4px', textAlign: 'center' }}>
          Create your account
        </h1>
        <p style={{ fontSize: '13px', color: '#888780', textAlign: 'center', marginBottom: '24px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Start free — no credit card required
        </p>

        {/* Error */}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#B91C1C', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5F5E5A', marginBottom: '5px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              required
              autoComplete="name"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5F5E5A', marginBottom: '5px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5F5E5A', marginBottom: '5px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5F5E5A', marginBottom: '5px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Confirm password
            </label>
            {/* Flex row keeps the eye-toggle outside the input — fixes mobile keyboard issues */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat password"
                required
                autoComplete="new-password"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                tabIndex={-1}
                style={{
                  flexShrink: 0,
                  width: '40px', height: '42px',
                  background: '#F9F8F5', border: '1px solid #D3D1C7', borderRadius: '10px',
                  cursor: 'pointer', padding: '0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#888780',
                }}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                )}
              </button>
            </div>
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
              marginTop: '2px',
            }}
          >
            {loading ? 'Creating account...' : 'Create free account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#888780', marginTop: '10px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Cancel anytime · No credit card needed
        </p>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#888780', marginTop: '20px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#1D9E75', fontWeight: '500', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
