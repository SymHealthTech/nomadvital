'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const otherDevice = searchParams.get('reason') === 'other_device'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
    } else {
      router.push('/auth/redirect')
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl: '/auth/redirect' })
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
          Welcome back
        </h1>
        <p style={{ fontSize: '13px', color: '#888780', textAlign: 'center', marginBottom: '24px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Sign in to your NomadVital account
        </p>

        {/* Signed out — another device logged in */}
        {otherDevice && (
          <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#92400E', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            You were signed out because your account was accessed on another device.
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#B91C1C', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5F5E5A', marginBottom: '5px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Email
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

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#5F5E5A', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                Password
              </label>
              <Link href="/forgot-password" style={{ fontSize: '12px', color: '#1D9E75', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#9FE1CB' : '#085041',
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
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E8E6DF' }} />
          <span style={{ fontSize: '12px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#E8E6DF' }} />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          style={{
            width: '100%',
            background: '#fff',
            border: '1px solid #D3D1C7',
            borderRadius: '10px',
            padding: '11px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            color: '#085041',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'border-color 0.15s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        {/* Footer links */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#888780', marginTop: '24px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#1D9E75', fontWeight: '500', textDecoration: 'none' }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
