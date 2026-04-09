'use client'

import { useState } from 'react'
import { travelerPersonas } from '@/lib/travelerPersonas'

export default function TravelerTypeSelector({ onPersonaChange, selectedPersonaId: externalSelected }) {
  const [internalSelected, setInternalSelected] = useState('general')
  const selectedId = externalSelected !== undefined ? externalSelected : internalSelected

  function handleSelect(personaId) {
    setInternalSelected(personaId)
    if (onPersonaChange) onPersonaChange(personaId)
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{
        fontSize: '11px',
        color: '#888780',
        marginBottom: '10px',
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
      }}>
        I am traveling as a...
      </p>

      {/* 2-col mobile, 3-col sm, 6-col lg */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
      }}>
        <style>{`
          @media (min-width: 480px) { .ttsel-grid { grid-template-columns: repeat(3, 1fr) !important; } }
          @media (min-width: 900px) { .ttsel-grid { grid-template-columns: repeat(6, 1fr) !important; } }
        `}</style>
        <div className="ttsel-grid" style={{ display: 'contents' }}>
          {travelerPersonas.map((persona) => {
            const isSelected = selectedId === persona.id
            return (
              <button
                key={persona.id}
                onClick={() => handleSelect(persona.id)}
                style={{
                  background: isSelected ? persona.lightColor : '#F9F8F5',
                  border: isSelected ? `1.5px solid ${persona.color}` : '1px solid #E0DDD6',
                  borderRadius: '10px',
                  padding: '10px 8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                {/* Emoji */}
                <span style={{ fontSize: '22px', lineHeight: 1 }}>{persona.emoji}</span>

                {/* Name */}
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: isSelected ? '#085041' : '#5F5E5A',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  lineHeight: '1.25',
                }}>
                  {persona.name}
                </span>

                {/* Tagline */}
                <span style={{
                  fontSize: '10px',
                  color: isSelected ? persona.color : '#888780',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  lineHeight: '1.2',
                }}>
                  {persona.tagline}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
