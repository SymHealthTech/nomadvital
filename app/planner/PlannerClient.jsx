'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

function renderPlanMarkdown(text) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  let listItems = []
  let key = 0

  function flushList() {
    if (!listItems.length) return
    elements.push(
      <ul key={`ul-${key++}`} style={{ listStyle: 'none', padding: 0, margin: '6px 0 10px' }}>
        {listItems.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px', alignItems: 'flex-start' }}>
            <span style={{ color: '#1D9E75', fontWeight: '700', flexShrink: 0, marginTop: '2px' }}>•</span>
            <span style={{ lineHeight: '1.7', fontSize: '14px', color: '#444441', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>{item}</span>
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
        <p key={key++} style={{
          fontWeight: '700', color: '#085041',
          margin: level === 1 ? '16px 0 6px' : '12px 0 4px',
          fontSize: level >= 3 ? '13px' : '15px',
          fontFamily: level === 1 ? 'var(--font-playfair, Georgia, serif)' : 'var(--font-inter, Inter, sans-serif)',
        }}>
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
        <p key={key++} style={{ margin: '0 0 8px', lineHeight: '1.8', fontSize: '14px', color: '#444441', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          {renderInline(line)}
        </p>
      )
    }
  }
  flushList()
  return elements
}

const DESTINATIONS = [
  // Asia
  'Japan', 'Thailand', 'Vietnam', 'Cambodia', 'Laos',
  'Singapore', 'Malaysia', 'Indonesia / Bali',
  'Philippines', 'Myanmar / Burma', 'Sri Lanka',
  'India', 'Nepal', 'Bhutan', 'Bangladesh',
  'China', 'Hong Kong', 'South Korea', 'Taiwan',
  // Middle East & Central Asia
  'Turkey', 'UAE / Dubai', 'Jordan', 'Israel',
  'Georgia', 'Armenia', 'Uzbekistan',
  // Europe
  'Italy', 'Spain', 'France', 'Germany', 'UK',
  'Portugal', 'Greece', 'Croatia', 'Czech Republic',
  'Netherlands', 'Switzerland', 'Austria', 'Poland',
  'Hungary', 'Romania', 'Bulgaria', 'Serbia',
  'Iceland', 'Norway', 'Sweden', 'Finland', 'Denmark',
  // Americas
  'USA', 'Canada', 'Mexico', 'Guatemala', 'Costa Rica',
  'Colombia', 'Peru', 'Brazil', 'Argentina', 'Chile',
  'Ecuador', 'Bolivia', 'Cuba',
  // Africa & Indian Ocean
  'Morocco', 'Egypt', 'Kenya / Tanzania', 'South Africa',
  'Ethiopia', 'Ghana', 'Nigeria',
  'Mauritius', 'Maldives', 'Seychelles',
  // Oceania
  'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea',
]

const CONDITIONS = [
  'Type 2 diabetes', 'Type 1 diabetes', 'Gluten-free / Celiac',
  'Nut allergy (peanuts)', 'Tree nut allergy', 'Shellfish allergy',
  'Lactose intolerance', 'Vegetarian', 'Vegan',
  'Low-carb / Keto', 'High blood pressure', 'High cholesterol',
  'IBS / sensitive gut', 'Crohn\'s disease / IBD',
  'Kidney disease (low potassium)', 'GERD / acid reflux',
  'Soy allergy', 'Egg allergy', 'Sesame allergy',
  'No specific condition',
  'Other (specify)',
]

const TRIP_TYPES = [
  { value: 'holiday', label: 'Holiday / Tourism' },
  { value: 'business', label: 'Business trip' },
  { value: 'marathon', label: 'Marathon / Race' },
  { value: 'trekking', label: 'Trekking / Hiking' },
  { value: 'wellness', label: 'Wellness / Yoga retreat' },
  { value: 'ironman', label: 'Ironman / Triathlon' },
]

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '14px 16px' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%', background: '#1D9E75',
          animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
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

export default function PlannerClient() {
  const { data: session, status } = useSession()
  const isPro = session?.user?.plan === 'pro'

  const [destination, setDestination] = useState('')
  const [condition, setCondition] = useState('')
  const [customCondition, setCustomCondition] = useState('')
  const [tripType, setTripType] = useState('holiday')
  const [days, setDays] = useState('3')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState('')

  const isCustomCondition = condition === 'Other (specify)'
  const effectiveCondition = isCustomCondition ? customCondition.trim() : condition

  const selectStyle = {
    width: '100%', padding: '10px 14px', fontSize: '14px',
    border: '1px solid #D3D1C7', borderRadius: '10px',
    color: '#085041', background: '#fff', outline: 'none',
    fontFamily: 'var(--font-inter, Inter, sans-serif)',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888780' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C%2Fsvg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
    paddingRight: '36px',
  }

  async function handleGenerate(e) {
    e.preventDefault()
    if (!destination || !condition) {
      setError('Please select a destination and health condition.')
      return
    }
    if (isCustomCondition && !customCondition.trim()) {
      setError('Please describe your health condition or dietary need.')
      return
    }
    setError('')
    setLoading(true)
    setPlan(null)

    const prompt = `Create a ${days}-day travel meal plan for someone visiting ${destination} on a ${tripType} trip. Their dietary condition is: ${effectiveCondition}.

For each day provide:
- Breakfast: specific local food options that are safe for their condition
- Lunch: safe local restaurant dishes
- Dinner: recommended meal with any precautions
- Snacks: 1-2 safe snack options

Keep each meal description to 1-2 sentences. Be specific about local dishes available in ${destination}. Flag any hidden risks for their specific condition. End with 3 key food safety tips for ${destination} relevant to their condition.`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, personaId: 'general' }),
      })
      const data = await res.json()
      if (res.status === 429) {
        setError('Daily question limit reached. Upgrade to Pro for unlimited access.')
      } else if (!res.ok) {
        setError(data.message || 'Failed to generate plan. Please try again.')
      } else {
        setPlan({ text: data.reply, destination, condition: effectiveCondition, tripType, days })
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Not logged in
  if (status === 'unauthenticated') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', maxWidth: '420px', margin: '0 auto' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🗺️</div>
        <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '22px', fontWeight: '600', color: '#085041', marginBottom: '10px' }}>
          Sign in to use the planner
        </h2>
        <p style={{ fontSize: '14px', color: '#5F5E5A', marginBottom: '24px', lineHeight: '1.6', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          The diet travel planner generates a personalised day-by-day meal plan using AI — sign in to get started for free.
        </p>
        <Link href="/login" style={{ display: 'inline-block', background: '#1D9E75', color: '#fff', fontWeight: '700', fontSize: '14px', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', marginBottom: '12px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Sign in
        </Link>
        <p style={{ fontSize: '13px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          No account?{' '}
          <Link href="/signup" style={{ color: '#1D9E75', textDecoration: 'none', fontWeight: '500' }}>Create one free →</Link>
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Pro notice for free users */}
      {!isPro && session && (
        <div style={{
          background: '#FFF3E0', border: '1px solid #FCD34D', borderRadius: '10px',
          padding: '12px 16px', marginBottom: '24px',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}>
          <svg width="16" height="16" fill="none" stroke="#B45309" strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p style={{ fontSize: '13px', color: '#92400E', margin: 0, lineHeight: '1.5', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Free plan: uses 1 of your 3 daily AI questions per plan.{' '}
            <Link href="/pricing" style={{ color: '#B45309', fontWeight: '600', textDecoration: 'underline' }}>Upgrade to Pro</Link>
            {' '}for unlimited plans.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleGenerate} style={{
        background: '#fff', border: '1px solid #D3D1C7', borderRadius: '14px', padding: '28px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5F5E5A', marginBottom: '5px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Destination
            </label>
            <select value={destination} onChange={e => setDestination(e.target.value)} style={selectStyle} required>
              <option value="">Select destination</option>
              {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5F5E5A', marginBottom: '5px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Health condition / diet
            </label>
            <select value={condition} onChange={e => { setCondition(e.target.value); setCustomCondition('') }} style={selectStyle} required>
              <option value="">Select condition</option>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Custom condition input — shown when "Other" is selected */}
          {isCustomCondition && (
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5F5E5A', marginBottom: '5px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                Describe your condition or dietary need
              </label>
              <input
                type="text"
                value={customCondition}
                onChange={e => setCustomCondition(e.target.value)}
                placeholder="e.g. Fructose malabsorption, low histamine diet, FODMAP…"
                required={isCustomCondition}
                style={{
                  width: '100%', padding: '10px 14px', fontSize: '14px',
                  border: '1px solid #D3D1C7', borderRadius: '10px',
                  color: '#085041', background: '#fff', outline: 'none',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5F5E5A', marginBottom: '5px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Trip type
            </label>
            <select value={tripType} onChange={e => setTripType(e.target.value)} style={selectStyle}>
              {TRIP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5F5E5A', marginBottom: '5px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Number of days
            </label>
            <select value={days} onChange={e => setDays(e.target.value)} style={selectStyle}>
              {['1','2','3','5','7'].map(d => <option key={d} value={d}>{d} {d === '1' ? 'day' : 'days'}</option>)}
            </select>
          </div>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#B91C1C', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', background: loading ? '#9FE1CB' : '#1D9E75', color: '#fff',
            border: 'none', borderRadius: '10px', padding: '12px',
            fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-inter, Inter, sans-serif)', transition: 'background 0.15s',
          }}
        >
          {loading ? 'Generating your plan...' : '✦ Generate meal plan'}
        </button>
        <p style={{ fontSize: '11px', color: '#888780', textAlign: 'center', marginTop: '8px', marginBottom: 0, fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          AI-generated plan based on your destination &amp; condition. Not medical advice.
        </p>
      </form>

      {/* Loading state */}
      {loading && (
        <div style={{ background: '#fff', border: '1px solid #D3D1C7', borderRadius: '14px', marginBottom: '24px' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1EFE8', fontSize: '13px', fontWeight: '500', color: '#085041', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Building your {days}-day {destination} meal plan…
          </div>
          <TypingDots />
        </div>
      )}

      {/* Result */}
      {plan && !loading && (
        <div style={{ background: '#fff', border: '1px solid #D3D1C7', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ background: '#085041', padding: '16px 20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#5DCAA5', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Your personalised plan
            </div>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '18px', fontWeight: '600', color: '#fff', margin: 0 }}>
              {plan.days}-Day {plan.destination} Meal Plan
            </h2>
            <p style={{ fontSize: '12px', color: '#9FE1CB', margin: '4px 0 0', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              For: {plan.condition} · {TRIP_TYPES.find(t => t.value === plan.tripType)?.label}
            </p>
          </div>

          <div style={{ padding: '20px' }}>
            {renderPlanMarkdown(plan.text)}
          </div>

          <div style={{ background: '#F1EFE8', padding: '12px 20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <svg width="13" height="13" fill="none" stroke="#888780" strokeWidth="1.5" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '2px' }}>
              <circle cx="12" cy="12" r="10"/>
              <path strokeLinecap="round" d="M12 8v4M12 16h.01"/>
            </svg>
            <p style={{ fontSize: '11px', color: '#888780', margin: 0, lineHeight: '1.5', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              General wellness information only — not medical advice. Always consult a qualified healthcare professional before making dietary changes related to your medical condition.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
