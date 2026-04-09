'use client'

import { useState } from 'react'
import TravelerTypeSelector from '@/components/public/TravelerTypeSelector'

export default function TravelerTypeCard({ initialTravelerType }) {
  const [savedType, setSavedType] = useState(initialTravelerType || 'general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleChange(personaId) {
    setSavedType(personaId)
    setSaving(true)
    setSaved(false)

    await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ travelerType: personaId }),
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D3D1C7] p-6 md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] font-medium text-[#1D9E75] tracking-[2px] uppercase">
          My Traveler Type
        </div>
        {saving && (
          <span style={{ fontSize: '11px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Saving...
          </span>
        )}
        {saved && !saving && (
          <span style={{ fontSize: '11px', color: '#1D9E75', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            ✓ Saved
          </span>
        )}
      </div>
      <TravelerTypeSelector
        selectedPersonaId={savedType}
        onPersonaChange={handleChange}
      />
    </div>
  )
}
