'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const emptyForm = {
  title: '',
  slug: '',
  tag: '',
  summary: '',
  readTime: '',
  content: '',
  image: '',
  metaDescription: '',
  isPublished: false,
}

export default function AdminBlogEditPage({ params }) {
  const router = useRouter()
  const isNew = params.id === 'new'

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/blog')
        if (!res.ok) throw new Error()
        const list = await res.json()
        const found = list.find((p) => p._id === params.id)
        if (!found) throw new Error('Post not found')
        if (!cancelled) {
          setForm({
            title: found.title || '',
            slug: found.slug || '',
            tag: found.tag || '',
            summary: found.summary || '',
            readTime: found.readTime?.toString() || '',
            content: found.content || '',
            image: found.image || '',
            metaDescription: found.metaDescription || '',
            isPublished: !!found.isPublished,
          })
          setSlugTouched(true)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load post.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isNew, params.id])

  function update(field) {
    return (e) => {
      const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setForm((prev) => {
        const next = { ...prev, [field]: val }
        if (field === 'title' && !slugTouched) {
          next.slug = slugify(val)
        }
        return next
      })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        tag: form.tag.trim(),
        summary: form.summary.trim(),
        readTime: form.readTime ? Number(form.readTime) : undefined,
        content: form.content,
        image: form.image.trim(),
        metaDescription: form.metaDescription.trim(),
        isPublished: form.isPublished,
      }

      if (!payload.title || !payload.slug) {
        throw new Error('Title and slug are required.')
      }

      const res = await fetch('/api/admin/blog', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? payload : { id: params.id, ...payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save post.')

      router.push('/admin/blog')
      router.refresh()
    } catch (err) {
      setError(err.message || 'Failed to save post.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Permanently delete this post?')) return
    setDeleting(true)
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id }),
      })
      if (!res.ok) throw new Error()
      router.push('/admin/blog')
      router.refresh()
    } catch {
      setError('Failed to delete post.')
      setDeleting(false)
    }
  }

  const inputClass =
    'w-full text-sm border border-[#D3D1C7] rounded-lg px-3 py-2 bg-white text-[#085041] outline-none focus:border-[#1D9E75]'

  if (loading) {
    return (
      <div>
        <AdminHeader title="Edit Post" subtitle="Loading…" />
        <div className="p-6">
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-10 text-center">
            <div className="inline-block w-6 h-6 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminHeader
        title={isNew ? 'New Post' : 'Edit Post'}
        subtitle={isNew ? 'Write a new blog article' : `Editing ${form.title || 'post'}`}
      />
      <div className="p-6">
        <div className="mb-4">
          <Link href="/admin/blog" className="text-sm text-[#5F5E5A] hover:text-[#085041] font-medium">
            ← Back to blog
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#D3D1C7] p-6 max-w-3xl">
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#5F5E5A] uppercase tracking-wide mb-1">
              Title *
            </label>
            <input type="text" required value={form.title} onChange={update('title')} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-[#5F5E5A] uppercase tracking-wide mb-1">
                Slug *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setForm((p) => ({ ...p, slug: slugify(e.target.value) }))
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5F5E5A] uppercase tracking-wide mb-1">
                Tag
              </label>
              <input
                type="text"
                value={form.tag}
                onChange={update('tag')}
                placeholder="nutrition"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-[#5F5E5A] uppercase tracking-wide mb-1">
              Summary
            </label>
            <input type="text" value={form.summary} onChange={update('summary')} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-[#5F5E5A] uppercase tracking-wide mb-1">
                Read Time (min)
              </label>
              <input
                type="number"
                min="1"
                value={form.readTime}
                onChange={update('readTime')}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5F5E5A] uppercase tracking-wide mb-1">
                Image URL
              </label>
              <input type="url" value={form.image} onChange={update('image')} className={inputClass} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-[#5F5E5A] uppercase tracking-wide mb-1">
              Meta Description (SEO)
            </label>
            <input
              type="text"
              value={form.metaDescription}
              onChange={update('metaDescription')}
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label className="flex justify-between text-xs font-bold text-[#5F5E5A] uppercase tracking-wide mb-1">
              <span>Content (Markdown)</span>
              <span className="text-[#888780] normal-case tracking-normal">{form.content.length} chars</span>
            </label>
            <textarea
              rows={16}
              value={form.content}
              onChange={update('content')}
              className={`${inputClass} font-mono text-xs leading-relaxed`}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="flex items-center gap-6 mb-6">
            <label className="flex items-center gap-2 text-sm text-[#5F5E5A]">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={update('isPublished')}
                className="accent-[#1D9E75]"
              />
              Published
            </label>
          </div>

          {error && <p className="text-[#D85A30] text-sm mb-4">{error}</p>}

          <div className="flex flex-wrap gap-2 justify-between">
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#085041] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#063d30] transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving…' : isNew ? 'Create Post' : 'Save Changes'}
              </button>
              <Link href="/admin/blog" className="text-sm text-[#888780] hover:text-[#5F5E5A] px-3 py-2">
                Cancel
              </Link>
            </div>
            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="bg-[#D85A30] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#c04e28] transition-colors disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
