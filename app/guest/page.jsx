'use client'

import { Suspense, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F1EFE8', fontFamily: 'var(--font-inter, Inter, sans-serif)', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
          <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
          <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
        </svg>
      </div>
      <p style={{ color: '#085041', fontSize: '15px', fontWeight: '500' }}>Getting you started…</p>
      <div style={{ display: 'flex', gap: '5px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '7px', height: '7px', borderRadius: '50%', background: '#1D9E75',
            animation: 'bounce 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-6px);opacity:1} }`}</style>
    </div>
  )
}

function GuestFlow() {
  const { status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl)
      return
    }
    if (status === 'unauthenticated') {
      signIn('credentials', { type: 'guest', redirect: false })
        .then((result) => {
          if (result?.ok) {
            router.replace(callbackUrl)
          } else {
            setError(true)
          }
        })
        .catch(() => setError(true))
    }
  }, [status, router, callbackUrl])

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F1EFE8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
        <p style={{ color: '#B91C1C', fontSize: '14px', marginBottom: '12px' }}>Something went wrong. Please try again.</p>
        <a href="/" style={{ color: '#1D9E75', fontSize: '13px' }}>← Go home</a>
      </div>
    )
  }

  return <LoadingScreen />
}

export default function GuestPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <GuestFlow />
    </Suspense>
  )
}
