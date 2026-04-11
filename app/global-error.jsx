'use client'

export default function GlobalError({ reset }) {
  return (
    <html>
      <body style={{ margin: 0, background: '#F1EFE8', fontFamily: 'Inter, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px 24px', textAlign: 'center',
        }}>
          <div style={{
            width: '56px', height: '56px', background: '#E1F5EE', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
          }}>
            <svg width="24" height="24" fill="none" stroke="#1D9E75" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#085041', marginBottom: '8px' }}>
            NomadVital is temporarily unavailable
          </h1>
          <p style={{ fontSize: '14px', color: '#5F5E5A', maxWidth: '360px', lineHeight: '1.6', marginBottom: '24px' }}>
            We&apos;re experiencing a technical issue. Please refresh the page or try again in a moment.
          </p>
          <button
            onClick={reset}
            style={{
              background: '#1D9E75', color: '#fff', border: 'none', cursor: 'pointer',
              fontWeight: '600', fontSize: '14px', padding: '11px 24px', borderRadius: '10px',
            }}
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  )
}
