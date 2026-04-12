export default function Loading() {
  return (
    <div style={{ background: '#F1EFE8', minHeight: '100vh' }}>
      <div style={{ background: '#085041', height: '130px' }} />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D3D1C7', overflow: 'hidden', animation: 'nvPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.15}s` }}>
              <div style={{ height: '160px', background: '#E8E6DF' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ height: '10px', background: '#E8E6DF', borderRadius: '4px', width: '40%', marginBottom: '10px' }} />
                <div style={{ height: '14px', background: '#E8E6DF', borderRadius: '6px', marginBottom: '8px' }} />
                <div style={{ height: '11px', background: '#E8E6DF', borderRadius: '4px', width: '85%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes nvPulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  )
}
