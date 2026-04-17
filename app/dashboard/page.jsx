import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import TravelerTypeCard from './TravelerTypeCard'
import ManageSubscriptionButton from './ManageSubscriptionButton'
import SignOutButton from './SignOutButton'
import { Suspense } from 'react'
import PaymentSuccessRefresh from './PaymentSuccessRefresh'
import PWAInstallModal from '@/components/public/PWAInstallModal'
import ProfileAvatar from './ProfileAvatar'
import QuickAccessCards from './QuickAccessCards'

export const metadata = {
  title: 'Dashboard — NomadVital',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const { name, email, plan, id, isGuest } = session.user
  const isPro = plan === 'pro'

  let dailyCount = 0
  let travelerType = 'general'
  let profileImage = null

  try {
    await connectDB()
    const dbUser = await User.findById(id).select('dailyQuestionCount lastQuestionDate travelerType profileImage')
    if (dbUser) {
      const today = new Date().toDateString()
      const lastDate = dbUser.lastQuestionDate
        ? new Date(dbUser.lastQuestionDate).toDateString()
        : null
      dailyCount = lastDate === today ? (dbUser.dailyQuestionCount ?? 0) : 0
      travelerType = dbUser.travelerType || 'general'
      profileImage = dbUser.profileImage || null
    }
  } catch {
    // non-fatal
  }

  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="dashboard-page max-w-4xl mx-auto px-4 py-8">
      <Suspense fallback={null}><PaymentSuccessRefresh /></Suspense>
      <PWAInstallModal />

      {/* Header — avatar + name + plan badge */}
      <div className="flex items-center gap-4 mb-4">
        <ProfileAvatar initials={initials} isPro={isPro} initialImage={profileImage} />
        <div>
          <h1 className="text-xl font-bold text-[#085041]">
            Welcome{name ? `, ${name.split(' ')[0]}` : ''}
          </h1>
          <span style={{
            display: 'inline-block',
            background: isPro ? '#E1F5EE' : '#F1EFE8',
            color: isPro ? '#1D9E75' : '#888780',
            fontSize: '11px', fontWeight: '700',
            padding: '2px 9px', borderRadius: '20px',
            letterSpacing: '0.5px', textTransform: 'uppercase',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            marginTop: '2px',
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
            <p style={{ fontSize: '12px', color: '#5F5E5A', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>Create a free account to save your progress.</p>
          </div>
          <Link href="/signup" style={{ background: '#085041', color: '#fff', fontSize: '13px', fontWeight: '600', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Create free account →
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Plan card */}
        <div className="bg-white rounded-2xl border border-[#D3D1C7] p-6 order-last md:order-first">
          <div className="text-[11px] font-medium text-[#1D9E75] tracking-[2px] uppercase mb-2">
            Current Plan
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-[#085041]">{isPro ? 'Pro' : 'Free'}</span>
            {isPro && (
              <span className="bg-[#E1F5EE] text-[#1D9E75] text-xs font-semibold px-2.5 py-1 rounded-full">Active</span>
            )}
          </div>

          {isPro ? (
            <>
              <ul className="text-sm text-[#5F5E5A] space-y-1.5 mb-5">
                {[
                  'Unlimited AI health questions',
                  '50+ destination guides',
                  'Diet travel planner — unlimited',
                  'All blog posts',
                  'Priority email support',
                ].map(f => (
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
                    Daily questions used
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
                {dailyCount >= 3 ? (
                  <p style={{ fontSize: '11px', color: '#B91C1C', marginTop: '4px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                    Daily limit reached — resets at midnight.
                  </p>
                ) : (
                  <p style={{ fontSize: '11px', color: '#888780', marginTop: '4px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                    AI Advisor: 3/day · Planner: 1/day (separate limits)
                  </p>
                )}
              </div>

              <ul className="text-sm text-[#5F5E5A] space-y-1.5 mb-5">
                <li className="flex items-center gap-2"><span className="text-[#1D9E75]">✓</span> 3 AI questions per day</li>
                <li className="flex items-center gap-2"><span className="text-[#1D9E75]">✓</span> Diet travel planner (1/day)</li>
                <li className="flex items-center gap-2"><span className="text-[#1D9E75]">✓</span> 5 destination guides</li>
                <li className="flex items-center gap-2"><span className="text-[#1D9E75]">✓</span> All blog posts — free</li>
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

        {/* Quick Access */}
        <div className="bg-white rounded-2xl border border-[#D3D1C7] p-6">
          <div className="text-[11px] font-medium text-[#1D9E75] tracking-[2px] uppercase mb-4">
            Quick Access
          </div>
          <QuickAccessCards />
        </div>

        {/* Traveler type selector */}
        <TravelerTypeCard initialTravelerType={travelerType} />

      </div>

      {/* ── Account details + sign-out — always at the bottom ── */}
      <div className="mt-8 bg-white rounded-2xl border border-[#D3D1C7] p-6">
        <div className="text-[11px] font-medium text-[#1D9E75] tracking-[2px] uppercase mb-4">
          Account
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#888780]" style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>Name</span>
            <span className="font-medium text-[#085041]" style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>{name || '—'}</span>
          </div>

          {/* Email only shown for Pro users */}
          {isPro && email && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#888780]" style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>Email</span>
              <span className="font-medium text-[#085041] truncate max-w-[60%]" style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>{email}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <span className="text-[#888780]" style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>Plan</span>
            <span style={{
              background: isPro ? '#E1F5EE' : '#F1EFE8',
              color: isPro ? '#1D9E75' : '#888780',
              fontSize: '11px', fontWeight: '700',
              padding: '2px 9px', borderRadius: '20px',
              letterSpacing: '0.5px', textTransform: 'uppercase',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}>
              {isPro ? '✦ Pro' : 'Free'}
            </span>
          </div>

          {/* Support email — Pro users only */}
          {isPro && (
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-[#888780]" style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>Support</span>
              <a href="mailto:contact@nomadvital.com"
                style={{ color: '#1D9E75', textDecoration: 'none', fontSize: '13px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                contact@nomadvital.com
              </a>
            </div>
          )}
        </div>

        <SignOutButton />
      </div>

    </div>
  )
}
