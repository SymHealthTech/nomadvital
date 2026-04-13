'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import { getPersonaById } from '@/lib/travelerPersonas'

const FREE_LIMIT = 3

function renderChatMarkdown(text) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  let listItems = []
  let key = 0

  function flushList() {
    if (!listItems.length) return
    elements.push(
      <ul key={`ul-${key++}`} style={{ listStyle: 'none', padding: 0, margin: '6px 0 8px' }}>
        {listItems.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px', alignItems: 'flex-start' }}>
            <span style={{ color: '#1D9E75', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>•</span>
            <span style={{ lineHeight: '1.6' }}>{item}</span>
          </li>
        ))}
      </ul>
    )
    listItems = []
  }

  function renderInline(str) {
    const parts = str.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ fontWeight: '700', color: '#085041' }}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  for (const line of lines) {
    if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
      flushList()
      const level = line.startsWith('### ') ? 3 : line.startsWith('## ') ? 2 : 1
      const content = line.slice(level + 1)
      elements.push(
        <p key={key++} style={{ fontWeight: '700', color: '#085041', margin: '10px 0 4px', fontSize: level === 3 ? '13px' : '14px' }}>
          {renderInline(content)}
        </p>
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(renderInline(line.slice(2)))
    } else if (line.trim() === '') {
      flushList()
    } else {
      flushList()
      elements.push(
        <p key={key++} style={{ margin: '0 0 6px', lineHeight: '1.65' }}>
          {renderInline(line)}
        </p>
      )
    }
  }
  flushList()
  return elements
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '4px 2px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%', background: '#1D9E75',
          animation: 'dotBounce 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
      <style>{`@keyframes dotBounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-6px);opacity:1} }`}</style>
    </div>
  )
}

