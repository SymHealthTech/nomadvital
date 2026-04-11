import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import connectDB from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

// Related destinations per article tag
const RELATED_DESTINATIONS = {
  'diabetics-foods-avoid-travel': [
    { name: 'Japan', slug: 'japan', flag: '🇯🇵' },
    { name: 'Thailand', slug: 'thailand', flag: '🇹🇭' },
    { name: 'Mexico', slug: 'mexico', flag: '🇲🇽' },
  ],
  'gluten-free-japan-guide': [
    { name: 'Japan', slug: 'japan', flag: '🇯🇵' },
    { name: 'Italy', slug: 'italy', flag: '🇮🇹' },
  ],
  'water-safety-international-travel': [
    { name: 'Thailand', slug: 'thailand', flag: '🇹🇭' },
    { name: 'Nepal', slug: 'nepal', flag: '🇳🇵' },
    { name: 'India', slug: 'india', flag: '🇮🇳' },
  ],
  'nut-allergy-southeast-asia-guide': [
    { name: 'Thailand', slug: 'thailand', flag: '🇹🇭' },
    { name: 'Singapore', slug: 'singapore', flag: '🇸🇬' },
  ],
  'marathon-runner-international-race-nutrition': [
    { name: 'Japan', slug: 'japan', flag: '🇯🇵' },
    { name: 'Italy', slug: 'italy', flag: '🇮🇹' },
  ],
  'jet-lag-nutrition-business-travel': [
    { name: 'Singapore', slug: 'singapore', flag: '🇸🇬' },
    { name: 'Japan', slug: 'japan', flag: '🇯🇵' },
  ],
  'vegetarian-travel-guide-india': [
    { name: 'India', slug: 'india', flag: '🇮🇳' },
    { name: 'Nepal', slug: 'nepal', flag: '🇳🇵' },
  ],
  'high-altitude-nutrition-himalayan-trekkers': [
    { name: 'Nepal', slug: 'nepal', flag: '🇳🇵' },
  ],
  'plant-based-eating-yoga-retreat-rishikesh': [
    { name: 'India', slug: 'india', flag: '🇮🇳' },
  ],
  'managing-type-1-diabetes-traveling': [
    { name: 'Japan', slug: 'japan', flag: '🇯🇵' },
    { name: 'Thailand', slug: 'thailand', flag: '🇹🇭' },
    { name: 'Singapore', slug: 'singapore', flag: '🇸🇬' },
  ],
}

// Simple markdown renderer — handles ##, ###, - lists, **bold**, paragraphs
function renderMarkdown(content) {
  if (!content) return null
  const lines = content.split('\n')
  const elements = []
  let listItems = []
  let key = 0

  function flushList() {
    if (listItems.length === 0) return
    elements.push(
      <ul key={`ul-${key++}`} style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
        {listItems.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '4px' }}>
              <path d="M20 6L9 17l-5-5" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '15px', color: '#444441', lineHeight: '1.7' }}>{item}</span>
          </li>
        ))}
      </ul>
    )
    listItems = []
  }

  function renderInline(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#085041' }}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={key++} style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize: '24px',
          fontWeight: '600',
          color: '#085041',
          marginTop: i === 0 ? 0 : '40px',
          marginBottom: '16px',
          letterSpacing: '0.01em',
          lineHeight: '1.3',
        }}>
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={key++} style={{
          fontSize: '17px',
          fontWeight: '600',
          color: '#085041',
          marginTop: '28px',
          marginBottom: '10px',
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
          lineHeight: '1.4',
        }}>
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('- ')) {
      listItems.push(renderInline(line.slice(2)))
    } else if (line.trim() === '') {
      flushList()
    } else {
      flushList()
      elements.push(
        <p key={key++} style={{
          fontSize: '15px',
          color: '#444441',
          lineHeight: '1.85',
          marginBottom: '16px',
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}>
          {renderInline(line)}
        </p>
      )
    }
  }
  flushList()
  return elements
}

