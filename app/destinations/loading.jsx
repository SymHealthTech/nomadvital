export default function Loading() {
  return (
    <div style={{ background: '#F1EFE8', minHeight: '100vh' }}>
      <div style={{ background: '#085041', height: '140px' }} />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D3D1C7', overflow: 'hidden', height: '280px', animation: 'nvPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }}>
              <div style={{ height: '150px', background: '#E8E6DF' }} />
              <div style={{ padding: '16px' }}>
                <div style={{ height: '14px', background: '#E8E6DF', borderRadius: '6px', marginBottom: '10px', width: '60%' }} />
                <div style={{ height: '11px', background: '#E8E6DF', borderRadius: '6px', width: '90%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes nvPulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  )
}
