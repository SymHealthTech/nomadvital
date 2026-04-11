'use client'

import { useEffect, useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

const emptyForm = { name: '', detail: '', quote: '', isVisible: true }

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState(emptyForm)
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [addError, setAddError] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  async function fetchReviews() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/reviews')
      if (!res.ok) throw new Error('Failed to load reviews.')
      const data = await res.json()
      setReviews(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load reviews.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  async function toggleVisibility(r) {
    setActionLoading(r._id + 'vis')
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: r._id, isVisible: !r.isVisible }),
      })
      if (!res.ok) throw new Error()
      await fetchReviews()
    } catch {
      alert('Failed to update review.')
    } finally {
      setActionLoading('')
    }
  }

  async function deleteReview(r) {
    if (!confirm('Permanently delete this review?')) return
    setActionLoading(r._id + 'del')
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: r._id }),
      })
      if (!res.ok) throw new Error()
      await fetchReviews()
    } catch {
      alert('Failed to delete review.')
    } finally {
      setActionLoading('')
    }
  }

  async function handleAddSubmit(e) {
    e.preventDefault()
    setAddError('')
    setAddSubmitting(true)
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add review.')
      setAddForm(emptyForm)
      setShowAddForm(false)
      await fetchReviews()
    } catch (err) {
      setAddError(err.message || 'Failed to add review.')
    } finally {
      setAddSubmitting(false)
    }
  }

  const inputClass =
    'w-full text-sm border border-[#D3D1C7] rounded-lg px-3 py-2 bg-white text-[#085041] outline-none focus:border-[#1D9E75]'

  return (
    <div>
      <AdminHeader title="Reviews" subtitle="Manage homepage testimonials" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-[#888780]">
            {loading ? 'Loading…' : `${reviews.length} reviews`}
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="bg-[#1D9E75] hover:bg-[#17876a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Add Review
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white border border-[#C0DD97] rounded-xl p-5 mb-5">
            <h3 className="text-sm font-bold text-[#085041] mb-4">Add review</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-bold text-[#5F5E5A] uppercase tracking-wide mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5F5E5A] uppercase tracking-wide mb-1">
                    Detail
                  </label>
                  <input
                    type="text"
                    value={addForm.detail}
                    onChange={(e) => setAddForm({ ...addForm, detail: e.target.value })}
                    placeholder="Marathon runner, USA"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-bold text-[#5F5E5A] uppercase tracking-wide mb-1">
                  Quote
                </label>
                <textarea
                  rows={3}
                  required
                  value={addForm.quote}
                  onChange={(e) => setAddForm({ ...addForm, quote: e.target.value })}
                  className={inputClass}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="rev-visible"
                  checked={addForm.isVisible}
                  onChange={(e) => setAddForm({ ...addForm, isVisible: e.target.checked })}
                  className="accent-[#1D9E75]"
                />
                <label htmlFor="rev-visible" className="text-sm text-[#5F5E5A]">
                  Show on homepage
                </label>
              </div>
              {addError && <p className="text-[#D85A30] text-xs mb-3">{addError}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="bg-[#085041] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#063d30] transition-colors disabled:opacity-60"
                >
                  {addSubmitting ? 'Adding…' : 'Add review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setAddError('')
                  }}
                  className="text-sm text-[#888780] hover:text-[#5F5E5A] px-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-10 text-center">
            <div className="inline-block w-6 h-6 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-[#888780] mt-2">Loading reviews…</div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border border-[#D85A30]/40 p-6 text-sm text-[#D85A30]">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-8 text-center text-sm text-[#888780]">
            No reviews yet. Click "Add Review" to create one.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#D3D1C7] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F1EFE8] text-[#5F5E5A]">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Name</th>
                  <th className="text-left font-semibold px-5 py-3">Detail</th>
                  <th className="text-left font-semibold px-5 py-3">Quote</th>
                  <th className="text-left font-semibold px-5 py-3">Visible</th>
                  <th className="text-right font-semibold px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r._id} className="border-t border-[#EFEDE5]">
                    <td className="px-5 py-3 text-[#085041] font-medium">{r.name}</td>
                    <td className="px-5 py-3 text-[#5F5E5A]">{r.detail || '—'}</td>
                    <td className="px-5 py-3 text-[#5F5E5A] max-w-md">
                      <div className="line-clamp-2">"{r.quote}"</div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          r.isVisible
                            ? 'bg-[#E1F5EE] text-[#1D9E75]'
                            : 'bg-[#F1EFE8] text-[#5F5E5A]'
                        }`}
                      >
                        {r.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={!!actionLoading}
                          onClick={() => toggleVisibility(r)}
                          className="text-xs bg-[#085041] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#063d30] transition-colors disabled:opacity-60"
                        >
                          {r.isVisible ? 'Hide' : 'Show'}
                        </button>
                        <button
                          type="button"
                          disabled={!!actionLoading}
                          onClick={() => deleteReview(r)}
                          className="text-xs bg-[#D85A30] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#c04e28] transition-colors disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
