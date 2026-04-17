'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import PricingCard from './PricingCard'
import CheckoutButton from './CheckoutButton'

const MONTHLY_PRICE = 12   // $12/mo
const ANNUAL_PRICE  = 99   // $99/yr
const ANNUAL_PER_MO = (ANNUAL_PRICE / 12).toFixed(2)  // "8.25"
const ANNUAL_SAVINGS_PCT = Math.round((1 - ANNUAL_PRICE / (MONTHLY_PRICE * 12)) * 100) // 31

const freePlan = {
  plan: 'Free',
  price: '$0',
  period: '/mo',
  badge: null,
  highlighted: false,
  cta: 'Start for free',
  href: '/signup',
  microCopy: 'No card required · Free forever',
  features: [
    '3 AI health questions per day',
    '5 destination guides',
    'Basic travel health tips',
    'No credit card required',
  ],
}

function proPlan(billing) {
  const isAnnual = billing === 'annual'
  return {
    plan: 'Pro',
    price: isAnnual ? `$${ANNUAL_PRICE}` : `$${MONTHLY_PRICE}`,
    period: isAnnual ? '/yr' : '/mo',
    subPrice: isAnnual ? `~$${ANNUAL_PER_MO}/mo` : `$${ANNUAL_PRICE}/yr if billed annually`,
    badge: 'Most popular',
    highlighted: true,
    microCopy: 'No charge until day 8 · Cancel anytime',
    features: [
      'Unlimited AI health questions',
      '50+ destination guides',
      'Diet travel planner',
      'PDF meal plan downloads',
      'Priority email support',
      'Cancel anytime',
    ],
  }
}

const securityBadges = [
  {
    text: 'Secured by Dodo Payments',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="4" width="12" height="9" rx="1.5" stroke="#888780" strokeWidth="1.2"/>
        <path d="M4 4V3a3 3 0 016 0v1" stroke="#888780" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="7" cy="8.5" r="1" fill="#888780"/>
      </svg>
    ),
  },
  {
    text: '256-bit SSL',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 1L2 3.5V7c0 2.8 2 5.1 5 6 3-0.9 5-3.2 5-6V3.5L7 1z" stroke="#888780" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M4.5 7l1.5 1.5L9.5 5" stroke="#888780" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    text: 'Cancel anytime',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7A5 5 0 112 7" stroke="#888780" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M12 7l-2-2M12 7l-2 2" stroke="#888780" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    text: 'Privacy protected',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="7" cy="7" rx="5" ry="3.5" stroke="#888780" strokeWidth="1.2"/>
        <circle cx="7" cy="7" r="1.5" stroke="#888780" strokeWidth="1.2"/>
      </svg>
    ),
  },
]

export default function PricingSection() {
  const { data: session } = useSession()
  const isPro = session?.user?.plan === 'pro'
  const [billing, setBilling] = useState('annual')

  const pro = proPlan(billing)

  return (
    <section id="pricing" className="bg-[#F1EFE8] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#085041] mb-4" style={{ letterSpacing: '0.01em', lineHeight: '1.3', fontWeight: '600' }}>
            Simple, transparent pricing
          </h2>
          <p className="text-[#5F5E5A] text-lg max-w-xl mx-auto">
            {isPro
              ? "You're on Pro — enjoy unlimited access to all features."
              : 'Start free — no credit card needed. Upgrade to Pro when you need unlimited access.'}
          </p>
        </div>

        {isPro ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-[#1D9E75] shadow-lg p-8 text-center">
            <div style={{ width: '48px', height: '48px', background: '#E1F5EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" fill="none" stroke="#1D9E75" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div className="text-xs font-bold text-[#1D9E75] tracking-widest uppercase mb-2">Pro Plan Active</div>
            <p className="text-[#5F5E5A] text-sm mb-6">Unlimited AI questions, 50+ destination guides, diet planner — all yours.</p>
            <Link href="/dashboard" className="block text-center bg-[#1D9E75] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#0F6E56] transition-colors">
              Go to Dashboard →
            </Link>
          </div>
        ) : (
          <>
            {/* Billing toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                background: '#E8E5DC',
                borderRadius: '999px',
                padding: '4px',
                gap: '2px',
              }}>
                <button
                  onClick={() => setBilling('monthly')}
                  style={{
                    padding: '7px 20px',
                    borderRadius: '999px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    transition: 'all 0.15s ease',
                    background: billing === 'monthly' ? '#fff' : 'transparent',
                    color: billing === 'monthly' ? '#085041' : '#888780',
                    boxShadow: billing === 'monthly' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling('annual')}
                  style={{
                    padding: '7px 20px',
                    borderRadius: '999px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    transition: 'all 0.15s ease',
                    background: billing === 'annual' ? '#fff' : 'transparent',
                    color: billing === 'annual' ? '#085041' : '#888780',
                    boxShadow: billing === 'annual' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Annual
                  <span style={{
                    background: billing === 'annual' ? '#1D9E75' : '#D3D1C7',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    letterSpacing: '0.3px',
                    transition: 'background 0.15s ease',
                  }}>
                    SAVE {ANNUAL_SAVINGS_PCT}%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <PricingCard {...freePlan} />
              <PricingCard
                {...pro}
                ctaNode={
                  <CheckoutButton
                    billing={billing}
                    className="btn-primary text-center font-semibold text-sm py-3 px-6 rounded-xl w-full bg-[#1D9E75] text-white hover:bg-[#0F6E56] transition-colors"
                    style={{ display: 'block', cursor: 'pointer', border: 'none' }}
                  >
                    Start 7-day free trial
                  </CheckoutButton>
                }
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
              {securityBadges.map(badge => (
                <div key={badge.text} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#888780' }}>
                  {badge.icon}
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
