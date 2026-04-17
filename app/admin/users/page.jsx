'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function planLabel(planType) {
  if (planType === 'pro-monthly') return 'Pro Monthly'
  if (planType === 'pro-annually') return 'Pro Annual'
  return 'Free'
}

function planBadgeClass(plan) {
  if (plan === 'pro') return 'bg-[#E1F5EE] text-[#1D9E75]'
  return 'bg-[#F1EFE8] text-[#5F5E5A]'
}

/* ── OTP Modal ─────────────────────────────────────────────────── */
function OtpModal({ title, description, onConfirm, onCancel, loading }) {
  const [code, setCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [sendError, setSendError] = useState('')

  async function handleSendOtp() {
    setSendingOtp(true)
    setSendError('')
    try {
      const res = await fetch('/api/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onConfirm.otpPayload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP.')
      setOtpSent(true)
    } catch (err) {
      setSendError(err.message || 'Failed to send OTP.')
    } finally {
      setSendingOtp(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!code.trim()) return
    onConfirm.execute(code.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-[#D3D1C7] shadow-xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-[#085041] mb-1">{title}</h3>
        <p className="text-sm text-[#5F5E5A] mb-5">{description}</p>

        {!otpSent ? (
          <>
            {sendError && (
              <div className="mb-3 text-sm text-[#D85A30] bg-[#FFF0EB] rounded-lg px-3 py-2">{sendError}</div>
            )}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="w-full bg-[#085041] text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-[#063d31] transition-colors disabled:opacity-60"
            >
              {sendingOtp ? 'Sending…' : 'Send confirmation code to admin email'}
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-xs text-[#1D9E75] bg-[#E1F5EE] rounded-lg px-3 py-2 mb-3">
              A 6-digit code has been sent to the admin email. It expires in 10 minutes.
            </p>
            <label className="block text-xs font-semibold text-[#5F5E5A] mb-1">Enter code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-2xl font-bold tracking-widest border border-[#D3D1C7] rounded-lg px-3 py-3 mb-4 text-[#085041] outline-none focus:border-[#1D9E75]"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-[#1D9E75] text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-[#17876a] transition-colors disabled:opacity-60"
            >
              {loading ? 'Processing…' : 'Confirm'}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={onCancel}
          className="w-full mt-3 text-sm text-[#888780] hover:text-[#5F5E5A] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  // OTP modal state
  const [otpModal, setOtpModal] = useState(null) // { title, description, otpPayload, execute }

  async function fetchUsers() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to load users.')
      }
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
    )
  }, [users, search])

  /* ── Toggle Plan ── */
  function handleTogglePlan(user) {
    const newPlan = user.plan === 'pro' ? 'free' : 'pro'
    const newPlanType = newPlan === 'pro' ? 'pro-monthly' : 'free'
    const label = newPlan === 'pro' ? 'Upgrade to Pro Monthly' : 'Downgrade to Free'

    setOtpModal({
      title: label,
      description: `You are about to change ${user.name || user.email}'s plan to ${newPlan === 'pro' ? 'Pro Monthly' : 'Free'}. A confirmation code will be sent to the admin email.`,
      otpPayload: {
        action: 'plan-change',
        targetUserId: user._id,
        targetUserName: user.name || user.email,
      },
      execute: async (otp) => {
        setActionLoading(user._id + 'plan')
        try {
          const res = await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, plan: newPlan, planType: newPlanType, otp }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Failed to update plan.')
          setOtpModal(null)
          await fetchUsers()
        } catch (err) {
          alert(err.message || 'Failed to update plan.')
        } finally {
          setActionLoading('')
        }
      },
    })
  }

  /* ── Delete User ── */
  function handleDelete(user) {
    if (user.plan === 'pro') {
      // Pro user: require OTP
      setOtpModal({
        title: 'Delete Pro User',
        description: `You are about to permanently delete ${user.name || user.email} (Pro plan). This cannot be undone. A confirmation code will be sent to the admin email.`,
        otpPayload: {
          action: 'delete',
          targetUserId: user._id,
          targetUserName: user.name || user.email,
        },
        execute: async (otp) => {
          setActionLoading(user._id + 'del')
          try {
            const res = await fetch('/api/admin/users', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user._id, otp }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to delete user.')
            setOtpModal(null)
            await fetchUsers()
          } catch (err) {
            alert(err.message || 'Failed to delete user.')
          } finally {
            setActionLoading('')
          }
        },
      })
    } else {
      // Free user: browser confirmation only
      if (!confirm(`Permanently delete user "${user.name || user.email}"? This cannot be undone.`)) return
      setActionLoading(user._id + 'del')
      fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data.error || 'Failed to delete user.')
          }
          await fetchUsers()
        })
        .catch((err) => alert(err.message || 'Failed to delete user.'))
        .finally(() => setActionLoading(''))
    }
  }

  return (
    <div>
      <AdminHeader title="Users" subtitle="Manage registered users and plans" />

      {otpModal && (
        <OtpModal
          title={otpModal.title}
          description={otpModal.description}
          onConfirm={otpModal}
          onCancel={() => setOtpModal(null)}
          loading={!!actionLoading}
        />
      )}

      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full sm:w-80 text-sm border border-[#D3D1C7] rounded-lg px-3 py-2 bg-white text-[#085041] outline-none focus:border-[#1D9E75]"
          />
          <div className="text-xs text-[#888780]">
            {loading ? 'Loading…' : `${filtered.length} of ${users.length} users`}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-10 text-center">
            <div className="inline-block w-6 h-6 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-[#888780] mt-2">Loading users…</div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border border-[#D85A30]/40 p-6 text-sm text-[#D85A30]">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-8 text-center text-sm text-[#888780]">
            No users found.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#D3D1C7] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F1EFE8] text-[#5F5E5A]">
                  <tr>
                    <th className="text-left font-semibold px-5 py-3">Name</th>
                    <th className="text-left font-semibold px-5 py-3">Email</th>
                    <th className="text-left font-semibold px-5 py-3">Plan</th>
                    <th className="text-left font-semibold px-5 py-3">Plan Expiry</th>
                    <th className="text-left font-semibold px-5 py-3">Joined</th>
                    <th className="text-right font-semibold px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u._id} className="border-t border-[#EFEDE5]">
                      <td className="px-5 py-3 text-[#085041] font-medium">{u.name || '—'}</td>
                      <td className="px-5 py-3 text-[#5F5E5A]">{u.email || '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${planBadgeClass(u.plan)}`}>
                          {planLabel(u.planType || (u.plan === 'pro' ? 'pro-monthly' : 'free'))}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#5F5E5A]">
                        {u.plan === 'pro' ? formatDate(u.planExpiryDate) : '—'}
                      </td>
                      <td className="px-5 py-3 text-[#5F5E5A]">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={!!actionLoading}
                            onClick={() => handleTogglePlan(u)}
                            className="text-xs bg-[#1D9E75] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#17876a] transition-colors disabled:opacity-60"
                          >
                            {u.plan === 'pro' ? '→ Free' : '→ Pro'}
                          </button>
                          <button
                            type="button"
                            disabled={!!actionLoading}
                            onClick={() => handleDelete(u)}
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
          </div>
        )}
      </div>
    </div>
  )
}
