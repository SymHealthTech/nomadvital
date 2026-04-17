'use client'

import Link from 'next/link'

const CARDS = [
  {
    href: '/ask',
    emoji: '🤖',
    label: 'AI Advisor',
    desc: 'Ask health questions',
    gradient: 'linear-gradient(135deg, #E1F5EE 0%, #c8edd9 100%)',
    hoverGradient: 'linear-gradient(135deg, #c8edd9 0%, #a8dfc3 100%)',
    accent: '#085041',
  },
  {
    href: '/destinations',
    emoji: '🌍',
    label: 'Explore',
    desc: 'Destination guides',
    gradient: 'linear-gradient(135deg, #EAF4FF 0%, #d0e9ff 100%)',
    hoverGradient: 'linear-gradient(135deg, #d0e9ff 0%, #b0d6ff 100%)',
    accent: '#1A5FAB',
  },
  {
    href: '/planner',
    emoji: '📋',
    label: 'Planner',
    desc: 'Plan your travel diet',
    gradient: 'linear-gradient(135deg, #FFF7E6 0%, #FFE8BA 100%)',
    hoverGradient: 'linear-gradient(135deg, #FFE8BA 0%, #FFD580 100%)',
    accent: '#7A4E00',
  },
  {
    href: '/blog',
    emoji: '📖',
    label: 'Blog',
    desc: 'Travel health tips',
    gradient: 'linear-gradient(135deg, #F3EEFF 0%, #E2D4FF 100%)',
    hoverGradient: 'linear-gradient(135deg, #E2D4FF 0%, #C9B3FF 100%)',
    accent: '#4B2A8C',
  },
]

function Card({ href, emoji, label, desc, gradient, hoverGradient, accent }) {
  return (
    <Link
      href={href}
      style={{ background: gradient, textDecoration: 'none' }}
      className="flex flex-col items-start p-4 rounded-2xl transition-all duration-200 active:scale-95"
      onMouseEnter={e => {
        e.currentTarget.style.background = hoverGradient
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = gradient
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <span style={{
        fontSize: '34px',
        lineHeight: '1',
        marginBottom: '10px',
        display: 'block',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.10))',
      }}>
        {emoji}
      </span>
      <span style={{
        fontSize: '14px',
        fontWeight: '700',
        color: accent,
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
        lineHeight: '1.2',
        marginBottom: '4px',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '11px',
        fontWeight: '400',
        color: accent,
        opacity: 0.65,
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
        lineHeight: '1.3',
      }}>
        {desc}
      </span>
    </Link>
  )
}

export default function QuickAccessCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CARDS.map(card => (
        <Card key={card.href} {...card} />
      ))}
    </div>
  )
}
