export const metadata = {
  title: 'Contact — NomadVital',
  description: 'Get in touch with the NomadVital team — support, partnerships, and feedback.',
  alternates: { canonical: 'https://nomadvital.com/contact' },
}

const CARD_STYLE = {
  background: '#fff',
  border: '1px solid #D3D1C7',
  borderRadius: '14px',
  padding: '24px',
}

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ background: '#085041', color: '#fff', padding: '52px 24px', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
          fontWeight: '700',
          letterSpacing: '0.01em',
          marginBottom: '10px',
        }}>
          Contact
        </h1>
        <p style={{ color: '#9FE1CB', fontSize: '15px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          We read every message and reply within 24 hours.
        </p>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px 64px' }}>

        {/* Contact card */}
        <div style={{ marginBottom: '40px' }}>
          <div style={CARD_STYLE}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                background: '#E1F5EE',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="18" height="18" fill="none" stroke="#1D9E75" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#085041',
                  marginBottom: '4px',
                }}>
                  Get in touch
                </h2>
                <p style={{ fontSize: '13px', color: '#5F5E5A', lineHeight: '1.6', marginBottom: '8px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  Support, account questions, partnerships, privacy requests — send everything here.
                </p>
                <a
                  href="mailto:contact@nomadvital.com"
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1D9E75',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}
                >
                  contact@nomadvital.com →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Response time note */}
        <div style={{
          background: '#F1EFE8',
          borderRadius: '12px',
          padding: '20px 22px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '40px',
        }}>
          <svg width="16" height="16" fill="none" stroke="#1D9E75" strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
            <circle cx="12" cy="12" r="10"/>
            <path strokeLinecap="round" d="M12 6v6l4 2"/>
          </svg>
          <p style={{ fontSize: '13px', color: '#5F5E5A', lineHeight: '1.6', margin: 0, fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            <strong style={{ color: '#085041' }}>Response time:</strong> We aim to reply to all enquiries within 24 hours on business days (Monday–Friday). For subscription billing issues, please include your account email in your message.
          </p>
        </div>

        {/* FAQ shortcut */}
        <div style={{
          background: '#085041',
          borderRadius: '14px',
          padding: '28px 24px',
          textAlign: 'center',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: '18px',
            fontWeight: '600',
            color: '#fff',
            marginBottom: '8px',
          }}>
            Looking for quick answers?
          </h3>
          <p style={{ color: '#9FE1CB', fontSize: '13px', marginBottom: '18px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Many common questions are covered on our pricing page — including how the free trial works, how to cancel, and what's included in Pro.
          </p>
          <a
            href="/pricing"
            style={{
              display: 'inline-block',
              background: '#1D9E75',
              color: '#fff',
              fontWeight: '600',
              fontSize: '13px',
              padding: '10px 22px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            View pricing &amp; FAQ →
          </a>
        </div>

      </div>
    </div>
  )
}