export async function generateMetadata({ params }) {
  let post = null
  try {
    await connectDB()
    post = await BlogPost.findOne({ slug: params.slug, isPublished: true })
      .select('title summary metaDescription tag')
      .lean()
  } catch {}
  if (!post) return { title: 'Article | NomadVital' }
  const description =
    post.metaDescription ||
    post.summary ||
    `${post.title} — travel health and food safety guide for travelers.`
  return {
    title: post.title,
    description,
    keywords: [post.tag, 'travel health', 'food safety', 'travel nutrition'].filter(Boolean),
    alternates: { canonical: `https://nomadvital.com/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `https://nomadvital.com/blog/${params.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }) {
  let post = null
  try {
    await connectDB()
    post = await BlogPost.findOneAndUpdate(
      { slug: params.slug, isPublished: true },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).select('title slug tag content summary readTime createdAt viewCount image')
  } catch (err) {
    console.error('BlogPostPage:', err)
  }

  if (!post) notFound()

  const related = RELATED_DESTINATIONS[post.slug] || []
  const postObj = JSON.parse(JSON.stringify(post))

  const publishDate = new Date(postObj.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div>
      {/* Hero image */}
      <div style={{ position: 'relative', height: '240px', width: '100%', background: '#1A5C4A', overflow: 'hidden' }}>
        {postObj.image && (
          <Image
            src={postObj.image}
            alt={postObj.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="100vw"
          />
        )}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,80,65,0.45) 0%, rgba(8,80,65,0.72) 100%)',
        }} />
        {postObj.tag && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '24px',
            background: 'rgba(255,255,255,0.18)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: '20px',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
          }}>
            {postObj.tag}
          </div>
        )}
      </div>

      {/* Article container */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '36px 24px 64px' }}>

        {/* Title + meta */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
            fontWeight: '700',
            color: '#085041',
            lineHeight: '1.3',
            letterSpacing: '0.01em',
            marginBottom: '14px',
          }}>
            {postObj.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" fill="none" stroke="#888780" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path strokeLinecap="round" d="M12 6v6l4 2"/>
              </svg>
              <span style={{ fontSize: '12px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                {postObj.readTime} min read
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#C0C0BB', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>·</span>
            <span style={{ fontSize: '12px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              {publishDate}
            </span>
          </div>

          {/* Medical disclaimer banner */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            background: '#F1EFE8',
            border: '1px solid #D3D1C7',
            borderRadius: '10px',
            padding: '12px 14px',
            marginTop: '20px',
          }}>
            <svg width="14" height="14" fill="none" stroke="#888780" strokeWidth="1.5" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
              <circle cx="12" cy="12" r="10"/>
              <path strokeLinecap="round" d="M12 8v4M12 16h.01"/>
            </svg>
            <p style={{ fontSize: '11px', color: '#888780', margin: 0, lineHeight: '1.5', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              This article is for general information purposes only and does not constitute medical advice. Always consult a qualified healthcare professional before making changes to your diet or health management plan.
            </p>
          </div>
        </div>

        {/* Article content */}
        <div style={{ marginBottom: '48px' }}>
          {renderMarkdown(postObj.content)}
        </div>

        {/* Related destination guides */}
        {related.length > 0 && (
          <div style={{
            borderTop: '1px solid #F1EFE8',
            paddingTop: '32px',
            marginBottom: '32px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#1D9E75', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Related destination guides
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {related.map((d) => (
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
                    padding: '7px 14px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#085041',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}
                >
                  <span>{d.flag}</span>
                  {d.name} guide →
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* AI upsell */}
        <div style={{
          background: '#085041',
          borderRadius: '16px',
          padding: '28px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '22px', marginBottom: '8px' }}>🤖</div>
          <h3 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: '18px',
            fontWeight: '600',
            color: '#fff',
            marginBottom: '8px',
          }}>
            Have a specific question?
          </h3>
          <p style={{ color: '#9FE1CB', fontSize: '13px', marginBottom: '18px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Ask our AI advisor about your exact dietary conditions and destination — you get a personalised answer in seconds.
          </p>
          <Link
            href="/ask"
            style={{
              display: 'inline-block',
              background: '#1D9E75',
              color: '#fff',
              fontWeight: '700',
              fontSize: '14px',
              padding: '11px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            Ask the AI advisor →
          </Link>
        </div>

        {/* Back link */}
        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <Link
            href="/blog"
            style={{ fontSize: '13px', color: '#888780', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}
          >
            ← All articles
          </Link>
        </div>
      </div>
    </div>
  )
}
