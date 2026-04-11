import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Destination from '@/models/Destination'
import DestinationRating from '@/models/DestinationRating'
import RatingSummaryCard from '@/components/public/RatingSummaryCard'
import TravelerTipsSection from '@/components/public/TravelerTipsSection'
import TipSubmitForm from '@/components/public/TipSubmitForm'
import { travelerPersonas } from '@/lib/travelerPersonas'

const FLAG_MAP = {
  japan: '🇯🇵', thailand: '🇹🇭', italy: '🇮🇹', mexico: '🇲🇽',
  nepal: '🇳🇵', singapore: '🇸🇬', india: '🇮🇳', germany: '🇩🇪',
  malaysia: '🇲🇾', peru: '🇵🇪', tanzania: '🇹🇿', switzerland: '🇨🇭',
  bali: '🇮🇩',
}

function renderMarkdown(content) {
  if (!content) return null
  const lines = content.split('\n')
  const elements = []
  let listItems = []
  let key = 0

  function flushList() {
    if (listItems.length === 0) return
    elements.push(
      <ul key={`ul-${key++}`} style={{ listStyle: 'none', padding: 0, margin: '0 0 18px' }}>
        {listItems.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '7px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '4px' }}>
              <path d="M20 6L9 17l-5-5" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '14px', color: '#444441', lineHeight: '1.75', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>{item}</span>
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
          fontSize: '22px', fontWeight: '600', color: '#085041',
          marginTop: i === 0 ? 0 : '36px', marginBottom: '14px',
          letterSpacing: '0.01em', lineHeight: '1.3',
        }}>
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={key++} style={{
          fontSize: '16px', fontWeight: '600', color: '#085041',
          marginTop: '24px', marginBottom: '8px',
          fontFamily: 'var(--font-inter, Inter, sans-serif)', lineHeight: '1.4',
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
          fontSize: '14px', color: '#444441', lineHeight: '1.85',
          marginBottom: '14px', fontFamily: 'var(--font-inter, Inter, sans-serif)',
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
  const { slug } = params
  let destName = slug.charAt(0).toUpperCase() + slug.slice(1)
  try {
    await connectDB()
    const dest = await Destination.findOne({ slug: slug.toLowerCase() }).select('name').lean()
    if (dest?.name) destName = dest.name
  } catch {}
  return {
    title: `${destName} Health Guide for Travelers — Food Safety & Nutrition`,
    description: `Complete ${destName} food safety and nutrition guide for travelers. Condition-specific advice for diabetes, gluten-free diets, nut allergies and more. Know what to eat in ${destName}.`,
    keywords: [
      `${destName} food safety`,
      `${destName} travel health`,
      `${destName} gluten free`,
      `${destName} diabetes travel`,
      'destination health guide',
    ],
    alternates: { canonical: `https://nomadvital.com/destinations/${slug}` },
    openGraph: {
      title: `${destName} Health Guide | NomadVital`,
      url: `https://nomadvital.com/destinations/${slug}`,
    },
  }
}

export default async function DestinationPage({ params }) {
  const { slug } = params
  const session = await auth()
  const isPro = session?.user?.plan === 'pro'
  const isLoggedIn = !!session

  let destination = null
  let userRating = null

  try {
    await connectDB()
    destination = await Destination.findOneAndUpdate(
      { slug: slug.toLowerCase(), isPublished: true },
      { $inc: { viewCount: 1 } },
      { new: true }
    )
    if (session?.user?.id && destination) {
      const existing = await DestinationRating.findOne({
        destinationSlug: slug.toLowerCase(),
        userId: session.user.id,
      })
      if (existing) userRating = existing.rating
    }
  } catch (err) {
    console.error('DestinationPage:', err)
  }

  if (!destination) notFound()

  const dest = JSON.parse(JSON.stringify(destination))
  const isLocked = !dest.isFree && !isPro
  const flag = FLAG_MAP[dest.slug] || '🌍'

  return (
    <div>
      {/* Hero */}
      <div style={{ position: 'relative', height: '220px', background: '#085041', overflow: 'hidden' }}>
        {dest.image && (
          <Image
            src={dest.image}
            alt={dest.name}
            fill
            style={{ objectFit: 'cover', opacity: 0.55 }}
            priority
            sizes="100vw"
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,80,65,0.3) 0%, rgba(8,80,65,0.82) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '0 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '34px', marginBottom: '8px', lineHeight: 1 }}>{flag}</div>
          <h1 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: '700', color: '#fff',
            letterSpacing: '0.01em', lineHeight: '1.2', marginBottom: '6px',
          }}>
            {dest.name} Health Guide
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Food safety, allergens &amp; nutrition for travelers
          </p>
        </div>
        {!isPro && (
          <div style={{
            position: 'absolute', top: '14px', right: '16px',
            background: dest.isFree ? '#1D9E75' : 'rgba(255,255,255,0.2)',
            color: '#fff', fontSize: '10px', fontWeight: '700',
            letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: '20px',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            backdropFilter: dest.isFree ? 'none' : 'blur(4px)',
          }}>
            {dest.isFree ? 'Free guide' : 'Pro guide'}
          </div>
        )}
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* Rating summary */}
        <RatingSummaryCard
          destination={dest.slug}
          destinationName={dest.name}
          initialAverage={dest.averageRating ?? 0}
          initialTotal={dest.totalRatings ?? 0}
          userExistingRating={userRating}
          isPro={isPro}
          isLoggedIn={isLoggedIn}
        />

        {/* Health conditions pills */}
        {dest.conditions?.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#1D9E75', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Health conditions covered
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {dest.conditions.map((c) => (
                <span key={c} style={{
                  background: '#E1F5EE', color: '#085041',
                  border: '1px solid #A8DFC3', borderRadius: '20px',
                  padding: '4px 12px', fontSize: '12px', fontWeight: '500',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)', textTransform: 'capitalize',
                }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Guide content or paywall */}
        {isLocked ? (
          <div style={{ position: 'relative', marginBottom: '36px' }}>
            <div style={{ filter: 'blur(3px)', userSelect: 'none', pointerEvents: 'none', maxHeight: '280px', overflow: 'hidden' }}>
              {renderMarkdown(dest.content)}
            </div>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.9) 45%, #fff 68%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
              paddingBottom: '28px',
            }}>
              <div style={{ textAlign: 'center', maxWidth: '320px' }}>
                <div style={{ width: '44px', height: '44px', background: '#E1F5EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <svg width="20" height="20" fill="none" stroke="#1D9E75" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '18px', fontWeight: '600', color: '#085041', marginBottom: '8px' }}>
                  Pro guide
                </h3>
                <p style={{ fontSize: '13px', color: '#5F5E5A', marginBottom: '18px', lineHeight: '1.55', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  The full {dest.name} guide is for Pro members — condition-specific advice, safe dishes, and local food safety tips.
                </p>
                <Link href="/pricing" style={{ display: 'inline-block', background: '#1D9E75', color: '#fff', fontWeight: '700', fontSize: '14px', padding: '11px 24px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  Upgrade to Pro — from $8.25/mo
                </Link>
                {!isLoggedIn && (
                  <div style={{ marginTop: '10px' }}>
                    <Link href="/signup" style={{ fontSize: '12px', color: '#888780', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                      Or create a free account →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '40px' }}>
            {renderMarkdown(dest.content)}
          </div>
        )}

        {/* Traveler type links */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#1D9E75', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Guides by traveler type
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {travelerPersonas.map((persona) => (
              <Link
                key={persona.id}
                href={`${persona.pageUrl}?destination=${dest.slug}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: persona.lightColor, border: `1px solid ${persona.color}40`,
                  borderRadius: '20px', padding: '5px 12px',
                  fontSize: '12px', fontWeight: '500', color: persona.color,
                  textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: persona.color, flexShrink: 0 }} />
                {persona.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Tips section */}
        <TravelerTipsSection destination={dest.slug} />

        {/* Submit form */}
        <TipSubmitForm
          destination={dest.slug}
          destinationName={dest.name}
          isLoggedIn={isLoggedIn}
        />

        {/* Back */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link href="/destinations" style={{ fontSize: '13px', color: '#888780', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            ← All destination guides
          </Link>
        </div>
      </div>
    </div>
  )
}
