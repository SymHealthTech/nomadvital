import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'Admin — NomadVital',
}

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F1EFE8]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}
