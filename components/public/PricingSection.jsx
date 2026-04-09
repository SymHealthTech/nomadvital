'use client'

import PricingCard from './PricingCard'
import CheckoutButton from './CheckoutButton'

const plans = [
  {
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
  },
  {
    plan: 'Pro',
    price: '$12',
    period: '/mo',
    badge: 'Most popular',
    highlighted: true,
    cta: 'Start Pro free trial',
    href: '/signup?plan=pro',
    microCopy: 'No charge until day 8 · Cancel anytime',
    features: [
      'Unlimited AI health questions',
      '50+ destination guides',
      'Diet travel planner',
      'PDF meal plan downloads',
      'Priority email support',
      'Cancel anytime',
    ],
  },
]

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
  return (
    <section id="pricing" className="bg-[#F1EFE8] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#085041] mb-4" style={{ letterSpacing: '0.01em', lineHeight: '1.3', fontWeight: '600' }}>
            Simple, transparent pricing
          </h2>
          <p className="text-[#5F5E5A] text-lg max-w-xl mx-auto">
            Start free — no credit card needed. Upgrade to Pro when you need unlimited access.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((p) => (
            <PricingCard
              key={p.plan}
              {...p}
              ctaNode={p.plan === 'Pro' ? (
                <CheckoutButton
                  className="btn-primary text-center font-semibold text-sm py-3 rounded-xl w-full bg-[#1D9E75] text-white hover:bg-[#0F6E56] transition-colors"
                  style={{ display: 'block', cursor: 'pointer', border: 'none' }}
                >
                  Start 7-day free trial
                </CheckoutButton>
              ) : undefined}
            />
          ))}
        </div>

        {/* Security badges — Improvement 8B */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
          {securityBadges.map(badge => (
            <div key={badge.text} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#888780' }}>
              {badge.icon}
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
