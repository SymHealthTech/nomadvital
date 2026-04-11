import AdminHeader from '@/components/admin/AdminHeader'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

function formatCurrency(amount) {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function formatCurrencyCents(amount) {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

async function loadStats() {
  try {
    await connectDB()

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [totalUsers, proUsers, questionsAgg, newSignupsThisWeek, recentSignupsRaw] = await Promise.all([
      User.countDocuments({ isGuest: { $ne: true } }),
      User.countDocuments({ isGuest: { $ne: true }, plan: 'pro' }),
      User.aggregate([
        { $match: { lastQuestionDate: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: '$dailyQuestionCount' } } },
      ]),
      User.countDocuments({ isGuest: { $ne: true }, createdAt: { $gte: sevenDaysAgo } }),
      User.find({ isGuest: { $ne: true } })
        .select('name email plan createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ])

    const questionsToday = questionsAgg[0]?.total || 0
    const monthlyRevenue = proUsers * 12
    const apiCostToday = questionsToday * 0.004

    const recentSignups = recentSignupsRaw.map((u) => ({
      name: u.name,
      email: u.email,
      plan: u.plan,
      createdAt: u.createdAt ? u.createdAt.toISOString() : null,
    }))

    return {
      ok: true,
      totalUsers,
      proUsers,
      monthlyRevenue,
      questionsToday,
      apiCostToday,
      newSignupsThisWeek,
      recentSignups,
    }
  } catch (err) {
    console.error('admin/page loadStats:', err)
    return { ok: false }
  }
}

export default async function AdminDashboard() {
  const stats = await loadStats()

  if (!stats.ok) {
    return (
      <div>
        <AdminHeader title="Dashboard" subtitle="Overview of NomadVital activity" />
        <div className="p-6">
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-6 text-center text-[#888780] text-sm">
            Unable to load dashboard metrics. Check the MongoDB connection and reload.
          </div>
        </div>
      </div>
    )
  }

  const metrics = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), sub: 'Registered (non-guest)' },
    { label: 'Pro Subscribers', value: stats.proUsers.toLocaleString(), sub: 'Paid plan' },
    { label: 'Monthly Revenue', value: formatCurrency(stats.monthlyRevenue), sub: '$12 × Pro users' },
    { label: 'AI Questions Today', value: stats.questionsToday.toLocaleString(), sub: 'Claude calls' },
    { label: 'Est. API Cost Today', value: formatCurrencyCents(stats.apiCostToday), sub: '$0.004 per question' },
    { label: 'New Signups (7d)', value: stats.newSignupsThisWeek.toLocaleString(), sub: 'Last 7 days' },
  ]

  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Overview of NomadVital activity" />
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white rounded-xl border border-[#D3D1C7] p-5 shadow-sm">
              <div className="text-xs font-bold text-[#888780] tracking-widest uppercase mb-2">{m.label}</div>
              <div className="text-3xl font-bold mb-1 text-[#085041]">{m.value}</div>
              <div className="text-xs text-[#888780]">{m.sub}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl border border-[#D3D1C7] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#D3D1C7]">
            <h2 className="text-base font-bold text-[#085041]">Recent Signups</h2>
            <p className="text-xs text-[#888780] mt-0.5">Last 10 registered users</p>
          </div>
          {stats.recentSignups.length === 0 ? (
            <div className="p-6 text-center text-sm text-[#888780]">No signups yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#F1EFE8] text-[#5F5E5A]">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Name</th>
                  <th className="text-left font-semibold px-5 py-3">Email</th>
                  <th className="text-left font-semibold px-5 py-3">Plan</th>
                  <th className="text-left font-semibold px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSignups.map((u, i) => (
                  <tr key={i} className="border-t border-[#EFEDE5]">
                    <td className="px-5 py-3 text-[#085041] font-medium">{u.name || '—'}</td>
                    <td className="px-5 py-3 text-[#5F5E5A]">{u.email || '—'}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          u.plan === 'pro'
                            ? 'bg-[#E1F5EE] text-[#1D9E75]'
                            : 'bg-[#F1EFE8] text-[#5F5E5A]'
                        }`}
                      >
                        {u.plan === 'pro' ? 'Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#5F5E5A]">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
