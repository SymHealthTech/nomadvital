'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CheckoutButton({ billing = 'monthly', className, style, children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    // If not logged in, send to signup first
    if (status === 'unauthenticated') {
      router.push('/signup?redirect=pricing')
      return
    }

    // Already Pro
    if (session?.user?.plan === 'pro') {
      router.push('/dashboard')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billing }),
      })
      const data = await res.json()

      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || 'Could not start checkout. Please try again.')
        setLoading(false)
        return
      }

      window.location.href = data.checkoutUrl
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
        className={className}
        style={style}
      >
        {loading ? 'Redirecting...' : (children ?? 'Start 7-day free trial')}
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
