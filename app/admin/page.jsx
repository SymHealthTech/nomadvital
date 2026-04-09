import AdminHeader from '@/components/admin/AdminHeader'
import MetricCard from '@/components/admin/MetricCard'

export default function AdminDashboard() {
  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Overview of NomadVital activity" />
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Total Users" value="—" sub="Loading..." />
          <MetricCard label="Pro Subscribers" value="—" sub="Loading..." color="#EF9F27" />
          <MetricCard label="Destinations" value="—" sub="Published guides" />
          <MetricCard label="Blog Posts" value="—" sub="Published articles" color="#085041" />
        </div>

        <div className="mt-8 bg-white rounded-xl border border-[#D3D1C7] p-6">
          <h2 className="text-base font-bold text-[#085041] mb-2">Welcome to Admin Panel</h2>
          <p className="text-sm text-[#5F5E5A]">
            Use the sidebar to manage users, destination guides, blog posts, reviews, and revenue.
            Connect your MongoDB and Stripe credentials in <code className="bg-[#F1EFE8] px-1 rounded">.env.local</code> to see live data.
          </p>
        </div>
      </div>
    </div>
  )
}
