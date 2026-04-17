import Link from 'next/link'
import { auth } from '@/lib/auth'
import HeroInstallBadge from './HeroInstallBadge'

export default async function HeroSection() {
  const session = await auth()
  const isPro = session?.user?.plan === 'pro'
  const isLoggedIn = !!session

  return (
    <section className="text-white py-12 md:py-24" style={{ position: 'relative', overflow: 'hidden', background: '#085041' }}>
      {/* Background travel image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        opacity: 0.18,
      }} />
      {/* Dark gradient overlay so text stays sharp */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #085041F0 0%, #085041CC 60%, #0F6E5699 100%)',
      }} />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center" style={{ position: 'relative' }}>
        <div className="font-inter hidden md:inline-block bg-[#0F6E56] text-[#5DCAA5] text-[11px] font-medium px-3 py-1 rounded-full mb-6 tracking-[2.5px] uppercase">
          RUNNERS · MOUNTAINEERS · TOURISTS · BUSINESS TRIPS · WELLNESS · ADVENTURE
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
          {' '}you go
        </h1>

        <p className="font-inter text-sm md:text-lg text-[#9FE1CB] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Smart health &amp; nutrition guidance for travelers — wherever you go.
        </p>

        <div className="flex flex-col items-center justify-center">
          {isPro ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/ask"
                className="btn-primary font-inter bg-[#1D9E75] text-white font-semibold text-base px-8 py-3.5 rounded-xl w-full sm:w-auto"
              >
                Ask AI Advisor →
              </Link>
              <Link
                href="/destinations"
                className="font-inter border border-[#5DCAA5] text-[#5DCAA5] hover:bg-[#0F6E56] font-semibold text-base px-8 py-3.5 rounded-xl transition-colors w-full sm:w-auto"
              >
                View destinations
              </Link>
            </div>
          ) : isLoggedIn ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/pricing"
                className="btn-primary btn-pulse font-inter bg-[#1D9E75] text-white font-semibold text-base px-8 py-3.5 rounded-xl w-full sm:w-auto"
              >
                Upgrade to Pro — from $8.25/mo
              </Link>
              <Link
                href="/ask"
                className="font-inter border border-[#5DCAA5] text-[#5DCAA5] hover:bg-[#0F6E56] font-semibold text-base px-8 py-3.5 rounded-xl transition-colors w-full sm:w-auto"
              >
                Ask AI Advisor
              </Link>
            </div>
          ) : (
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
          )}

          {!isPro && (
            <p style={{ fontSize: '11px', color: '#9FE1CB', marginTop: '12px', textAlign: 'center' }}>
              {isLoggedIn ? 'Unlock unlimited questions and all 50+ guides' : 'Cancel anytime · No credit card · Takes 30 seconds'}
            </p>
          )}

          {/* Persistent PWA install badge — hidden when already running as installed app */}
          <HeroInstallBadge />
        </div>
      </div>
    </section>
  )
}

