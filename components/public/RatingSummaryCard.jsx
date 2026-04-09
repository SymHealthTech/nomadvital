'use client'

import Link from 'next/link'
import StarRating from './StarRating'

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

function SmallStars({ average }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    const diff = average - (i - 1)
    let fill = '#D3D1C7'
    if (diff >= 0.75) fill = '#EF9F27'
    else if (diff >= 0.25) fill = 'url(#half-sm)'
    stars.push(
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="half-sm" x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="#EF9F27" />
            <stop offset="50%" stopColor="#D3D1C7" />
          </linearGradient>
        </defs>
        <path d={STAR_PATH} fill={fill} stroke="none" />
      </svg>
    )
  }
  return <div style={{ display: 'flex', gap: 2 }}>{stars}</div>
}

export default function RatingSummaryCard({
  destination,
  destinationName,
  initialAverage,
  initialTotal,
  userExistingRating,
  isPro,
  isLoggedIn,
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '0.5px solid #C0DD97',
        borderRadius: 10,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
      }}
    >
      {/* Left: large number + stars + count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 32,
              fontWeight: 600,
              color: '#085041',
              lineHeight: 1,
            }}
          >
            {initialTotal > 0 ? initialAverage.toFixed(1) : '—'}
          </div>
          <SmallStars average={initialAverage} />
          <div style={{ fontSize: 11, color: '#888780', marginTop: 3 }}>
            {initialTotal > 0 ? `(${initialTotal} traveler ratings)` : 'No ratings yet'}
          </div>
        </div>
      </div>

      {/* Right: interactive or upgrade prompt */}
      <div style={{ minWidth: 160 }}>
        {isPro ? (
          <div>
            <div style={{ fontSize: 12, color: '#1D9E75', fontWeight: 500, marginBottom: 6 }}>
              Rate this guide
            </div>
            <StarRating
              destination={destination}
              destinationName={destinationName}
              initialAverage={initialAverage}
              initialTotal={initialTotal}
              userExistingRating={userExistingRating}
              isPro={isPro}
              isLoggedIn={isLoggedIn}
            />
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 12, color: '#888780', marginBottom: 4 }}>
              Rate destinations with Pro
            </div>
            <Link
              href="/pricing"
              style={{
                fontSize: 12,
                color: '#1D9E75',
                textDecoration: 'underline',
                fontWeight: 500,
              }}
            >
              Upgrade to Pro →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
