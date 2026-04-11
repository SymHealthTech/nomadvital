import Link from 'next/link'

export default function PricingCard({ plan, price, period, subPrice, badge, features, cta, href, highlighted, microCopy, ctaNode }) {
  return (
    <div
      className={`relative rounded-2xl p-8 flex flex-col gap-6 ${
        highlighted
          ? 'bg-white border-2 border-[#1D9E75] shadow-lg'
          : 'bg-white border border-[#D3D1C7] shadow-sm'
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#1D9E75] text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide">
            {badge}
          </span>
        </div>
      )}

      <div>
        <div className="text-xs font-bold text-[#888780] tracking-widest mb-2 uppercase">{plan}</div>
        <div className="flex items-end gap-1">
          <span className="text-4xl font-bold text-[#085041]">{price}</span>
          <span className="text-[#888780] text-sm mb-1">{period}</span>
        </div>
        {subPrice && (
          <div style={{ fontSize: '12px', color: '#1D9E75', fontWeight: '500', marginTop: '4px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            {subPrice}
          </div>
        )}
      </div>

      <ul className="flex flex-col gap-3 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-[#5F5E5A]">
            <svg className="w-4 h-4 text-[#1D9E75] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center">
        {ctaNode ? ctaNode : (
          <Link
            href={href}
            className={`btn-primary text-center font-semibold text-sm py-3 rounded-xl w-full ${
              highlighted
                ? 'bg-[#1D9E75] text-white'
                : 'bg-[#F1EFE8] hover:bg-[#D3D1C7] text-[#085041]'
            }`}
          >
            {cta}
          </Link>
        )}
        {microCopy && (
          <p style={{ fontSize: '11px', color: '#888780', marginTop: '6px', textAlign: 'center' }}>
            {microCopy}
          </p>
        )}
      </div>
    </div>
  )
}
