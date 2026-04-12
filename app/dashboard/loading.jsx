export default function Loading() {
  return (
    <div style={{ maxWidth: '896px', margin: '0 auto', padding: '48px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E8E6DF', animation: 'nvPulse 1.5s ease-in-out infinite' }} />
        <div>
          <div style={{ height: '20px', width: '160px', background: '#E8E6DF', borderRadius: '6px', marginBottom: '8px', animation: 'nvPulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: '13px', width: '120px', background: '#E8E6DF', borderRadius: '4px', animation: 'nvPulse 1.5s ease-in-out infinite' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {[0, 1].map(i => (
          <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D3D1C7', padding: '24px', height: '220px', animation: 'nvPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
      <style>{`@keyframes nvPulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  )
}
