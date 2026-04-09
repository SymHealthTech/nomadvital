'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import TravelerTypeSelector from '@/components/public/TravelerTypeSelector'
import { getPersonaById } from '@/lib/travelerPersonas'

const FREE_LIMIT = 3

// Animated typing dots for the loading state
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '4px 2px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#1D9E75',
            animation: 'dotBounce 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Paywall banner shown when the daily limit is reached
function DailyLimitBanner() {
  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid #1D9E75',
      borderRadius: '16px',
      padding: '28px 24px',
      textAlign: 'center',
      margin: '16px 0',
      boxShadow: '0 4px 20px rgba(29,158,117,0.1)',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        background: '#E1F5EE', display: 'flex', alignItems: 'center',
        justifyContent: 'center', margin: '0 auto 14px',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 style={{
        fontFamily: 'var(--font-playfair, Georgia, serif)',
        fontSize: '18px', fontWeight: '700', color: '#085041', marginBottom: '8px',
      }}>
        You&apos;ve used your {FREE_LIMIT} free questions today
      </h3>
      <p style={{
        fontSize: '13px', color: '#5F5E5A', lineHeight: '1.6',
        marginBottom: '20px', maxWidth: '380px', margin: '0 auto 20px',
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
      }}>
        Pro subscribers get unlimited AI questions, access to all 50+ destination guides,
        and personalised meal planning.
      </p>
      <Link
        href="/pricing"
        style={{
          display: 'inline-block',
          background: '#1D9E75',
          color: '#fff',
          fontWeight: '700',
          fontSize: '14px',
          padding: '12px 28px',
          borderRadius: '10px',
          textDecoration: 'none',
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}
      >
        Upgrade to Pro — $12/month
      </Link>
      <p style={{
        fontSize: '12px', color: '#888780', marginTop: '12px',
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
      }}>
        Or wait until tomorrow for {FREE_LIMIT} more free questions
      </p>
    </div>
  )
}

export default function AskPage() {
  const { data: session } = useSession()
  const isPro = session?.user?.plan === 'pro'

  const [selectedPersonaId, setSelectedPersonaId] = useState('general')
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [questionsUsed, setQuestionsUsed] = useState(null) // null = unknown until first call
  const [paywallActive, setPaywallActive] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const selectedPersona = getPersonaById(selectedPersonaId)
  const questionsRemaining = questionsUsed !== null ? Math.max(0, FREE_LIMIT - questionsUsed) : null

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function fillSampleQuestion() {
    setInputValue(selectedPersona.sampleQuestion)
    inputRef.current?.focus()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || loading || paywallActive) return

    setMessages(prev => [...prev, { role: 'user', text: trimmed }])
    setInputValue('')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, personaId: selectedPersonaId }),
      })

      const data = await res.json()

      if (res.status === 429 && data.error === 'daily_limit_reached') {
        setQuestionsUsed(data.questionsUsed)
        setPaywallActive(true)
        // Remove the user message we added optimistically
        setMessages(prev => prev.slice(0, -1))
        return
      }

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setMessages(prev => prev.slice(0, -1))
        return
      }

      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])

      if (!isPro && data.questionsUsed !== undefined) {
        setQuestionsUsed(data.questionsUsed)
        if (data.questionsRemaining === 0) {
          setPaywallActive(true)
        }
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    flex: 1,
    border: `1.5px solid ${inputValue && !paywallActive ? selectedPersona.color : '#D3D1C7'}`,
    borderRadius: '12px',
    padding: '11px 14px',
    fontSize: '14px',
    fontFamily: 'var(--font-inter, Inter, sans-serif)',
    color: '#085041',
    background: paywallActive ? '#F9F8F5' : '#fff',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    resize: 'none',
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 16px 48px' }}>

      {/* Header */}
      <h1 style={{
        fontFamily: 'var(--font-playfair, Georgia, serif)',
        fontSize: '26px', fontWeight: '700', color: '#085041', marginBottom: '4px',
      }}>
        Ask NomadVital
      </h1>
      <p style={{ color: '#5F5E5A', fontSize: '14px', marginBottom: '24px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
        AI-powered health and nutrition guidance — built for your journey.
      </p>

      {/* Persona selector */}
      <TravelerTypeSelector
        selectedPersonaId={selectedPersonaId}
        onPersonaChange={id => { setSelectedPersonaId(id); setPaywallActive(false) }}
      />

      {/* Sample question prompt */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={fillSampleQuestion}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
        >
          <span style={{ fontSize: '12px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Try asking:{' '}
          </span>
          <span style={{
            fontSize: '12px',
            color: selectedPersona.color,
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            textDecoration: 'underline',
            textDecorationStyle: 'dashed',
            textUnderlineOffset: '3px',
          }}>
            {selectedPersona.sampleQuestion}
          </span>
        </button>
      </div>

      {/* Questions remaining bar — free users only, shown once we know the count */}
      {!isPro && questionsUsed !== null && !paywallActive && (
        <div style={{
          background: '#F9F8F5',
          border: '1px solid #E0DDD6',
          borderRadius: '10px',
          padding: '10px 14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          {/* Progress bar */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px',
            }}>
              <span style={{ fontSize: '12px', color: '#5F5E5A', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                {questionsUsed} of {FREE_LIMIT} free questions used today
              </span>
              <Link href="/pricing" style={{
                fontSize: '11px', color: '#1D9E75', fontWeight: '600',
                textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)',
                whiteSpace: 'nowrap',
              }}>
                Upgrade to Pro →
              </Link>
            </div>
            <div style={{ height: '5px', background: '#E0DDD6', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(questionsUsed / FREE_LIMIT) * 100}%`,
                background: questionsRemaining <= 1 ? '#F59E0B' : '#1D9E75',
                borderRadius: '999px',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Chat messages */}
      {messages.length > 0 && (
        <div style={{
          background: '#F9F8F5',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          maxHeight: '460px',
          overflowY: 'auto',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
              {/* AI avatar */}
              {msg.role === 'assistant' && (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#1D9E75', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
                    <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
                    <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
                  </svg>
                </div>
              )}

              <div style={{
                maxWidth: '82%',
                background: msg.role === 'user' ? selectedPersona.color : '#fff',
                color: msg.role === 'user' ? '#fff' : '#085041',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '10px 14px',
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                whiteSpace: 'pre-wrap',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: '#1D9E75', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
                  <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
                  <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
                </svg>
              </div>
              <div style={{
                background: '#fff', borderRadius: '16px 16px 16px 4px',
                padding: '8px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              }}>
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA',
          borderRadius: '10px', padding: '10px 14px', marginBottom: '12px',
          fontSize: '13px', color: '#B91C1C', fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}>
          {error}
        </div>
      )}

      {/* Daily limit paywall */}
      {paywallActive && <DailyLimitBanner />}

      {/* Input form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={paywallActive ? 'Upgrade to Pro to continue asking...' : `Ask about ${selectedPersona.tagline.toLowerCase()}...`}
          disabled={loading || paywallActive}
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim() || paywallActive}
          style={{
            background: !inputValue.trim() || paywallActive ? '#D3D1C7' : selectedPersona.color,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '11px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: !inputValue.trim() || loading || paywallActive ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s ease',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? '...' : 'Ask →'}
        </button>
      </form>

      <p style={{
        fontSize: '11px', color: '#888780', marginTop: '10px',
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
      }}>
        General wellness information only — not medical advice. Always consult your doctor before making dietary changes while traveling.
      </p>
    </div>
  )
}
