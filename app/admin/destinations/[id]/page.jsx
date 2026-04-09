import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminDestinationEditPage({ params }) {
  const isNew = params.id === 'new'
  return (
    <div>
      <AdminHeader
        title={isNew ? 'New Destination' : 'Edit Destination'}
        subtitle={isNew ? 'Create a new destination health guide' : `Editing guide #${params.id}`}
      />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-[#D3D1C7] p-6 text-center text-[#888780] text-sm">
          Destination editor form — coming soon.
        </div>
      </div>
    </div>
  )
}
