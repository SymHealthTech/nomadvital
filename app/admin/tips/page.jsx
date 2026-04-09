'use client'

import { useEffect, useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

const DESTINATIONS = [
  { value: '', label: 'All destinations' },
  { value: 'thailand', label: 'Thailand' },
  { value: 'japan', label: 'Japan' },
  { value: 'italy', label: 'Italy' },
  { value: 'mexico', label: 'Mexico' },
]

const emptyForm = {
  destination: 'thailand',
  destinationName: 'Thailand',
  authorName: '',
  authorCity: '',
  healthCondition: '',
  tipText: '',
  submittedViaEmail: false,
}

export default function AdminTipsPage() {
  const [tab, setTab] = useState('pending')
  const [tips, setTips] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
  const [approvedCount, setApprovedCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [destFilter, setDestFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState(emptyForm)
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [addError, setAddError] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  async function fetchTips() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (destFilter) params.set('destination', destFilter)
      if (tab === 'pending') params.set('status', 'pending')
      else if (tab === 'approved') params.set('status', 'approved')
      const res = await fetch(`/api/admin/tips?${params}`)
      const data = await res.json()
      if (res.ok) {
        setTips(data.tips)
        setPendingCount(data.pendingCount)
        setApprovedCount(data.approvedCount)
        setTotal(data.total)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTips()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, destFilter])

  async function handleAction(tipId, action) {
    setActionLoading(tipId + action)
    try {
      const res = await fetch('/api/admin/tips', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipId, action }),
      })
      if (res.ok) fetchTips()
    } catch {
      // silent
    } finally {
      setActionLoading('')
    }
  }

  async function handleDelete(tipId) {
    if (!confirm('Permanently delete this tip?')) return
    setActionLoading(tipId + 'delete')
    try {
      const res = await fetch('/api/admin/tips', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipId }),
      })
      if (res.ok) fetchTips()
    } catch {
      // silent
    } finally {
      setActionLoading('')
    }
  }

  async function handleAddSubmit(e) {
    e.preventDefault()
    setAddError('')
    setAddSubmitting(true)
    try {
      const res = await fetch('/api/admin/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      })
      const data = await res.json()
      if (res.ok) {
        setAddForm(emptyForm)
        setShowAddForm(false)
        fetchTips()
      } else {
        setAddError(data.error || 'Failed to add tip.')
      }
    } catch {
      setAddError('Network error. Try again.')
    } finally {
      setAddSubmitting(false)
    }
  }

  function setAdd(field) {
    return (e) => {
      const val =
        field === 'submittedViaEmail'
          ? e.target.checked
          : field === 'tipText'
          ? e.target.value.slice(0, 280)
          : e.target.value

      const updated = { ...addForm, [field]: val }

      if (field === 'destination') {
        const match = DESTINATIONS.find((d) => d.value === val)
        updated.destinationName = match?.label ?? val
      }
      setAddForm(updated)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '7px 10px',
    fontSize: 13,
    border: '1px solid #D3D1C7',
    borderRadius: 7,
    outline: 'none',
    color: '#085041',
    background: '#fff',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  return (
    <div>
      <AdminHeader title="Traveler Tips" subtitle="Moderate and manage community experiences" />
      <div className="p-6">
        {/* Summary */}
        <div className="flex items-center gap-2 text-sm text-[#5F5E5A] mb-5">
          <span className="font-semibold text-[#D85A30]">{pendingCount} pending</span>
          <span>·</span>
          <span className="font-semibold text-[#1D9E75]">{approvedCount} approved</span>
          <span>·</span>
          <span>{total} total</span>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-[#D3D1C7] rounded-lg p-1">
            {[
              { key: 'pending', label: 'Pending review', badge: pendingCount },
              { key: 'approved', label: 'Approved' },
              { key: 'all', label: 'All' },
            ].map(({ key, label, badge }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  tab === key
                    ? 'bg-[#085041] text-white'
                    : 'text-[#5F5E5A] hover:bg-[#F1EFE8]'
                }`}
              >
                {label}
                {badge > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      tab === key ? 'bg-white text-[#085041]' : 'bg-[#D85A30] text-white'
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Destination filter */}
            <select
              value={destFilter}
              onChange={(e) => setDestFilter(e.target.value)}
              className="text-sm border border-[#D3D1C7] rounded-lg px-3 py-1.5 bg-white text-[#085041] outline-none"
            >
              {DESTINATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>

            {/* Add tip button */}
            <button
              type="button"
              onClick={() => setShowAddForm((v) => !v)}
              className="flex items-center gap-1.5 bg-[#1D9E75] text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-[#17876a] transition-colors"
            >
              <span>+</span> Add tip manually
            </button>
          </div>
        </div>

        {/* Add tip form */}
        {showAddForm && (
          <div className="bg-white border border-[#C0DD97] rounded-xl p-5 mb-5">
            <h3 className="text-sm font-bold text-[#085041] mb-4">Add tip manually</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-medium text-[#5F5E5A] block mb-1">Destination</label>
                  <select value={addForm.destination} onChange={setAdd('destination')} style={inputStyle}>
                    {DESTINATIONS.filter((d) => d.value).map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5F5E5A] block mb-1">Author name</label>
                  <input
                    type="text"
                    value={addForm.authorName}
                    onChange={setAdd('authorName')}
                    placeholder="e.g. Sarah M."
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5F5E5A] block mb-1">Author city</label>
                  <input
                    type="text"
                    value={addForm.authorCity}
                    onChange={setAdd('authorCity')}
                    placeholder="e.g. London, UK"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5F5E5A] block mb-1">Health condition</label>
                  <input
                    type="text"
                    value={addForm.healthCondition}
                    onChange={setAdd('healthCondition')}
                    placeholder="e.g. Celiac disease"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-xs font-medium text-[#5F5E5A] flex justify-between mb-1">
                  <span>Tip text</span>
                  <span className={addForm.tipText.length >= 260 ? 'text-[#D85A30]' : 'text-[#888780]'}>
                    {addForm.tipText.length}/280
                  </span>
                </label>
                <textarea
                  value={addForm.tipText}
                  onChange={setAdd('tipText')}
                  rows={3}
                  required
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="viaEmail"
                  checked={addForm.submittedViaEmail}
                  onChange={setAdd('submittedViaEmail')}
                  className="accent-[#1D9E75]"
                />
                <label htmlFor="viaEmail" className="text-xs text-[#5F5E5A]">
                  Mark as from email submission
                </label>
              </div>
              {addError && <p className="text-[#D85A30] text-xs mb-3">{addError}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="bg-[#085041] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#063d30] transition-colors disabled:opacity-60"
                >
                  {addSubmitting ? 'Adding…' : 'Add tip (approve immediately)'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setAddError('') }}
                  className="text-sm text-[#888780] hover:text-[#5F5E5A] px-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tips list */}
        {loading ? (
          <div className="text-sm text-[#888780] py-8 text-center">Loading tips…</div>
        ) : tips.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-8 text-center text-sm text-[#888780]">
            No tips found for this filter.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tips.map((tip) => (
              <div
                key={tip._id}
                className="bg-white rounded-xl border border-[#D3D1C7] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-[#085041] text-sm">{tip.authorName}</span>
                      <span className="text-xs text-[#888780]">{tip.authorCity}</span>
                      <span className="text-xs bg-[#EAF3DE] text-[#27500A] px-2 py-0.5 rounded-full">
                        {tip.healthCondition}
                      </span>
                      {tip.submittedViaEmail && (
                        <span className="text-xs bg-[#FFF3E0] text-[#E65100] px-2 py-0.5 rounded-full">
                          via email
                        </span>
                      )}
                      {tip.isApproved ? (
                        <span className="text-xs bg-[#E1F5EE] text-[#1D9E75] px-2 py-0.5 rounded-full font-medium">
                          Approved
                        </span>
                      ) : (
                        <span className="text-xs bg-[#FFF8E1] text-[#F9A825] px-2 py-0.5 rounded-full font-medium">
                          Pending
                        </span>
                      )}
                      {tip.isApproved && !tip.isVisible && (
                        <span className="text-xs bg-[#F1EFE8] text-[#888780] px-2 py-0.5 rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#1D9E75] font-medium mb-1 capitalize">
                      {tip.destinationName}
                    </div>
                    <p className="text-sm text-[#444441] leading-relaxed">{tip.tipText}</p>
                    <div className="text-xs text-[#888780] mt-1">
                      {new Date(tip.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    {!tip.isApproved && (
                      <button
                        type="button"
                        disabled={!!actionLoading}
                        onClick={() => handleAction(tip._id, 'approve')}
                        className="text-xs bg-[#1D9E75] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#17876a] transition-colors disabled:opacity-60"
                      >
                        Approve ✓
                      </button>
                    )}
                    {tip.isApproved && tip.isVisible && (
                      <button
                        type="button"
                        disabled={!!actionLoading}
                        onClick={() => handleAction(tip._id, 'hide')}
                        className="text-xs bg-[#EF9F27] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#d4891a] transition-colors disabled:opacity-60"
                      >
                        Hide
                      </button>
                    )}
                    {tip.isApproved && !tip.isVisible && (
                      <button
                        type="button"
                        disabled={!!actionLoading}
                        onClick={() => handleAction(tip._id, 'show')}
                        className="text-xs bg-[#1D9E75] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#17876a] transition-colors disabled:opacity-60"
                      >
                        Show
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={!!actionLoading}
                      onClick={() => handleDelete(tip._id)}
                      className="text-xs bg-[#D85A30] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#c04e28] transition-colors disabled:opacity-60"
                    >
                      Delete ✗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
