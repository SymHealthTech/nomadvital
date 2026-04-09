'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

export default function MobileStickyBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileDismissed, setMobileDismissed] = useState(false)
  const [hiddenByPricing, setHiddenByPricing] = useState(false)
  const pricingObserverRef = useRef(null)

  useEffect(() => {
    if (sessionStorage.getItem('mobileStickyBarDismissed') === 'true') {
      setMobileDismissed(true)
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingObserverRef.current = new IntersectionObserver(
        ([entry]) => setHiddenByPricing(entry.isIntersecting),
        { threshold: 0.1 }
      )
      pricingObserverRef.current.observe(pricingSection)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (pricingObserverRef.current) pricingObserverRef.current.disconnect()
    }
  }, [])

  const handleMobileDismiss = () => {
    sessionStorage.setItem('mobileStickyBarDismissed', 'true')
    setMobileDismissed(true)
  }

  const mobileVisible = scrolled && !mobileDismissed && !hiddenByPricing
  const desktopVisible = !hiddenByPricing

  return (
    <>
      {/* ── Mobile: full-width bottom bar ── */}
      <div
        className="mobile-sticky-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '56px',
          background: '#085041',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 100,
          transform: mobileVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <span style={{ fontSize: '14px', color: '#9FE1CB', fontWeight: '500' }}>
          Start free today
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/signup"
            style={{
              background: '#1D9E75',
              color: 'white',
              fontSize: '13px',
              fontWeight: '600',
              padding: '8px 18px',
              borderRadius: '20px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Get started →
          </Link>
          <button
            onClick={handleMobileDismiss}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: '#5DCAA5',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Desktop: always-visible floating pill at bottom-right ── */}
      <div
        className="desktop-scroll-cta"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '28px',
          zIndex: 100,
          opacity: desktopVisible ? 1 : 0,
          transform: desktopVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: desktopVisible ? 'auto' : 'none',
        }}
      >
        <Link
          href="/signup"
          style={{
            display: 'block',
            background: '#1D9E75',
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            padding: '10px 22px',
            borderRadius: '24px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(29, 158, 117, 0.4)',
          }}
        >
          Start free →
        </Link>
      </div>
    </>
  )
}
