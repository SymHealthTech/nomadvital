import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import TravelerTypeCard from './TravelerTypeCard'
import ManageSubscriptionButton from './ManageSubscriptionButton'
import { Suspense } from 'react'
import PaymentSuccessRefresh from './PaymentSuccessRefresh'

export const metadata = {
  title: 'Dashboard — NomadVital',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const { name, email, plan, id, isGuest } = session.user
  const isPro = plan === 'pro'

  // Fetch live user data from DB (daily count + traveler type)
  let dailyCount = 0
  let travelerType = 'general'

  try {
    await connectDB()
    const dbUser = await User.findById(id).select('dailyQuestionCount lastQuestionDate travelerType')
    if (dbUser) {
      const today = new Date().toDateString()
      const lastDate = dbUser.lastQuestionDate
        ? new Date(dbUser.lastQuestionDate).toDateString()
        : null
      dailyCount = lastDate === today ? (dbUser.dailyQuestionCount ?? 0) : 0
      travelerType = dbUser.travelerType || 'general'
    }
  } catch {
    // non-fatal — fall back to defaults
  }

  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Suspense fallback={null}><PaymentSuccessRefresh /></Suspense>

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#1D9E75',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: '700',
          color: '#fff',
          flexShrink: 0,
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}>
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#085041]">
            Welcome{name ? ` ${name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-[#888780] text-sm">{email}</p>
        </div>
        <div className="ml-auto">
          <span style={{
            background: isPro ? '#E1F5EE' : '#F1EFE8',
            color: isPro ? '#1D9E75' : '#888780',
            fontSize: '11px',
            fontWeight: '700',
            padding: '4px 10px',
            borderRadius: '20px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
          }}>
            {isPro ? '✦ Pro' : 'Free'}
          </span>
        </div>
      </div>

      {/* Guest banner */}
      {isGuest && (
        <div style={{ background: '#E1F5EE', border: '1px solid #A8DFC3', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#085041', marginBottom: '2px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>You&apos;re browsing as a guest</p>
            <p style={{ fontSize: '12px', color: '#5F5E5A', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>Create a free account to save your progress and preferences.</p>
          </div>
          <Link href="/signup" style={{ background: '#085041', color: '#fff', fontSize: '13px', fontWeight: '600', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Create free account →
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Plan card — last on mobile so quick access shows first */}
        <div className="bg-white rounded-2xl border border-[#D3D1C7] p-6 order-last md:order-first">
          <div className="text-[11px] font-medium text-[#1D9E75] tracking-[2px] uppercase mb-2">
            Current Plan
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-[#085041]">{isPro ? 'Pro' : 'Free'}</span>
            {isPro && (
              <span className="bg-[#E1F5EE] text-[#1D9E75] text-xs font-semibold px-2.5 py-1 rounded-full">
                Active
              </span>
            )}
          </div>

          {isPro ? (
            <>
              <ul className="text-sm text-[#5F5E5A] space-y-1.5 mb-5">
                {['Unlimited AI health questions', '50+ destination guides', 'Diet travel planner', 'Priority email support'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-[#1D9E75]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <ManageSubscriptionButton />
            </>
          ) : (
            <>
              {/* Daily usage bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#5F5E5A', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                    AI questions today
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: dailyCount >= 3 ? '#B91C1C' : '#085041', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                    {dailyCount} / 3
                  </span>
                </div>
                <div style={{ height: '6px', background: '#F1EFE8', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min((dailyCount / 3) * 100, 100)}%`,
                    background: dailyCount >= 3 ? '#EF4444' : '#1D9E75',
                    borderRadius: '999px',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                {dailyCount >= 3 && (
                  <p style={{ fontSize: '11px', color: '#B91C1C', marginTop: '4px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                    Daily limit reached. Resets at midnight.
                  </p>
                )}
              </div>

              <ul className="text-sm text-[#5F5E5A] space-y-1.5 mb-5">
                <li className="flex items-center gap-2"><span className="text-[#1D9E75]">✓</span> 3 AI health questions/day</li>
                <li className="flex items-center gap-2"><span className="text-[#1D9E75]">✓</span> 5 destination guides</li>
                <li className="flex items-center gap-2 text-[#888780]"><span>✗</span> Diet travel planner</li>
                <li className="flex items-center gap-2 text-[#888780]"><span>✗</span> Priority email support</li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center bg-[#1D9E75] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#0F6E56] transition-colors"
              >
                Upgrade to Pro — from $8.25/mo
              </Link>
            </>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-[#D3D1C7] p-6">
          <div className="text-[11px] font-medium text-[#1D9E75] tracking-[2px] uppercase mb-4">
            Quick Access
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/ask', emoji: '🤖', label: 'AI Advisor' },
              { href: '/destinations', emoji: '🌍', label: 'Destinations' },
              { href: '/planner', emoji: '📋', label: 'Travel Planner' },
              { href: '/blog', emoji: '📖', label: 'Blog' },
            ].map(item => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 p-3 rounded-xl bg-[#F1EFE8] hover:bg-[#e8e5dc] transition-colors">
                <span className="text-xl">{item.emoji}</span>
                <span className="text-sm font-medium text-[#085041]">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Support note */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F1EFE8' }}>
            <p style={{ fontSize: '12px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              {isPro ? 'Priority support: ' : 'Questions? '}
              <a href="mailto:contact@nomadvital.com" style={{ color: '#1D9E75', textDecoration: 'none' }}>
                contact@nomadvital.com
              </a>
            </p>
          </div>
        </div>

        {/* Traveler type selector — client component */}
        <TravelerTypeCard initialTravelerType={travelerType} />
      </div>
    </div>
  )
}
