'use client'

import { useEffect, useState } from 'react'

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function TipSkeleton() {
  return (
    <div
      style={{
        background: '#E1F5EE',
        border: '0.5px solid #5DCAA5',
        borderRadius: 10,
        padding: '14px 16px',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#A8DFCb' }} />
        <div>
          <div style={{ height: 10, width: 80, background: '#A8DFCb', borderRadius: 4, marginBottom: 5 }} />
          <div style={{ height: 8, width: 60, background: '#A8DFCb', borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ height: 8, background: '#A8DFCb', borderRadius: 4, marginBottom: 6 }} />
      <div style={{ height: 8, background: '#A8DFCb', borderRadius: 4, width: '75%' }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

function TipCard({ tip }) {
  return (
    <div
      style={{
        background: '#E1F5EE',
        border: '0.5px solid #5DCAA5',
        borderRadius: 10,
        padding: '14px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: '#1D9E75',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {getInitials(tip.authorName)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 500, color: '#085041', fontSize: 13, lineHeight: 1.3 }}>
            {tip.authorName}
          </div>
          <div style={{ fontSize: 11, color: '#888780' }}>{tip.authorCity}</div>
        </div>
      </div>

      <div
        style={{
          display: 'inline-block',
          background: '#EAF3DE',
          color: '#27500A',
          fontSize: 10,
          fontWeight: 500,
          padding: '2px 8px',
          borderRadius: 20,
          marginBottom: 8,
        }}
      >
        {tip.healthCondition}
      </div>

      <p style={{ fontSize: 13, color: '#444441', lineHeight: 1.65, margin: 0 }}>{tip.tipText}</p>

      <div style={{ textAlign: 'right', marginTop: 8 }}>
        <span style={{ fontSize: 10, color: '#5DCAA5', fontWeight: 500 }}>Verified experience</span>
      </div>
    </div>
  )
}

export default function TravelerTipsSection({ destination }) {
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetch(`/api/tips/${destination}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTips(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [destination])

  if (loading) {
    return (
      <div style={{ marginBottom: 32 }}>
        <SectionHeading />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 12,
          }}
        >
          <TipSkeleton />
          <TipSkeleton />
        </div>
      </div>
    )
  }

  if (tips.length === 0) return null

  const visible = showAll ? tips : tips.slice(0, 4)
  const hasMore = tips.length > 4

  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeading />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}
      >
        {visible.map((tip) => (
          <TipCard key={tip._id} tip={tip} />
        ))}
      </div>

      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          style={{
            marginTop: 14,
            background: 'none',
            border: 'none',
            color: '#1D9E75',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          Show more experiences ({tips.length - 4} more)
        </button>
      )}
    </div>
  )
}

function SectionHeading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <h2
        style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 22,
          fontWeight: 600,
          color: '#085041',
          margin: 0,
          letterSpacing: '0.01em',
        }}
      >
        Verified traveler experiences
      </h2>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: '#E1F5EE',
          border: '0.5px solid #5DCAA5',
          borderRadius: 20,
          padding: '2px 8px',
          fontSize: 10,
          color: '#1D9E75',
          fontWeight: 500,
          flexShrink: 0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Reviewed by NomadVital
      </span>
    </div>
  )
}
