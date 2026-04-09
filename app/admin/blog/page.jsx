import AdminHeader from '@/components/admin/AdminHeader'
import Link from 'next/link'

export default function AdminBlogPage() {
  return (
    <div>
      <AdminHeader title="Blog" subtitle="Manage blog articles" />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Link
            href="/admin/blog/new"
            className="bg-[#1D9E75] hover:bg-[#085041] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + New article
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-[#D3D1C7] p-6 text-center text-[#888780] text-sm">
          Blog posts list — coming soon. Connect MongoDB to see live data.
        </div>
      </div>
    </div>
  )
}
