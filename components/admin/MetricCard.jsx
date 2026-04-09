export default function MetricCard({ label, value, sub, color = '#1D9E75' }) {
  return (
    <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 shadow-sm">
      <div className="text-xs font-bold text-[#888780] tracking-widest uppercase mb-2">{label}</div>
      <div className="text-3xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      {sub && <div className="text-xs text-[#888780]">{sub}</div>}
    </div>
  )
}
