import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import connectDB from '@/lib/mongodb'
import Destination from '@/models/Destination'

export const dynamic = 'force-dynamic'

async function loadDestinations() {
  try {
    await connectDB()
    const list = await Destination.find().sort({ createdAt: -1 }).lean()
    return { ok: true, list }
  } catch (err) {
    console.error('admin/destinations loadDestinations:', err)
    return { ok: false, list: [] }
  }
}

export default async function AdminDestinationsPage() {
  const { ok, list } = await loadDestinations()

  return (
    <div>
      <AdminHeader title="Destinations" subtitle="Manage destination health guides" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-[#888780]">
            {ok ? `${list.length} destinations` : 'Unable to load destinations'}
          </div>
          <Link
            href="/admin/destinations/new"
            className="bg-[#1D9E75] hover:bg-[#085041] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Add New
          </Link>
        </div>

        {!ok ? (
          <div className="bg-white rounded-xl border border-[#D85A30]/40 p-6 text-sm text-[#D85A30]">
            Unable to load destinations. Check the MongoDB connection.
          </div>
        ) : list.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-8 text-center text-sm text-[#888780]">
            No destinations yet. Click "Add New" to create one.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#D3D1C7] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F1EFE8] text-[#5F5E5A]">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Name</th>
                  <th className="text-left font-semibold px-5 py-3">Slug</th>
                  <th className="text-left font-semibold px-5 py-3">Tier</th>
                  <th className="text-left font-semibold px-5 py-3">Status</th>
                  <th className="text-left font-semibold px-5 py-3">Rating</th>
                  <th className="text-right font-semibold px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((d) => (
                  <tr key={d._id} className="border-t border-[#EFEDE5]">
                    <td className="px-5 py-3 text-[#085041] font-medium">{d.name}</td>
                    <td className="px-5 py-3 text-[#5F5E5A] font-mono text-xs">{d.slug}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          d.isFree
                            ? 'bg-[#F1EFE8] text-[#5F5E5A]'
                            : 'bg-[#E1F5EE] text-[#1D9E75]'
                        }`}
                      >
                        {d.isFree ? 'Free' : 'Pro'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          d.isPublished
                            ? 'bg-[#E1F5EE] text-[#1D9E75]'
                            : 'bg-[#FFF8E1] text-[#F9A825]'
                        }`}
                      >
                        {d.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#5F5E5A]">
                      {d.averageRating ? `${d.averageRating.toFixed(1)} (${d.totalRatings || 0})` : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/destinations/${d._id}`}
                        className="text-xs bg-[#085041] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#063d30] transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
