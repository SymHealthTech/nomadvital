import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminBlogEditPage({ params }) {
  const isNew = params.id === 'new'
  return (
    <div>
      <AdminHeader
        title={isNew ? 'New Article' : 'Edit Article'}
        subtitle={isNew ? 'Write a new blog post' : `Editing post #${params.id}`}
      />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-[#D3D1C7] p-6 text-center text-[#888780] text-sm">
          Blog post editor — coming soon.
        </div>
      </div>
    </div>
  )
}
