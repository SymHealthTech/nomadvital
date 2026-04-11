'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { travelerPersonas } from '@/lib/travelerPersonas'

function UserAvatar({ name, plan }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#1D9E75',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        color: '#fff',
        flexShrink: 0,
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
      }}>
        {initials}
      </div>
      {plan === 'pro' && (
        <span style={{
          background: '#E1F5EE',
          color: '#1D9E75',
          fontSize: '10px',
          fontWeight: '700',
          padding: '2px 7px',
          borderRadius: '20px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}>
          Pro
        </span>
      )}
    </div>
  )
}

export default function Navbar() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileForOpen, setMobileForOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isLoggedIn = status === 'authenticated'
  const user = session?.user
  const dashboardHref = user?.role === 'admin' ? '/admin' : '/dashboard'

  return (
    <nav className="bg-[#085041] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '34px', height: '34px', backgroundColor: '#1D9E75', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
              <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
              <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', letterSpacing: '-0.5px', color: '#E1F5EE', fontWeight: 700 }}>
            Nomad<span style={{ fontWeight: 400, fontStyle: 'italic', color: '#5DCAA5' }}>Vital</span>
          </span>
        </Link>

        {/* Desktop Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/destinations" className="hover:text-[#5DCAA5] transition-colors">
            Destinations
          </Link>

          {/* For Travelers dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              style={{
                background: 'none',
                border: 'none',
                color: dropdownOpen ? '#5DCAA5' : 'inherit',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 0 16px',
                marginBottom: '-12px',
                fontFamily: 'inherit',
                transition: 'color 0.15s',
              }}
              className="hover:text-[#5DCAA5]"
            >
              For Travelers
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: 'transform 0.15s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#fff',
                border: '0.5px solid #D3D1C7',
                borderRadius: '10px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                minWidth: '230px',
                padding: '6px',
                zIndex: 100,
              }}>
                {travelerPersonas.map((persona) => (
                  <Link key={persona.id} href={persona.pageUrl} style={{ textDecoration: 'none' }} onClick={() => setDropdownOpen(false)}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '7px', cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#E1F5EE'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: persona.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: '#085041', fontWeight: '500', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                        {persona.emoji} {persona.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog" className="hover:text-[#5DCAA5] transition-colors">Blog</Link>
          <Link href="/pricing" className="hover:text-[#5DCAA5] transition-colors">Pricing</Link>
          <Link href="/ask" className="hover:text-[#5DCAA5] transition-colors">AI Advisor</Link>
        </div>

        {/* Desktop auth area */}
        <div className="hidden md:flex items-center gap-3">
          {status === 'loading' ? (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0F6E56' }} />
          ) : isLoggedIn ? (
            <div style={{ position: 'relative' }}
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0 16px', marginBottom: '-12px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <UserAvatar name={user?.name} plan={user?.plan} />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: '#9FE1CB', transition: 'transform 0.15s', transform: userMenuOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: '#fff',
                  border: '0.5px solid #D3D1C7',
                  borderRadius: '10px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  minWidth: '180px',
                  padding: '6px',
                  zIndex: 100,
                }}>
                  <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid #F1EFE8', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#085041', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                      {user?.name?.split(' ')[0] || 'Account'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                      {user?.plan === 'pro' ? '✦ Pro plan' : 'Free plan'}
                    </div>
                  </div>
                  {[
                    { href: dashboardHref, label: 'Dashboard' },
                    { href: '/ask', label: 'AI Advisor' },
                    { href: '/pricing', label: user?.plan === 'pro' ? 'Manage subscription' : 'Upgrade to Pro' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setUserMenuOpen(false)}>
                      <div
                        style={{ padding: '8px 12px', borderRadius: '7px', fontSize: '13px', color: '#085041', fontFamily: 'var(--font-inter, Inter, sans-serif)', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#E1F5EE'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {item.label}
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={() => signOut({ redirect: false }).then(() => { window.location.href = '/' })}
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px 12px', borderRadius: '7px', fontSize: '13px', color: '#B91C1C', cursor: 'pointer', fontFamily: 'var(--font-inter, Inter, sans-serif)', marginTop: '2px' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-[#5DCAA5] transition-colors">
                Sign in
              </Link>
              <Link href="/guest" className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Start free
              </Link>
            </>
          )}
        </div>

        {/* Mobile: right side */}
        <div className="md:hidden flex items-center gap-3">
          {isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
              >
                <UserAvatar name={user?.name} plan={user?.plan} />
              </button>
              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: '#fff', border: '0.5px solid #D3D1C7',
                  borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  minWidth: '180px', padding: '6px', zIndex: 100,
                }}>
                  <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid #F1EFE8', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#085041', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                      {user?.name?.split(' ')[0] || 'Account'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                      {user?.plan === 'pro' ? '✦ Pro plan' : 'Free plan'}
                    </div>
                  </div>
                  {[
                    { href: dashboardHref, label: 'Dashboard' },
                    { href: '/ask', label: 'AI Advisor' },
                    { href: '/pricing', label: user?.plan === 'pro' ? 'Manage subscription' : 'Upgrade to Pro' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setUserMenuOpen(false)}>
                      <div style={{ padding: '8px 12px', borderRadius: '7px', fontSize: '13px', color: '#085041', fontFamily: 'var(--font-inter, Inter, sans-serif)', cursor: 'pointer' }}
                        onTouchStart={e => e.currentTarget.style.background = '#E1F5EE'}
                        onTouchEnd={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {item.label}
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={() => { setUserMenuOpen(false); signOut({ redirect: false }).then(() => { window.location.href = '/' }) }}
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px 12px', borderRadius: '7px', fontSize: '13px', color: '#B91C1C', cursor: 'pointer', fontFamily: 'var(--font-inter, Inter, sans-serif)', marginTop: '2px' }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/guest" style={{ background: '#1D9E75', color: 'white', fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '20px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Start free
            </Link>
          )}
          <button
            className="text-white"
            onClick={() => { setMenuOpen(!menuOpen); setUserMenuOpen(false) }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#0F6E56] px-4 py-4 flex flex-col gap-3 text-sm font-medium">
          <Link href="/destinations" onClick={() => setMenuOpen(false)}>Destinations</Link>

          {/* Mobile: For Travelers accordion */}
          <div>
            <button
              onClick={() => setMobileForOpen(!mobileForOpen)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, fontFamily: 'inherit', width: '100%', textAlign: 'left' }}
            >
              For Travelers
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: 'transform 0.15s', transform: mobileForOpen ? 'rotate(180deg)' : 'none' }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {mobileForOpen && (
              <div style={{ marginTop: '8px', paddingLeft: '12px', borderLeft: '2px solid #0F6E56', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {travelerPersonas.map((persona) => (
                  <Link
                    key={persona.id}
                    href={persona.pageUrl}
                    onClick={() => { setMenuOpen(false); setMobileForOpen(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 8px', borderRadius: '7px', textDecoration: 'none', color: '#E1F5EE', fontSize: '13px' }}
                  >
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: persona.color, flexShrink: 0 }} />
                    {persona.emoji} {persona.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/ask" onClick={() => setMenuOpen(false)}>AI Advisor</Link>
          <hr className="border-[#0F6E56]" />

          {isLoggedIn ? (
            <>
              <Link href={dashboardHref} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button
                onClick={() => { setMenuOpen(false); signOut({ redirect: false }).then(() => { window.location.href = '/' }) }}
                style={{ background: 'none', border: 'none', color: '#9FE1CB', fontSize: '14px', fontWeight: '500', cursor: 'pointer', padding: 0, textAlign: 'left', fontFamily: 'inherit' }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link href="/guest" onClick={() => setMenuOpen(false)} className="bg-[#1D9E75] text-white text-center px-4 py-2 rounded-lg font-semibold">
                Start free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
