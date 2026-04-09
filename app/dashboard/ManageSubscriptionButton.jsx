'use client'

import { useState } from 'react'

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/dodo/portal', { method: 'POST' })
      const data = await res.json()

      if (!res.ok || !data.portalUrl) {
        setError(data.error || 'Could not open portal. Please try again.')
        setLoading(false)
        return
      }

      window.location.href = data.portalUrl
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          width: '100%',
          textAlign: 'center',
          background: 'none',
          border: '1px solid #085041',
          color: '#085041',
          fontSize: '14px',
          fontWeight: '600',
          padding: '10px',
          borderRadius: '12px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
          transition: 'background 0.15s, color 0.15s',
          opacity: loading ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#085041'; e.currentTarget.style.color = '#fff' } }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#085041' }}
      >
        {loading ? 'Opening portal...' : 'Manage subscription'}
      </button>
      {error && (
        <p style={{
          fontSize: '12px',
          color: '#B91C1C',
          textAlign: 'center',
          marginTop: '6px',
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}>
          {error}
        </p>
      )}
    </div>
  )
}
