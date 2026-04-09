import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminRevenuePage() {
  return (
    <div>
      <AdminHeader title="Revenue" subtitle="Stripe revenue and subscription overview" />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-[#D3D1C7] p-6 text-center text-[#888780] text-sm">
          Revenue dashboard — coming soon. Connect Stripe credentials in .env.local to see live data.
        </div>
      </div>
    </div>
  )
}
