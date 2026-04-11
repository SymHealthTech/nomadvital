'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import { travelerPersonas, getPersonaById } from '@/lib/travelerPersonas'

const FREE_LIMIT = 3

// Simple markdown → JSX renderer for AI chat responses
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
        <div
          key={i}
          style={{
            width: '7px', height: '7px', borderRadius: '50%', background: '#1D9E75',
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

function DailyLimitBanner() {
  return (
    <div style={{
      background: '#fff', border: '1.5px solid #1D9E75', borderRadius: '14px',
      padding: '24px 20px', textAlign: 'center', margin: '16px',
      boxShadow: '0 4px 20px rgba(29,158,117,0.1)',
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%', background: '#E1F5EE',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '17px', fontWeight: '700', color: '#085041', marginBottom: '8px' }}>
        You&apos;ve used your {FREE_LIMIT} free questions today
      </h3>
      <p style={{ fontSize: '13px', color: '#5F5E5A', lineHeight: '1.6', marginBottom: '18px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
        Pro subscribers get unlimited AI questions, all 50+ destination guides, and personalised meal planning.
      </p>
      <Link href="/pricing" style={{
        display: 'inline-block', background: '#1D9E75', color: '#fff', fontWeight: '700',
        fontSize: '14px', padding: '11px 24px', borderRadius: '10px', textDecoration: 'none',
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
      }}>
        Upgrade to Pro — from $8.25/mo
      </Link>
      <p style={{ fontSize: '11px', color: '#888780', marginTop: '10px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
        Or wait until tomorrow for {FREE_LIMIT} more free questions
      </p>
    </div>
  )
}

// Mic button using Web Speech API
function MicButton({ onTranscript, disabled, className }) {
  const [listening, setListening] = useState(false)
  const recogRef = useRef(null)

  function toggle() {
    if (listening) {
      recogRef.current?.stop()
      setListening(false)
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      alert('Voice input is not supported in this browser. Try Chrome or Safari.')
      return
    }
    const r = new SR()
    r.continuous = false
    r.interimResults = false
    r.lang = 'en-US'
    r.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      onTranscript(transcript)
      setListening(false)
    }
    r.onerror = () => setListening(false)
    r.onend = () => setListening(false)
    recogRef.current = r
    r.start()
    setListening(true)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      title={listening ? 'Stop listening' : 'Ask by voice'}
      className={className}
      style={{
        background: listening ? '#FEF2F2' : '#F1EFE8',
        border: `1.5px solid ${listening ? '#FECACA' : '#D3D1C7'}`,
        borderRadius: '12px',
        padding: '0 12px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        flexShrink: 0,
        transition: 'all 0.15s ease',
      }}
    >
      {listening ? (
        /* Animated pulse when listening */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="#EF4444">
            <animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={disabled ? '#C0BDBA' : '#085041'} strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      )}
    </button>
  )
}

export default function AskPage() {
  const { data: session, status } = useSession()
  const isPro = session?.user?.plan === 'pro'

  const [selectedPersonaId, setSelectedPersonaId] = useState('general')
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [questionsUsed, setQuestionsUsed] = useState(null)
  const [paywallActive, setPaywallActive] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-create a guest session so unauthenticated visitors can use the AI immediately
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('credentials', { type: 'guest', redirect: false })
    }
  }, [status])

  const selectedPersona = getPersonaById(selectedPersonaId)
  const questionsRemaining = questionsUsed !== null ? Math.max(0, FREE_LIMIT - questionsUsed) : null

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function selectPersona(id) {
    setSelectedPersonaId(id)
    setPaywallActive(false)
  }

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
      // Send last 10 messages (5 turns) as history so AI remembers context
      const history = messages.slice(-10)

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, personaId: selectedPersonaId, history }),
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
      setError('Network error. Please check your connection and try again.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  // Show a brief spinner while the guest session is being created
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1EFE8' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '8px', height: '8px', borderRadius: '50%', background: '#1D9E75',
              animation: 'bounce 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
        <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-6px);opacity:1} }`}</style>
      </div>
    )
  }

  return (
    <div style={{ background: '#F1EFE8', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Page hero header ── */}
      <div style={{ background: '#085041', padding: '44px 24px 40px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', background: 'rgba(255,255,255,0.12)', color: '#5DCAA5',
          fontSize: '11px', fontWeight: '600', letterSpacing: '2.5px', textTransform: 'uppercase',
          padding: '4px 14px', borderRadius: '20px', marginBottom: '14px',
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}>
          AI-Powered · Personalised · Real-time
        </div>
        <h1 style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize: 'clamp(1.7rem, 3.5vw, 2.3rem)', fontWeight: '700',
          color: '#fff', letterSpacing: '0.01em', marginBottom: '10px',
        }}>
          AI Health Advisor
        </h1>
        <p style={{ color: '#9FE1CB', fontSize: '15px', maxWidth: '520px', margin: '0 auto', lineHeight: '1.65', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Ask anything about food safety, nutrition, and health while traveling. Answers tailored to your traveler type.
        </p>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 16px 56px' }}>
        <style>{`
          .ask-layout { display: flex; gap: 20px; align-items: flex-start; }
          .ask-sidebar { width: 280px; flex-shrink: 0; }
          .ask-main { flex: 1; min-width: 0; }
          @media (max-width: 820px) {
            .ask-layout { flex-direction: column; }
            .ask-sidebar { width: 100%; }
          }
          @media (max-width: 480px) {
            .ask-send-label { display: none; }
            .ask-send-btn { padding: 11px 14px !important; }
            .ask-mic-btn { padding: 0 10px !important; }
            .ask-input { font-size: 13px !important; padding: 10px 10px !important; }
            .ask-sample-q { max-width: 100%; word-break: break-word; white-space: normal !important; text-align: center; }
          }
        `}</style>

        <div className="ask-layout">

          {/* ── LEFT SIDEBAR: Persona selector ── */}
          <div className="ask-sidebar">
            <div style={{
              background: '#fff', borderRadius: '16px', border: '1px solid #D3D1C7',
              overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <div style={{ background: '#085041', padding: '14px 16px' }}>
                <p style={{ fontSize: '10px', fontWeight: '700', color: '#5DCAA5', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 2px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  Traveler profile
                </p>
                <p style={{ fontSize: '13px', color: '#fff', margin: 0, fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  I am traveling as a...
                </p>
              </div>

              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {travelerPersonas.map((persona) => {
                  const isSelected = selectedPersonaId === persona.id
                  return (
                    <button
                      key={persona.id}
                      onClick={() => selectPersona(persona.id)}
                      style={{
                        background: isSelected ? persona.lightColor : '#F9F8F5',
                        border: isSelected ? `1.5px solid ${persona.color}` : '1px solid #E0DDD6',
                        borderRadius: '10px', padding: '10px 12px', cursor: 'pointer',
                        transition: 'all 0.15s ease', display: 'flex', alignItems: 'center',
                        gap: '10px', textAlign: 'left', width: '100%',
                      }}
                    >
                      <span style={{ fontSize: '22px', lineHeight: 1, flexShrink: 0 }}>{persona.emoji}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: isSelected ? '#085041' : '#5F5E5A', fontFamily: 'var(--font-inter, Inter, sans-serif)', lineHeight: '1.3' }}>
                          {persona.name}
                        </div>
                        <div style={{ fontSize: '11px', color: isSelected ? persona.color : '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)', lineHeight: '1.2', marginTop: '1px' }}>
                          {persona.tagline}
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke={persona.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              <div style={{ padding: '12px 14px', borderTop: '1px solid #F1EFE8', background: '#F9F8F5' }}>
                <p style={{ fontSize: '11px', color: '#888780', margin: 0, lineHeight: '1.5', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  Your profile shapes the AI&apos;s advice — select whichever fits your trip best.
                </p>
              </div>
            </div>

            {/* Free questions remaining */}
            {!isPro && questionsUsed !== null && !paywallActive && (
              <div style={{
                background: '#fff', border: '1px solid #E0DDD6', borderRadius: '12px',
                padding: '12px 14px', marginTop: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                  <span style={{ fontSize: '11px', color: '#5F5E5A', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                    {questionsUsed} of {FREE_LIMIT} free questions used
                  </span>
                  <Link href="/pricing" style={{ fontSize: '11px', color: '#1D9E75', fontWeight: '600', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                    Upgrade →
                  </Link>
                </div>
                <div style={{ height: '5px', background: '#E0DDD6', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${(questionsUsed / FREE_LIMIT) * 100}%`,
                    background: questionsRemaining <= 1 ? '#F59E0B' : '#1D9E75',
                    borderRadius: '999px', transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT MAIN: Chat window ── */}
          <div className="ask-main">
            <div style={{
              background: '#fff', borderRadius: '16px', border: '1px solid #D3D1C7',
              overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>

              {/* Chat branded header bar */}
              <div style={{ background: '#085041', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
                    <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
                    <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                    NomadVital AI Advisor
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5DCAA5' }} />
                    <span style={{ fontSize: '11px', color: '#9FE1CB', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                      Online · Powered by Claude
                    </span>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.12)', borderRadius: '20px',
                  padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0,
                }}>
                  <span style={{ fontSize: '14px' }}>{selectedPersona.emoji}</span>
                  <span style={{ fontSize: '11px', color: '#E1F5EE', fontFamily: 'var(--font-inter, Inter, sans-serif)', fontWeight: '500' }}>
                    {selectedPersona.name.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Messages area */}
              <div style={{
                minHeight: '380px', maxHeight: '520px', overflowY: 'auto',
                padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '14px',
                background: '#FAFAF8',
              }}>

                {/* Empty state */}
                {messages.length === 0 && !loading && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '300px', textAlign: 'center', padding: '20px' }}>
                    <div style={{ width: '52px', height: '52px', background: '#E1F5EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="7.5" stroke="#1D9E75" strokeWidth="1.2"/>
                        <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#1D9E75" opacity="0.7"/>
                        <circle cx="9" cy="9" r="2" fill="#085041"/>
                      </svg>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '18px', fontWeight: '600', color: '#085041', marginBottom: '6px' }}>
                      Hello{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
                    </h3>
                    <p style={{ fontSize: '13px', color: '#5F5E5A', lineHeight: '1.65', marginBottom: '20px', maxWidth: '360px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                      Ask me anything about food safety, allergens, nutrition, or staying healthy as a{' '}
                      <strong style={{ color: '#085041' }}>{selectedPersona.name.toLowerCase()}</strong>.
                    </p>
                    <button
                      onClick={fillSampleQuestion}
                      className="ask-sample-q"
                      style={{
                        background: selectedPersona.lightColor,
                        border: `1px solid ${selectedPersona.color}40`,
                        borderRadius: '20px', padding: '8px 16px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                        maxWidth: '100%',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M13 5l7 7-7 7M5 12h15" stroke={selectedPersona.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize: '12px', color: selectedPersona.color, fontWeight: '500', fontFamily: 'var(--font-inter, Inter, sans-serif)', wordBreak: 'break-word', textAlign: 'left' }}>
                        {selectedPersona.sampleQuestion}
                      </span>
                    </button>
                  </div>
                )}

                {/* Conversation messages */}
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                    {msg.role === 'assistant' && (
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1D9E75', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                          <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
                          <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
                          <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
                        </svg>
                      </div>
                    )}
                    <div style={{
                      maxWidth: '78%',
                      background: msg.role === 'user' ? selectedPersona.color : '#fff',
                      color: msg.role === 'user' ? '#fff' : '#085041',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      padding: '10px 14px', fontSize: '14px', lineHeight: '1.65',
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                    }}>
                      {msg.role === 'assistant'
                        ? renderChatMarkdown(msg.text)
                        : msg.text
                      }
                    </div>
                  </div>
                ))}

                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1D9E75', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
                        <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
                        <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
                      </svg>
                    </div>
                    <div style={{ background: '#fff', borderRadius: '16px 16px 16px 4px', padding: '8px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                      <TypingDots />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Paywall inside chat area */}
              {paywallActive && <DailyLimitBanner />}

              {/* Error */}
              {error && (
                <div style={{ margin: '0 16px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#B91C1C', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  {error}
                </div>
              )}

              {/* Input bar */}
              <div style={{ borderTop: '1px solid #E8E6E0', padding: '14px 16px', background: '#fff' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', minWidth: 0 }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder={paywallActive ? 'Upgrade to continue...' : `Ask about ${selectedPersona.tagline.toLowerCase()}…`}
                    disabled={loading || paywallActive}
                    className="ask-input"
                    style={{
                      flex: 1, minWidth: 0,
                      border: `1.5px solid ${inputValue && !paywallActive ? selectedPersona.color : '#D3D1C7'}`,
                      borderRadius: '12px', padding: '11px 14px', fontSize: '14px',
                      fontFamily: 'var(--font-inter, Inter, sans-serif)', color: '#085041',
                      background: paywallActive ? '#F9F8F5' : '#fff', outline: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                  />
                  {/* Voice input button */}
                  <MicButton
                    className="ask-mic-btn"
                    disabled={loading || paywallActive}
                    onTranscript={(t) => {
                      setInputValue(prev => prev ? `${prev} ${t}` : t)
                      inputRef.current?.focus()
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading || !inputValue.trim() || paywallActive}
                    className="ask-send-btn"
                    style={{
                      background: !inputValue.trim() || paywallActive ? '#D3D1C7' : selectedPersona.color,
                      color: '#fff', border: 'none', borderRadius: '12px',
                      padding: '11px 20px', fontSize: '14px', fontWeight: '600',
                      cursor: !inputValue.trim() || loading || paywallActive ? 'not-allowed' : 'pointer',
                      transition: 'background 0.15s ease', flexShrink: 0,
                      fontFamily: 'var(--font-inter, Inter, sans-serif)', whiteSpace: 'nowrap',
                    }}
                  >
                    {loading ? '…' : <><span className="ask-send-label">Ask </span>→</>}
                  </button>
                </form>
                <p style={{ fontSize: '11px', color: '#888780', marginTop: '8px', marginBottom: 0, fontFamily: 'var(--font-inter, Inter, sans-serif)', lineHeight: '1.5', wordBreak: 'break-word' }}>
                  General wellness information only — not medical advice.
                </p>
              </div>
            </div>

            {messages.length > 0 && !paywallActive && (
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={fillSampleQuestion}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '12px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>Try: </span>
                  <span style={{ fontSize: '12px', color: selectedPersona.color, fontFamily: 'var(--font-inter, Inter, sans-serif)', textDecoration: 'underline', textDecorationStyle: 'dashed', textUnderlineOffset: '3px' }}>
                    {selectedPersona.sampleQuestion}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
