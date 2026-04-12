'use client'

import { useState } from 'react'
import { travelerPersonas } from '@/lib/travelerPersonas'

export default function TravelerTypeCard({ initialTravelerType }) {
  const [selected, setSelected] = useState(initialTravelerType || 'general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleChange(id) {
    setSelected(id)
    setSaving(true)
    setSaved(false)
    await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ travelerType: id }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D3D1C7] p-5 md:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[11px] font-medium text-[#1D9E75] tracking-[2px] uppercase">My Traveler Type</div>
          <p style={{ fontSize: '11px', color: '#888780', marginTop: '2px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Shapes AI advice in the advisor
          </p>
        </div>
        {saving && <span style={{ fontSize: '11px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>Saving…</span>}
        {saved && !saving && <span style={{ fontSize: '11px', color: '#1D9E75', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>✓ Saved</span>}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {travelerPersonas.map((persona) => {
          const isSelected = selected === persona.id
          return (
            <button
              key={persona.id}
              onClick={() => handleChange(persona.id)}
              style={{
                background: isSelected ? persona.lightColor : '#F9F8F5',
                border: isSelected ? `1.5px solid ${persona.color}` : '1px solid #E0DDD6',
                borderRadius: '20px',
                padding: '6px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{persona.emoji}</span>
              <span style={{ fontSize: '12px', fontWeight: isSelected ? '600' : '400', color: isSelected ? '#085041' : '#5F5E5A', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                {persona.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
