import Link from 'next/link'
import Image from 'next/image'
import connectDB from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

export const metadata = {
  title: 'Travel Health Articles & Guides',
  description:
    'Research-backed health guides for travelers managing dietary conditions abroad. Expert advice on food safety, nutrition, and healthy eating while traveling.',
  keywords: [
    'travel health articles',
    'food safety guides',
    'travel nutrition blog',
    'dietary conditions abroad',
  ],
  openGraph: {
    title: 'Travel Health Articles & Guides | NomadVital',
    url: 'https://nomadvital.com/blog',
  },
}

// Static fallback articles shown until DB posts are published
const STATIC_POSTS = [
  {
    slug: '10-foods-diabetics-avoid-traveling',
    tag: 'DIABETES · TRAVEL',
    title: '10 foods diabetics must avoid while traveling abroad',
    readTime: 5,
    summary: 'Hidden sugars in sauces, high-GI staple foods, and drinks that spike blood sugar — what to watch for in every destination.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  },
  {
    slug: 'gluten-free-japan-complete-guide',
    tag: 'GLUTEN-FREE · JAPAN',
    title: 'How to eat gluten-free in Japan — a complete guide',
    readTime: 7,
    summary: "Soy sauce is everywhere. Here's how to navigate Japanese cuisine safely with celiac disease or gluten sensitivity.",
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
  },
  {
    slug: 'water-safety-international-travelers',
    tag: 'WATER SAFETY · GLOBAL',
    title: 'Water safety guide for international travelers',
    readTime: 6,
    summary: "Which countries have safe tap water, which don't, and what to do in high-risk destinations to avoid getting sick.",
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
  },
]

export default async function BlogPage() {
  let posts = []
  try {
    await connectDB()
    const docs = await BlogPost.find({ isPublished: true })
      .select('title slug tag summary readTime createdAt viewCount image')
      .sort({ createdAt: -1 })
    posts = JSON.parse(JSON.stringify(docs))
  } catch {
    // fall through to static fallback
  }

  // Use static fallback when no DB posts exist yet
  const displayPosts = posts.length > 0 ? posts : STATIC_POSTS

  return (
    <div>
      {/* Header */}
      <div style={{ background: '#085041', color: '#fff', padding: '56px 24px', textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
            fontWeight: '700',
            marginBottom: '12px',
            letterSpacing: '0.01em',
          }}
        >
          Health &amp; travel articles
        </h1>
        <p style={{ color: '#9FE1CB', fontSize: '17px', maxWidth: '480px', margin: '0 auto', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Research-backed guides for travelers managing dietary conditions abroad.
        </p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {displayPosts.map((post) => {
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                  className="group"
                >
                  <article style={{
                    background: '#fff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #D3D1C7',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'box-shadow 0.15s',
                  }}>
                    {/* Cover image */}
                    <div style={{ position: 'relative', height: '160px', width: '100%', backgroundColor: '#F1EFE8', flexShrink: 0 }}>
                      {post.image && (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {post.tag && (
                        <div style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          color: '#1D9E75',
                          letterSpacing: '2.5px',
                          textTransform: 'uppercase',
                          marginBottom: '10px',
                          fontFamily: 'var(--font-inter, Inter, sans-serif)',
                        }}>
                          {post.tag}
                        </div>
                      )}

                      <h2 style={{
                        fontFamily: 'var(--font-playfair, Georgia, serif)',
                        fontSize: '17px',
                        fontWeight: '600',
                        color: '#085041',
                        lineHeight: '1.35',
                        letterSpacing: '0.01em',
                        marginBottom: '10px',
                      }}>
                        {post.title}
                      </h2>

                      {post.summary && (
                        <p style={{
                          fontSize: '13px',
                          color: '#5F5E5A',
                          lineHeight: '1.6',
                          marginBottom: '16px',
                          flex: 1,
                          fontFamily: 'var(--font-inter, Inter, sans-serif)',
                        }}>
                          {post.summary}
                        </p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                        <span style={{ fontSize: '11px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                          {post.readTime} min read
                        </span>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#1D9E75',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontFamily: 'var(--font-inter, Inter, sans-serif)',
                        }}>
                          Read
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>

        {/* Related destinations */}
        <div style={{ marginTop: '56px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#1D9E75', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Destination guides
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { name: 'Japan', slug: 'japan', code: 'jp' },
              { name: 'Thailand', slug: 'thailand', code: 'th' },
              { name: 'Italy', slug: 'italy', code: 'it' },
              { name: 'Mexico', slug: 'mexico', code: 'mx' },
            ].map((d) => (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#F1EFE8',
                  border: '1px solid #D3D1C7',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#085041',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                <img src={`https://flagcdn.com/20x15/${d.code}.png`} width="20" height="15" alt="" style={{ borderRadius: '2px' }} />
                {d.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
