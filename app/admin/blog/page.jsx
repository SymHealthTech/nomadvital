import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import connectDB from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

export const dynamic = 'force-dynamic'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

async function loadPosts() {
  try {
    await connectDB()
    const list = await BlogPost.find().sort({ createdAt: -1 }).lean()
    return { ok: true, list }
  } catch (err) {
    console.error('admin/blog loadPosts:', err)
    return { ok: false, list: [] }
  }
}

export default async function AdminBlogPage() {
  const { ok, list } = await loadPosts()

  return (
    <div>
      <AdminHeader title="Blog" subtitle="Manage blog articles" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-[#888780]">
            {ok ? `${list.length} posts` : 'Unable to load posts'}
          </div>
          <Link
            href="/admin/blog/new"
            className="bg-[#1D9E75] hover:bg-[#085041] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + New Post
          </Link>
        </div>

        {!ok ? (
          <div className="bg-white rounded-xl border border-[#D85A30]/40 p-6 text-sm text-[#D85A30]">
            Unable to load blog posts. Check the MongoDB connection.
          </div>
        ) : list.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-8 text-center text-sm text-[#888780]">
            No blog posts yet. Click "New Post" to write one.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#D3D1C7] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F1EFE8] text-[#5F5E5A]">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Title</th>
                  <th className="text-left font-semibold px-5 py-3">Tag</th>
                  <th className="text-left font-semibold px-5 py-3">Status</th>
                  <th className="text-left font-semibold px-5 py-3">Read Time</th>
                  <th className="text-left font-semibold px-5 py-3">Date</th>
                  <th className="text-right font-semibold px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p._id} className="border-t border-[#EFEDE5]">
                    <td className="px-5 py-3 text-[#085041] font-medium">{p.title}</td>
                    <td className="px-5 py-3 text-[#5F5E5A]">{p.tag || '—'}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          p.isPublished
                            ? 'bg-[#E1F5EE] text-[#1D9E75]'
                            : 'bg-[#FFF8E1] text-[#F9A825]'
                        }`}
                      >
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#5F5E5A]">{p.readTime ? `${p.readTime} min` : '—'}</td>
                    <td className="px-5 py-3 text-[#5F5E5A]">{formatDate(p.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/blog/${p._id}`}
                        className="text-xs bg-[#085041] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#063d30] transition-colors"
                      >
                        Edit
                      </Link>
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
