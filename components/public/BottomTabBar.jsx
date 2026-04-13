'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  {
    href: '/destinations',
    label: 'Explore',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#085041' : '#9B9A96'} strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 3a14.5 14.5 0 000 18M12 3a14.5 14.5 0 010 18"/>
        <path d="M3 12h18"/>
      </svg>
    ),
    isActive: (p) => p.startsWith('/destinations'),
  },
  {
    href: '/planner',
    label: 'Planner',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#085041' : '#9B9A96'} strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
      </svg>
    ),
    isActive: (p) => p.startsWith('/planner'),
  },
  {
    href: '/ask',
    label: 'Ask AI',
    center: true,
    icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        <path d="M12 8v4M12 16h.01" strokeWidth="2.5"/>
      </svg>
    ),
    isActive: (p) => p === '/ask',
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#085041' : '#9B9A96'} strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
    ),
    isActive: (p) => p.startsWith('/blog'),
  },
  {
    href: '/dashboard',
    label: 'Me',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#085041' : '#9B9A96'} strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
    isActive: (p) => p === '/dashboard',
  },
]

export default function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="pwa-bottom-bar" aria-label="Main navigation">
      {TABS.map((tab) => {
        const active = tab.isActive(pathname)

        if (tab.center) {
          return (
            <Link key={tab.label} href={tab.href} className="pwa-tab-center"
              aria-label={tab.label} aria-current={active ? 'page' : undefined}>
              <div className={`pwa-tab-fab${active ? ' pwa-tab-fab-active' : ''}`}>
                {tab.icon(active)}
              </div>
              <span className="pwa-tab-fab-label">{tab.label}</span>
            </Link>
          )
        }

        return (
          <Link key={tab.label} href={tab.href} className="pwa-tab"
            aria-current={active ? 'page' : undefined}>
            <div className={`pwa-tab-icon${active ? ' pwa-tab-icon-active' : ''}`}>
              {tab.icon(active)}
            </div>
            <span className={`pwa-tab-label${active ? ' pwa-tab-label-active' : ''}`}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
