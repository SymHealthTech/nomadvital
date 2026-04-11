'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function MobileStickyBar() {
  const { data: session } = useSession()
  const isPro = session?.user?.plan === 'pro'
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

  const mobileVisible = scrolled && !mobileDismissed && !hiddenByPricing && !isPro
  const desktopVisible = !hiddenByPricing && !isPro

  return (
    <>
      {/* ── Desktop only: always-visible floating pill at bottom-right ── */}
      <div
        className="desktop-scroll-cta hidden md:block"
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
          href="/guest"
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
