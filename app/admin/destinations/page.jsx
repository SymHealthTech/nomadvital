import AdminHeader from '@/components/admin/AdminHeader'
import Link from 'next/link'

export default function AdminDestinationsPage() {
  return (
    <div>
      <AdminHeader title="Destinations" subtitle="Manage destination health guides" />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Link
            href="/admin/destinations/new"
            className="bg-[#1D9E75] hover:bg-[#085041] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + New destination
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-[#D3D1C7] p-6 text-center text-[#888780] text-sm">
          Destination guides list — coming soon. Connect MongoDB to see live data.
        </div>
      </div>
    </div>
  )
}
