export default function DataTable({ columns, rows, emptyMessage = 'No data found.' }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#D3D1C7] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#D3D1C7] bg-[#F1EFE8]">
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-left text-xs font-bold text-[#888780] tracking-widest uppercase px-4 py-3"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10 text-[#888780]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-b border-[#F1EFE8] hover:bg-[#F1EFE8] transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-[#5F5E5A]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
