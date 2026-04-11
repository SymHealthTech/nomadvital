import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#085041] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-5 py-8">

        {/* Logo + tagline */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width: '28px', height: '28px', backgroundColor: '#1D9E75', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
                <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
                <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', letterSpacing: '-0.5px', color: '#E1F5EE', fontWeight: 700 }}>
              Nomad<span style={{ fontWeight: 400, fontStyle: 'italic', color: '#5DCAA5' }}>Vital</span>
            </span>
          </div>
          <p className="text-xs text-[#9FE1CB] max-w-xs leading-relaxed">
            AI travel health advisor for food safety and nutrition abroad.
          </p>
        </div>

        <hr className="border-[#0F6E56] mb-6" />

        {/* Links row */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 mb-6 text-sm">
          <Link href="/destinations" className="text-[#9FE1CB] hover:text-white transition-colors">
            Destinations
          </Link>
          <Link href="/blog" className="text-[#9FE1CB] hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/pricing" className="text-[#9FE1CB] hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/ask" className="text-[#9FE1CB] hover:text-white transition-colors">
            AI Advisor
          </Link>
          <Link href="/privacy" className="text-[#9FE1CB] hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/disclaimer" className="text-[#9FE1CB] hover:text-white transition-colors">
            Disclaimer
          </Link>
          <Link href="/contact" className="text-[#9FE1CB] hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        <hr className="border-[#0F6E56] mb-5" />

        {/* Medical disclaimer */}
        <p className="text-xs text-[#9FE1CB] leading-relaxed max-w-3xl mx-auto text-center mb-5">
          NomadVital provides general health and nutrition information for educational purposes only.
          AI-generated responses are not medical advice and are not a substitute for professional
          medical consultation. Always consult a qualified healthcare provider before making dietary
          changes or traveling with a medical condition.
        </p>

        {/* Copyright */}
        <p className="text-center text-xs text-[#5DCAA5]">
          © 2025 NomadVital &middot; a product by <span className="text-white font-medium">Sym HealthTech</span>
        </p>

      </div>
    </footer>
  )
}
