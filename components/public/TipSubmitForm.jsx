'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TipSubmitForm({ destination, destinationName, isLoggedIn }) {
  const [form, setForm] = useState({
    authorName: '',
    authorCity: '',
    healthCondition: '',
    tipText: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set(field) {
    return (e) => {
      const val = field === 'tipText' ? e.target.value.slice(0, 280) : e.target.value
      setForm((prev) => ({ ...prev, [field]: val }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/tips/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          destinationName,
          authorName: form.authorName,
          authorCity: form.authorCity,
          healthCondition: form.healthCondition,
          tipText: form.tipText,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    fontSize: 14,
    border: '1px solid #C0DD97',
    borderRadius: 8,
    outline: 'none',
    color: '#085041',
    background: '#fff',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    color: '#5F5E5A',
    marginBottom: 5,
  }

  return (
    <div
      style={{
        background: '#F1EFE8',
        border: '0.5px solid #C0DD97',
        borderRadius: 12,
        padding: 20,
        marginTop: 32,
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 20,
          fontWeight: 600,
          color: '#085041',
          marginBottom: 4,
          letterSpacing: '0.01em',
        }}
      >
        Share your experience
      </h2>
      <p style={{ fontSize: 13, color: '#5F5E5A', marginBottom: 16, marginTop: 0 }}>
        Help other travelers with your real experience in {destinationName}.
      </p>

      {!isLoggedIn ? (
        <p style={{ fontSize: 14, color: '#5F5E5A' }}>
          <Link
            href="/login"
            style={{ color: '#1D9E75', fontWeight: 600, textDecoration: 'underline' }}
          >
            Sign in
          </Link>{' '}
          to share your experience.
        </p>
      ) : success ? (
        <div
          style={{
            background: '#E1F5EE',
            border: '0.5px solid #5DCAA5',
            borderRadius: 8,
            padding: '14px 16px',
            color: '#085041',
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          Thank you! Your tip has been submitted for review.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Your name</label>
              <input
                type="text"
                value={form.authorName}
                onChange={set('authorName')}
                placeholder="e.g. Rajesh K."
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Your city and country</label>
              <input
                type="text"
                value={form.authorCity}
                onChange={set('authorCity')}
                placeholder="e.g. Mumbai, India"
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Your health condition or dietary need</label>
            <input
              type="text"
              value={form.healthCondition}
              onChange={set('healthCondition')}
              placeholder="e.g. Type 2 diabetes, vegan, nut allergy"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between' }}>
              <span>Your tip</span>
              <span
                style={{
                  color: form.tipText.length >= 260 ? '#D85A30' : '#888780',
                  fontWeight: 400,
                }}
              >
                {form.tipText.length}/280
              </span>
            </label>
            <textarea
              value={form.tipText}
              onChange={set('tipText')}
              rows={4}
              maxLength={280}
              placeholder='e.g. I found safe gluten-free options at most Thai restaurants by showing a card in Thai saying "no wheat, no soy sauce"'
              required
              style={{
                ...inputStyle,
                resize: 'vertical',
                lineHeight: 1.6,
                minHeight: 90,
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#D85A30', fontSize: 13, marginBottom: 10, marginTop: -8 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              background: submitting ? '#5DCAA5' : '#085041',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '11px 0',
              fontSize: 14,
              fontWeight: 600,
              cursor: submitting ? 'default' : 'pointer',
              transition: 'background 0.15s',
              fontFamily: 'inherit',
            }}
          >
            {submitting ? 'Submitting…' : 'Share my experience'}
          </button>

          <p style={{ fontSize: 11, color: '#888780', textAlign: 'center', marginTop: 10, marginBottom: 0 }}>
            Tips are reviewed before publishing — usually within 24 hours
          </p>
        </form>
      )}
    </div>
  )
}
