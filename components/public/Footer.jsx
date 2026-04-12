import Link from 'next/link'

export default function Footer({ mobileHidden = false }) {
  return (
    <footer style={{ background: '#062E25' }} className={`text-white mt-auto${mobileHidden ? ' hidden md:block' : ''}`}>

      {/* ── Mobile compact strip ── */}
      <div className="md:hidden px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div style={{ width: '22px', height: '22px', backgroundColor: '#1D9E75', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
                <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
                <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', color: '#E1F5EE', fontWeight: 700, letterSpacing: '-0.3px' }}>
              Nomad<span style={{ fontWeight: 400, fontStyle: 'italic', color: '#5DCAA5' }}>Vital</span>
            </span>
          </div>
          <span className="text-[10px] text-[#3D6B5E]">© 2025 Sym HealthTech</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {[
            { href: '/ask', label: 'AI Advisor' },
            { href: '/destinations', label: 'Destinations' },
            { href: '/blog', label: 'Blog' },
            { href: '/pricing', label: 'Pricing' },
            { href: '/privacy', label: 'Privacy' },
            { href: '/contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-[11px] text-[#5F8A7A] hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Desktop full footer ── */}
      <div className="hidden md:block max-w-6xl mx-auto px-6 py-10">

        {/* 3-column grid on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">

          {/* Col 1 — Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div style={{ width: '30px', height: '30px', backgroundColor: '#1D9E75', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
                  <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
                  <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', letterSpacing: '-0.5px', color: '#E1F5EE', fontWeight: 700 }}>
                Nomad<span style={{ fontWeight: 400, fontStyle: 'italic', color: '#5DCAA5' }}>Vital</span>
              </span>
            </div>
            <p className="text-xs text-[#9FE1CB] leading-relaxed mb-4 max-w-[220px]">
              Smart health &amp; nutrition guidance for travelers — wherever you go.
            </p>
            <div className="flex items-center gap-2">
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75' }} />
              <span className="text-[10px] text-[#5DCAA5] font-medium tracking-wide uppercase">Powered by Claude AI</span>
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <p className="text-[10px] font-semibold text-[#5DCAA5] tracking-[2px] uppercase mb-4">Explore</p>
            <div className="flex flex-col gap-2.5">
              {[
                { href: '/ask', label: 'AI Advisor' },
                { href: '/destinations', label: 'Destinations' },
                { href: '/planner', label: 'Travel Planner' },
                { href: '/blog', label: 'Blog' },
                { href: '/pricing', label: 'Pricing' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="text-sm text-[#9FE1CB] hover:text-white transition-colors w-fit">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 — Legal + contact */}
          <div>
            <p className="text-[10px] font-semibold text-[#5DCAA5] tracking-[2px] uppercase mb-4">Company</p>
            <div className="flex flex-col gap-2.5 mb-5">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/disclaimer', label: 'Medical Disclaimer' },
                { href: '/contact', label: 'Contact Us' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="text-sm text-[#9FE1CB] hover:text-white transition-colors w-fit">
                  {label}
                </Link>
              ))}
            </div>
            <a href="mailto:contact@nomadvital.com"
              className="inline-flex items-center gap-2 text-xs text-[#5DCAA5] hover:text-white transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              contact@nomadvital.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #0F6E56', paddingTop: '20px' }}>
          {/* Disclaimer */}
          <p className="text-[11px] text-[#5F8A7A] leading-relaxed max-w-3xl mx-auto text-center mb-4">
            General health &amp; nutrition information for educational purposes only. Not medical advice.
            Always consult a qualified healthcare provider before making dietary changes while traveling.
          </p>
          {/* Copyright */}
          <p className="text-center text-[11px] text-[#3D6B5E]">
            © 2025 NomadVital &middot; a product by <span className="text-[#5DCAA5] font-medium">Sym HealthTech</span>
          </p>
        </div>
      </div>

    </footer>
  )
}
