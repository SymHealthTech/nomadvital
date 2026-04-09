'use client'

export default function ContentForm({ fields, onSubmit, submitLabel = 'Save', loading = false }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {fields.map((field, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#5F5E5A] uppercase tracking-widest">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              name={field.name}
              defaultValue={field.defaultValue || ''}
              required={field.required}
              rows={field.rows || 6}
              className="border border-[#D3D1C7] rounded-lg px-3 py-2 text-sm text-[#085041] resize-y focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            />
          ) : field.type === 'select' ? (
            <select
              name={field.name}
              defaultValue={field.defaultValue || ''}
              required={field.required}
              className="border border-[#D3D1C7] rounded-lg px-3 py-2 text-sm text-[#085041] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === 'checkbox' ? (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name={field.name}
                id={field.name}
                defaultChecked={field.defaultValue || false}
                className="w-4 h-4 accent-[#1D9E75]"
              />
              <label htmlFor={field.name} className="text-sm text-[#5F5E5A]">
                {field.checkboxLabel || field.label}
              </label>
            </div>
          ) : (
            <input
              type={field.type || 'text'}
              name={field.name}
              defaultValue={field.defaultValue || ''}
              required={field.required}
              placeholder={field.placeholder}
              className="border border-[#D3D1C7] rounded-lg px-3 py-2 text-sm text-[#085041] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="self-start bg-[#1D9E75] hover:bg-[#085041] disabled:opacity-60 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