function DailyLimitBanner() {
  return (
    <div style={{
      background: '#fff', border: '1.5px solid #1D9E75', borderRadius: '14px',
      padding: '24px 20px', textAlign: 'center', margin: '16px',
      boxShadow: '0 4px 20px rgba(29,158,117,0.1)',
    }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '17px', fontWeight: '700', color: '#085041', marginBottom: '8px' }}>
        You&apos;ve used your {FREE_LIMIT} free questions today
      </h3>
      <p style={{ fontSize: '13px', color: '#5F5E5A', lineHeight: '1.6', marginBottom: '18px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
        Pro subscribers get unlimited AI questions and all 50+ destination guides.
      </p>
      <Link href="/pricing" style={{ display: 'inline-block', background: '#1D9E75', color: '#fff', fontWeight: '700', fontSize: '14px', padding: '11px 24px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
        Upgrade to Pro — from $8.25/mo
      </Link>
      <p style={{ fontSize: '11px', color: '#888780', marginTop: '10px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
        Or wait until tomorrow for {FREE_LIMIT} more free questions
      </p>
    </div>
  )
}

function MicButton({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false)
  const recogRef = useRef(null)

  function toggle() {
    if (listening) { recogRef.current?.stop(); setListening(false); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Voice input not supported. Try Chrome or Safari.'); return }
    const r = new SR()
    r.continuous = false; r.interimResults = false; r.lang = 'en-US'
    r.onresult = (e) => { onTranscript(e.results[0][0].transcript); setListening(false) }
    r.onerror = () => setListening(false)
    r.onend = () => setListening(false)
    recogRef.current = r; r.start(); setListening(true)
  }

  return (
    <button type="button" onClick={toggle} disabled={disabled} title={listening ? 'Stop' : 'Voice input'}
      style={{ background: listening ? '#FEF2F2' : '#F1EFE8', border: `1.5px solid ${listening ? '#FECACA' : '#D3D1C7'}`, borderRadius: '12px', padding: '0 12px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'not-allowed' : 'pointer', flexShrink: 0 }}>
      {listening ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#EF4444"><animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite"/></circle></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={disabled ? '#C0BDBA' : '#085041'} strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      )}
    </button>
  )
}

export default function AskPage() {
  const { data: session, status } = useSession()
  const isPro = session?.user?.plan === 'pro'
  const isGuest = session?.user?.isGuest

  const [personaId, setPersonaId] = useState('general')
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [questionsUsed, setQuestionsUsed] = useState(null)
  const [paywallActive, setPaywallActive] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const deviceIdRef = useRef(null)

  // Generate / retrieve a persistent device ID (survives PWA close/reopen)
  useEffect(() => {
    try {
      let id = localStorage.getItem('nvDeviceId')
      if (!id) {
        id = crypto.randomUUID()
        localStorage.setItem('nvDeviceId', id)
      }
      deviceIdRef.current = id
    } catch {
      // localStorage blocked (private mode edge case) — use a session fallback
      if (!deviceIdRef.current) {
        deviceIdRef.current = Math.random().toString(36).slice(2)
      }
    }
  }, [])

  // Auto guest session for unauthenticated visitors
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('credentials', { type: 'guest', redirect: false })
    }
  }, [status])

  // Fetch saved traveler type for logged-in non-guest users
  useEffect(() => {
    if (status === 'authenticated' && !isGuest) {
      fetch('/api/user/profile')
        .then(r => r.json())
        .then(d => { if (d.travelerType) setPersonaId(d.travelerType) })
        .catch(() => {})
    }
  }, [status, isGuest])

  const persona = getPersonaById(personaId)
  const questionsRemaining = questionsUsed !== null ? Math.max(0, FREE_LIMIT - questionsUsed) : null

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || loading || paywallActive) return

    setMessages(prev => [...prev, { role: 'user', text: trimmed }])
    setInputValue('')
    setLoading(true)
    setError('')

    try {
      const history = messages.slice(-10)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, personaId, history, deviceId: deviceIdRef.current }),
      })
      const data = await res.json()

      if (res.status === 429 && data.error === 'daily_limit_reached') {
        setQuestionsUsed(data.questionsUsed)
        setPaywallActive(true)
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
        if (data.questionsRemaining === 0) setPaywallActive(true)
      }
    } catch {
      setError('Network error. Please check your connection.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1EFE8' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1D9E75', animation: 'bounce 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
        <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-6px);opacity:1} }`}</style>
      </div>
    )
  }

  return (
    <div className="ask-outer" style={{ background: '#F1EFE8', overflowX: 'hidden' }}>

      {/* Header — hidden on mobile */}
      <div className="hidden md:block" style={{ background: '#085041', padding: '28px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
          AI Health Advisor
        </h1>
        <p style={{ color: '#9FE1CB', fontSize: '14px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Ask anything about food safety, nutrition &amp; health while traveling.
        </p>

        {/* Persona badge — only for logged-in non-guest users */}
        {!isGuest && persona.id !== 'general' && (
          <div style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '4px 12px' }}>
            <span style={{ fontSize: '14px' }}>{persona.emoji}</span>
            <span style={{ fontSize: '11px', color: '#E1F5EE', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>{persona.name}</span>
            <Link href="/dashboard" style={{ fontSize: '10px', color: '#5DCAA5', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)', marginLeft: '2px' }}>change</Link>
          </div>
        )}
      </div>

      {/* Chat container — full-width on mobile, centred on desktop */}
      <div className="ask-container md:max-w-[760px] md:mx-auto md:py-5 md:px-4">
        <div className="ask-card md:rounded-2xl md:border md:border-[#D3D1C7] md:shadow-lg" style={{ background: '#fff', overflow: 'hidden' }}>

          {/* Chat header bar */}
          <div className="ask-chat-header" style={{ background: '#085041', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Logo icon — hidden on mobile (navbar already shows NomadVital branding) */}
            <div className="hidden md:flex" style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
                <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
                <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                <span className="md:hidden">AI Advisor</span>
                <span className="hidden md:inline">NomadVital AI</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#5DCAA5' }} />
                <span style={{ fontSize: '10px', color: '#9FE1CB', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>Online · Powered by Claude</span>
              </div>
            </div>
            {/* Mobile: traveler category + change link */}
            <div className="md:hidden" style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <div style={{ fontSize: '11px', color: '#E1F5EE', fontFamily: 'var(--font-inter, Inter, sans-serif)', whiteSpace: 'nowrap', lineHeight: '1.1' }}>
                {persona.emoji} {persona.name}
              </div>
              <Link href="/dashboard" style={{ fontSize: '10px', color: '#5DCAA5', fontFamily: 'var(--font-inter, Inter, sans-serif)', textDecoration: 'none', lineHeight: '1.1' }}>
                Change
              </Link>
            </div>
            {/* Desktop: questions remaining */}
            {!isPro && questionsUsed !== null && !paywallActive && (
              <div className="hidden md:block" style={{ fontSize: '11px', color: '#9FE1CB', fontFamily: 'var(--font-inter, Inter, sans-serif)', textAlign: 'right' }}>
                <span style={{ color: questionsRemaining <= 1 ? '#FCA5A5' : '#5DCAA5', fontWeight: '600' }}>{questionsRemaining}</span> left today
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="ask-messages" style={{ overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#FAFAF8' }}>

            {messages.length === 0 && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '280px', textAlign: 'center', padding: '20px' }}>
                <div style={{ width: '48px', height: '48px', background: '#E1F5EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7.5" stroke="#1D9E75" strokeWidth="1.2"/>
                    <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#1D9E75" opacity="0.7"/>
                    <circle cx="9" cy="9" r="2" fill="#085041"/>
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '17px', fontWeight: '600', color: '#085041', marginBottom: '6px' }}>
                  Hello{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
                </h3>
                <p style={{ fontSize: '13px', color: '#5F5E5A', lineHeight: '1.65', maxWidth: '320px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  Ask me anything about food safety, nutrition, or staying healthy while traveling.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#1D9E75', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
                      <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
                      <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
                    </svg>
                  </div>
                )}
                <div style={{
                  maxWidth: '78%', background: msg.role === 'user' ? '#085041' : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#085041',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '10px 14px', fontSize: '14px', lineHeight: '1.65',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)', boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                }}>
                  {msg.role === 'assistant' ? renderChatMarkdown(msg.text) : msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#1D9E75', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/><path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/><circle cx="9" cy="9" r="2" fill="#1D9E75"/></svg>
                </div>
                <div style={{ background: '#fff', borderRadius: '16px 16px 16px 4px', padding: '8px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {paywallActive && <DailyLimitBanner />}

          {error && (
            <div style={{ margin: '0 16px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#B91C1C', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              {error}
            </div>
          )}

          {/* Input bar */}
          <div style={{ borderTop: '1px solid #E8E6E0', padding: '12px 14px', background: '#fff' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', minWidth: 0 }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={paywallActive ? 'Upgrade to Pro to continue...' : 'Ask about food safety, nutrition, health…'}
                disabled={loading || paywallActive}
                style={{
                  flex: 1, minWidth: 0,
                  border: `1.5px solid ${inputValue && !paywallActive ? '#1D9E75' : '#D3D1C7'}`,
                  borderRadius: '12px', padding: '11px 14px', fontSize: '14px',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)', color: '#085041',
                  background: paywallActive ? '#F9F8F5' : '#fff', outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
              />
              <MicButton disabled={loading || paywallActive} onTranscript={(t) => { setInputValue(prev => prev ? `${prev} ${t}` : t); inputRef.current?.focus() }} />
              <button
                type="submit"
                disabled={loading || !inputValue.trim() || paywallActive}
                style={{
                  background: !inputValue.trim() || paywallActive ? '#D3D1C7' : '#1D9E75',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  padding: '11px 18px', fontSize: '14px', fontWeight: '600', flexShrink: 0,
                  cursor: !inputValue.trim() || loading || paywallActive ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)', whiteSpace: 'nowrap',
                  transition: 'background 0.15s ease',
                }}
              >
                {loading ? '…' : 'Ask →'}
              </button>
            </form>
            <p style={{ fontSize: '11px', color: '#aaa', marginTop: '7px', marginBottom: 0, fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              General wellness info only — not medical advice.
            </p>
          </div>
        </div>
      </div>
      <style>{`
        .ask-outer { display: flex; flex-direction: column; height: 100dvh; overflow: hidden; }
        .ask-container { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .ask-card { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .ask-messages { flex: 1; min-height: 0; }
        @media (min-width: 768px) {
          .ask-outer { height: auto; display: block; overflow: visible; }
          .ask-container { flex: none; display: block; overflow: visible; }
          .ask-card { flex: none; display: block; overflow: hidden; }
          .ask-messages { flex: none; min-height: 300px; max-height: calc(100dvh - 340px); }
        }
      `}</style>
    </div>
  )
}
