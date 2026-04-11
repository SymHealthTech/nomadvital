'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PaymentSuccessRefresh() {
  const searchParams = useSearchParams()
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (searchParams.get('payment') !== 'success') return

    async function syncAndReload() {
      setSyncing(true)

      // Retry up to 5 times — Dodo may take a moment to mark the subscription active
      for (let attempt = 0; attempt < 5; attempt++) {
        if (attempt > 0) await new Promise(r => setTimeout(r, attempt * 1500))

        try {
          const res = await fetch('/api/dodo/sync-plan', { method: 'POST' })
          const data = await res.json()

          if (data.plan === 'pro') {
            // DB is now pro. Hard reload — the session callback always reads
            // fresh from DB so the page will render with pro immediately.
            window.location.href = '/dashboard'
            return
          }
        } catch { /* retry */ }
      }

      // Retries exhausted — reload anyway; user can refresh if needed
      window.location.href = '/dashboard'
    }

    syncAndReload()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!syncing) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(8,80,65,0.88)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '36px 32px',
        textAlign: 'center', maxWidth: '340px', width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          width: '48px', height: '48px',
          border: '3px solid #E1F5EE', borderTop: '3px solid #1D9E75',
          borderRadius: '50%', margin: '0 auto 16px',
          animation: 'spin 0.9s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <h3 style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize: '18px', fontWeight: '700', color: '#085041', marginBottom: '8px',
        }}>
          Activating your Pro plan…
        </h3>
        <p style={{
          fontSize: '13px', color: '#5F5E5A', lineHeight: '1.6', margin: 0,
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}>
          Confirming your payment with Dodo. This takes just a moment.
        </p>
      </div>
    </div>
  )
}
