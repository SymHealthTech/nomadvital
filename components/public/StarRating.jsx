'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

function StarIcon({ fill, size = 20, id }) {
  if (fill === 'full') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d={STAR_PATH} fill="#EF9F27" stroke="none" />
      </svg>
    )
  }
  if (fill === 'half') {
    const gradId = `half-${id}`
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="#EF9F27" />
            <stop offset="50%" stopColor="#D3D1C7" />
          </linearGradient>
        </defs>
        <path d={STAR_PATH} fill={`url(#${gradId})`} stroke="none" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <path d={STAR_PATH} fill="#D3D1C7" stroke="none" />
    </svg>
  )
}

function renderDisplayStars(average, size = 20, prefix = 'disp') {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    const diff = average - (i - 1)
    let fill = 'empty'
    if (diff >= 0.75) fill = 'full'
    else if (diff >= 0.25) fill = 'half'
    stars.push(<StarIcon key={i} fill={fill} size={size} id={`${prefix}-${i}`} />)
  }
  return stars
}

export default function StarRating({
  destination,
  destinationName,
  initialAverage,
  initialTotal,
  userExistingRating,
  isPro,
  isLoggedIn,
}) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(userExistingRating || 0)
  const [average, setAverage] = useState(initialAverage)
  const [total, setTotal] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')
  const [commentSaved, setCommentSaved] = useState(false)
  const confirmTimerRef = useRef(null)

  async function submitRating(rating, commentText) {
    setLoading(true)
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationSlug: destination, rating, comment: commentText ?? '' }),
      })
      const data = await res.json()
      if (res.ok) {
        setAverage(data.newAverage)
        setTotal(data.totalRatings)
        setSelected(rating)
        setConfirmed(true)
        if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
        confirmTimerRef.current = setTimeout(() => setConfirmed(false), 2000)
      }
    } catch {
      // silent fail — display is unchanged
    } finally {
      setLoading(false)
    }
  }

  async function saveComment() {
    await submitRating(selected, comment)
    setCommentSaved(true)
    setShowComment(false)
  }

  if (!isPro) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 4 }}>
          {renderDisplayStars(average, 20, `nd-${destination}`)}
          <span style={{ fontSize: 13, color: '#5F5E5A', marginLeft: 6 }}>
            {average > 0 ? `${average} / 5` : 'No ratings yet'}
          </span>
          {total > 0 && (
            <span style={{ fontSize: 13, color: '#888780' }}>({total} travelers)</span>
          )}
        </div>
        {isLoggedIn ? (
          <p style={{ fontSize: 12, color: '#888780', marginTop: 4 }}>
            Pro subscribers can rate destinations.{' '}
            <Link href="/pricing" style={{ color: '#1D9E75', textDecoration: 'underline' }}>
              Upgrade to Pro →
            </Link>
          </p>
        ) : (
          <p style={{ fontSize: 12, color: '#888780', marginTop: 4 }}>
            <Link href="/login" style={{ color: '#1D9E75', textDecoration: 'underline' }}>
              Sign in
            </Link>{' '}
            to rate destinations.
          </p>
        )}
      </div>
    )
  }

  const displayStars = hovered > 0 ? hovered : selected > 0 ? selected : 0
  const existingLabel = userExistingRating
    ? `You rated this ${selected}/5 — click to update`
    : null

  return (
    <div>
      {/* Interactive stars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div
          style={{
            display: 'flex',
            gap: 3,
            opacity: loading ? 0.45 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`Rate ${star} stars`}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => {
                if (loading) return
                setSelected(star)
                submitRating(star, '')
                setShowComment(true)
                setCommentSaved(false)
              }}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: loading ? 'default' : 'pointer',
                minWidth: 36,
                minHeight: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StarIcon
                fill={star <= displayStars ? 'full' : 'empty'}
                size={22}
                id={`int-${destination}-${star}`}
              />
            </button>
          ))}
        </div>

        {confirmed && (
          <span
            style={{
              fontSize: 12,
              color: '#1D9E75',
              fontWeight: 500,
              animation: 'fadeOut 2s forwards',
            }}
          >
            Your rating saved ✓
          </span>
        )}
      </div>

      {existingLabel && !confirmed && (
        <p style={{ fontSize: 11, color: '#888780', marginTop: 4 }}>{existingLabel}</p>
      )}

      {/* Optional comment */}
      {showComment && !commentSaved && selected > 0 && (
        <div
          style={{
            marginTop: 10,
            overflow: 'hidden',
            animation: 'slideDown 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 120))}
              placeholder="One sentence about your experience (optional)"
              maxLength={120}
              style={{
                flex: 1,
                fontSize: 12,
                border: '1px solid #D3D1C7',
                borderRadius: 8,
                padding: '6px 10px',
                outline: 'none',
                color: '#085041',
                background: '#fff',
              }}
            />
            <button
              type="button"
              onClick={saveComment}
              disabled={loading}
              style={{
                fontSize: 12,
                fontWeight: 600,
                background: '#085041',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowComment(false)}
              style={{
                fontSize: 14,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#888780',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
          <div style={{ fontSize: 11, color: '#888780', marginTop: 3, textAlign: 'right' }}>
            {comment.length}/120
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
