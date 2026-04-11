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

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState('')

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

  async function togglePlan(user) {
    const newPlan = user.plan === 'pro' ? 'free' : 'pro'
    setActionLoading(user._id + 'plan')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, plan: newPlan }),
      })
      if (!res.ok) throw new Error()
      await fetchUsers()
    } catch {
      alert('Failed to update plan.')
    } finally {
      setActionLoading('')
    }
  }

  async function deleteUser(user) {
    if (!confirm(`Permanently delete user "${user.name || user.email}"?`)) return
    setActionLoading(user._id + 'del')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id }),
      })
      if (!res.ok) throw new Error()
      await fetchUsers()
    } catch {
      alert('Failed to delete user.')
    } finally {
      setActionLoading('')
    }
  }

  return (
    <div>
      <AdminHeader title="Users" subtitle="Manage registered users and plans" />
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
                    <th className="text-left font-semibold px-5 py-3">Traveler</th>
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
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                            u.plan === 'pro'
                              ? 'bg-[#E1F5EE] text-[#1D9E75]'
                              : 'bg-[#F1EFE8] text-[#5F5E5A]'
                          }`}
                        >
                          {u.plan === 'pro' ? 'Pro' : 'Free'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#5F5E5A] capitalize">{u.travelerType || 'general'}</td>
                      <td className="px-5 py-3 text-[#5F5E5A]">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={!!actionLoading}
                            onClick={() => togglePlan(u)}
                            className="text-xs bg-[#1D9E75] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#17876a] transition-colors disabled:opacity-60"
                          >
                            {u.plan === 'pro' ? '→ Free' : '→ Pro'}
                          </button>
                          <button
                            type="button"
                            disabled={!!actionLoading}
                            onClick={() => deleteUser(u)}
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
