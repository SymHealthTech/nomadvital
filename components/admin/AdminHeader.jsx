export default function AdminHeader({ title, subtitle }) {
  return (
    <div className="border-b border-[#D3D1C7] bg-white px-6 py-4">
      <h1 className="text-xl font-bold text-[#085041]">{title}</h1>
      {subtitle && <p className="text-sm text-[#888780] mt-0.5">{subtitle}</p>}
    </div>
  )
}
