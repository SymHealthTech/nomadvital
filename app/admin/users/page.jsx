import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminUsersPage() {
  return (
    <div>
      <AdminHeader title="Users" subtitle="Manage registered users and plans" />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-[#D3D1C7] p-6 text-center text-[#888780] text-sm">
          User management table — coming soon. Connect MongoDB to see live data.
        </div>
      </div>
    </div>
  )
}
