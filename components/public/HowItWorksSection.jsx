import HowItWorksInstallCard from './HowItWorksInstallCard'

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Create your free account',
      description:
        'Sign up in 30 seconds — no credit card needed. Choose your health conditions and upcoming destinations.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="9" r="5" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round"/>
          <path d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Tell us where you\'re going',
      description:
        'Enter your destination, travel dates, and any dietary needs or medical conditions. We personalise everything for you.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 3C10.134 3 7 6.134 7 10c0 5.25 7 15 7 15s7-9.75 7-15c0-3.866-3.134-7-7-7z" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="14" cy="10" r="2.5" stroke="#1D9E75" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Get your health guide instantly',
      description:
        'Receive AI-powered nutrition advice, food safety tips, and a personalised meal plan — before you even board the plane.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 14l6 6L23 8" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 3c1 0 2 .5 3 1.5" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
          <circle cx="22" cy="6" r="3" fill="#1D9E75" opacity="0.25"/>
          <path d="M20 6l1.5 1.5L24 4" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ]

  return (
    <section style={{ background: '#ffffff', padding: '72px 16px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '2.5px',
            color: '#1D9E75',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          HOW IT WORKS
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
            fontWeight: '700',
            color: '#085041',
            marginBottom: '48px',
            lineHeight: '1.3',
          }}
        >
          Get your personalised health guide in 3 steps
        </h2>

        {/* Steps grid with connecting line */}
        <div style={{ position: 'relative' }}>
          {/* Dashed connecting line — desktop only */}
          <div
            className="how-it-works-line"
            style={{
              position: 'absolute',
              top: '28px',
              left: 'calc(16.66% + 28px)',
              right: 'calc(16.66% + 28px)',
              height: '1px',
              borderTop: '2px dashed #C0DD97',
              zIndex: 0,
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              position: 'relative',
              zIndex: 1,
            }}
            className="how-it-works-grid"
          >
            {steps.map((step) => (
              <div
                key={step.number}
                style={{
                  background: '#ffffff',
                  border: '1px solid #D4EFE3',
                  borderRadius: '16px',
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    fontSize: '36px',
                    fontWeight: '700',
                    color: '#E1F5EE',
                    lineHeight: '1',
                    marginBottom: '-4px',
                  }}
                >
                  {step.number}
                </div>

                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    background: '#E1F5EE',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.icon}
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: '#085041',
                    margin: 0,
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#5F5E5A',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Permanent PWA install card — auto-hides when already using as installed app */}
        <HowItWorksInstallCard />
      </div>

    </section>
  )
}
