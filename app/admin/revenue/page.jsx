import AdminHeader from '@/components/admin/AdminHeader'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

function formatCurrency(amount) {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

async function loadRevenue() {
  try {
    await connectDB()

    const proUsers = await User.countDocuments({ isGuest: { $ne: true }, plan: 'pro' })
    const mrr = proUsers * 12
    const arr = proUsers * 99

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setHours(0, 0, 0, 0)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)

    const signupsAgg = await User.aggregate([
      { $match: { isGuest: { $ne: true }, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ])

    const countsByDate = new Map(signupsAgg.map((s) => [s._id, s.count]))
    const signupsByDay = []
    for (let i = 0; i < 30; i += 1) {
      const d = new Date(thirtyDaysAgo)
      d.setDate(thirtyDaysAgo.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      signupsByDay.push({ date: key, count: countsByDate.get(key) || 0 })
    }

    return { ok: true, proUsers, mrr, arr, signupsByDay }
  } catch (err) {
    console.error('admin/revenue loadRevenue:', err)
    return { ok: false }
  }
}

export default async function AdminRevenuePage() {
  const data = await loadRevenue()

  if (!data.ok) {
    return (
      <div>
        <AdminHeader title="Revenue" subtitle="Subscription & growth metrics" />
        <div className="p-6">
          <div className="bg-white rounded-xl border border-[#D85A30]/40 p-6 text-sm text-[#D85A30]">
            Unable to load revenue data. Check the MongoDB connection.
          </div>
        </div>
      </div>
    )
  }

  const reversedSignups = [...data.signupsByDay].reverse()

  return (
    <div>
      <AdminHeader title="Revenue" subtitle="Subscription & growth metrics" />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 shadow-sm">
            <div className="text-xs font-bold text-[#888780] tracking-widest uppercase mb-2">MRR</div>
            <div className="text-3xl font-bold mb-1 text-[#085041]">{formatCurrency(data.mrr)}</div>
            <div className="text-xs text-[#888780]">$12 × {data.proUsers} Pro users</div>
          </div>
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 shadow-sm">
            <div className="text-xs font-bold text-[#888780] tracking-widest uppercase mb-2">ARR</div>
            <div className="text-3xl font-bold mb-1 text-[#085041]">{formatCurrency(data.arr)}</div>
            <div className="text-xs text-[#888780]">$99 × {data.proUsers} Pro users</div>
          </div>
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 shadow-sm">
            <div className="text-xs font-bold text-[#888780] tracking-widest uppercase mb-2">Active Pro</div>
            <div className="text-3xl font-bold mb-1 text-[#085041]">{data.proUsers.toLocaleString()}</div>
            <div className="text-xs text-[#888780]">Current Pro subscribers</div>
          </div>
        </div>

        <div className="bg-[#E1F5EE] border border-[#1D9E75]/30 rounded-xl p-4 mb-6 text-sm text-[#085041]">
          <strong>Note:</strong> Figures above are derived from MongoDB subscriber counts. Connect the{' '}
          <a
            href="https://dodopayments.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            Dodo Payments dashboard
          </a>{' '}
          for real transaction data, refunds, and churn metrics.
        </div>

        <div className="bg-white rounded-xl border border-[#D3D1C7] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#D3D1C7]">
            <h2 className="text-base font-bold text-[#085041]">Signups — last 30 days</h2>
            <p className="text-xs text-[#888780] mt-0.5">New non-guest accounts per day</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F1EFE8] text-[#5F5E5A] sticky top-0">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Date</th>
                  <th className="text-right font-semibold px-5 py-3">Signups</th>
                </tr>
              </thead>
              <tbody>
                {reversedSignups.map((row) => (
                  <tr key={row.date} className="border-t border-[#EFEDE5]">
                    <td className="px-5 py-2 text-[#5F5E5A]">
                      {new Date(row.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-2 text-right font-semibold text-[#085041]">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
