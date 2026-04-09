import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-[#085041] text-white py-12 md:py-24">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
        <div className="font-inter inline-block bg-[#0F6E56] text-[#5DCAA5] text-[11px] font-medium px-3 py-1 rounded-full mb-6 tracking-[2.5px] uppercase">
          RUNNERS · MOUNTAINEERS · Tourist . BUSINESS · WELLNESS · ADVENTURE
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            letterSpacing: '0.02em',
            lineHeight: '1.25',
            color: '#E1F5EE',
            maxWidth: '720px',
            margin: '0 auto 0.75rem',
            textAlign: 'center',
          }}
        >
          Stay healthy{' '}
          <span style={{ color: '#5DCAA5', fontStyle: 'normal' }}>everywhere</span>
          <br />
          you go
        </h1>

        <p className="font-inter text-lg md:text-xl text-[#9FE1CB] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          AI-powered nutrition and food safety — for every kind of traveler.
        </p>

        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="btn-primary btn-pulse font-inter bg-[#1D9E75] text-white font-semibold text-base px-8 py-3.5 rounded-xl w-full sm:w-auto"
            >
              Start free — no card needed
            </Link>
            <Link
              href="#features"
              className="font-inter border border-[#5DCAA5] text-[#5DCAA5] hover:bg-[#0F6E56] font-semibold text-base px-8 py-3.5 rounded-xl transition-colors w-full sm:w-auto"
            >
              See how it works
            </Link>
          </div>

          <p style={{ fontSize: '11px', color: '#9FE1CB', marginTop: '12px', textAlign: 'center' }}>
            Cancel anytime · No credit card · Takes 30 seconds
          </p>

        </div>
      </div>
    </section>
  )
}
