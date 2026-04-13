'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'

export default function SignOutButton() {
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px',
        background: 'none',
        border: '1.5px solid #D3D1C7',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        color: loading ? '#888780' : '#5F5E5A',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
        transition: 'border-color 0.15s, color 0.15s',
      }}
      onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444' } }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#D3D1C7'; e.currentTarget.style.color = '#5F5E5A' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
