import Link from 'next/link'
import { travelerPersonas } from '@/lib/travelerPersonas'
import FadeInSection from './FadeInSection'

function PersonaIcon({ svgIcon, color }) {
  const icons = {
    plane: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19.5 2.5c-1.5-1.5-3.5-1.5-5 0L11 6 2.8 6.2c-.5.1-.9.5-.9 1L2 8.9c0 .5.4 1 .9 1.1L9 12l-2.5 4-3 .5c-.4.1-.7.4-.7.9V18c0 .5.4.9.9.9l3-.4 4.5-2.5 3.2 6c.2.4.6.6 1 .6h1.9c.5 0 .9-.4.9-.9l-.1-2.5z"/>
      </svg>
    ),
    runner: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13" cy="4" r="2"/>
        <path d="m14.5 10.5-1 4.5-3.5 3 1 2"/>
        <path d="m8.5 10.5 1 2 4.5 1 2.5-3.5"/>
        <path d="M6 14.5 4 17l2 2.5"/>
      </svg>
    ),
    triathlete: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0"/>
        <path d="M12 8v4l2 2"/>
      </svg>
    ),
    mountain: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
      </svg>
    ),
    briefcase: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    lotus: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 10c-1.5-2-5-3-7-1 0 3 2.5 5 7 6 4.5-1 7-3 7-6-2-2-5.5-1-7 1z"/>
        <path d="M12 10C10.5 7 8 4 5 4c0 4 3 7 7 8 4-1 7-4 7-8-3 0-5.5 3-7 6z"/>
        <path d="M12 18v4"/>
      </svg>
    ),
  }
  return icons[svgIcon] || icons.plane
}

export default function WhoIsItForSection() {
  return (
    <FadeInSection delay={100}>
      <section style={{ background: '#fff', padding: '64px 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: '#1D9E75',
              marginBottom: '10px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}>
              WHO IS NOMADVITAL FOR
            </div>
            <h2 style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
              fontWeight: '600',
              color: '#085041',
              lineHeight: '1.3',
            }}>
              Built for every kind of traveler
            </h2>
          </div>

          {/* Persona grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}
            className="sm:grid-cols-3 lg:grid-cols-6"
          >
            <style>{`
              @media (min-width: 640px) { .persona-who-grid { grid-template-columns: repeat(3, 1fr) !important; } }
              @media (min-width: 1024px) { .persona-who-grid { grid-template-columns: repeat(6, 1fr) !important; } }
              .persona-who-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
            `}</style>
            <div className="persona-who-grid" style={{ display: 'contents' }}>
              {travelerPersonas.map((persona) => (
                <Link key={persona.id} href={persona.pageUrl} style={{ textDecoration: 'none' }}>
                  <div
                    className="persona-who-card"
                    style={{
                      background: persona.lightColor,
                      border: `0.5px solid ${persona.color}66`,
                      borderRadius: '12px',
                      padding: '16px 14px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {/* Icon circle */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: persona.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <PersonaIcon svgIcon={persona.svgIcon} color={persona.color} />
                    </div>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#085041',
                      lineHeight: '1.2',
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    }}>
                      {persona.name}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: persona.color,
                      lineHeight: '1.3',
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    }}>
                      {persona.tagline}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: persona.color,
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                      marginTop: 'auto',
                    }}>
                      Learn more →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer link */}
          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <p style={{ fontSize: '13px', color: '#5F5E5A', fontFamily: 'var(--font-inter, Inter, sans-serif)', marginBottom: '6px' }}>
              Not sure which applies to you? Our AI handles all types of travelers.
            </p>
            <Link href="/ask" style={{
              fontSize: '13px',
              color: '#1D9E75',
              fontWeight: '500',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}>
              Start with the general guide →
            </Link>
          </div>
        </div>
      </section>
    </FadeInSection>
  )
}
