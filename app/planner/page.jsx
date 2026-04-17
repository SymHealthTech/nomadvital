import PlannerClient from './PlannerClient'

export const metadata = {
  title: 'Diet Travel Planner — NomadVital',
  description: 'Get a personalised AI-generated meal plan for your destination and health condition. Safe foods, local options, and condition-specific advice.',
}

export default function PlannerPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ background: '#085041', color: '#fff', padding: '28px 20px 24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.12)', color: '#5DCAA5',
          fontSize: '11px', fontWeight: '600', letterSpacing: '2.5px',
          textTransform: 'uppercase', padding: '4px 14px', borderRadius: '20px',
          marginBottom: '16px', fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}>
          AI-Powered · Personalised
        </div>
        <h1 style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
          fontWeight: '700', letterSpacing: '0.01em', marginBottom: '10px',
        }}>
          Diet Travel Planner
        </h1>
        <p style={{ color: '#9FE1CB', fontSize: '15px', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Choose your destination and health condition — get a day-by-day meal plan with safe local foods in seconds.
        </p>
      </div>


      {/* Main content */}
      <div style={{ padding: '20px 16px 48px' }}>
        <PlannerClient />
      </div>
    </div>
  )
}
