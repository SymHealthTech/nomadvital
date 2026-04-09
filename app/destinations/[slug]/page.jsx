import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Destination from '@/models/Destination'
import DestinationRating from '@/models/DestinationRating'
import RatingSummaryCard from '@/components/public/RatingSummaryCard'
import TravelerTipsSection from '@/components/public/TravelerTipsSection'
import TipSubmitForm from '@/components/public/TipSubmitForm'
import { travelerPersonas } from '@/lib/travelerPersonas'

// Static image/flag metadata — not stored in DB
const DEST_META = {
  japan:   { flag: '🇯🇵', image: '/images/destinations/japan.jpg',   placeholder: '#E1F5EE' },
  thailand:{ flag: '🇹🇭', image: '/images/destinations/thailand.jpg', placeholder: '#FFF3E0' },
  italy:   { flag: '🇮🇹', image: '/images/destinations/italy.jpg',   placeholder: '#E8F4FD' },
  mexico:  { flag: '🇲🇽', image: '/images/destinations/mexico.jpg',  placeholder: '#FAECE7' },
}

const CONDITION_COLORS = {
  'diabetes':     { bg: '#E1F5EE', color: '#085041' },
  'gluten-free':  { bg: '#FFF3E0', color: '#B45309' },
  'nut allergy':  { bg: '#FAECE7', color: '#D85A30' },
  'vegetarian':   { bg: '#EAF3DE', color: '#3B6D11' },
  'vegan':        { bg: '#EAF3DE', color: '#3B6D11' },
  'lactose-free': { bg: '#E8F4FD', color: '#185FA5' },
}

function conditionStyle(c) {
  return CONDITION_COLORS[c.toLowerCase()] || { bg: '#F1EFE8', color: '#5F5E5A' }
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
      <ul key={`ul-${key++}`} style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
        {listItems.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '3px' }}>
              <path d="M20 6L9 17l-5-5" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '14px', color: '#444441', lineHeight: '1.7' }}>{item}</span>
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
          fontSize: '22px',
          fontWeight: '600',
          color: '#085041',
          marginTop: i === 0 ? 0 : '36px',
          marginBottom: '14px',
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
          fontSize: '16px',
          fontWeight: '600',
          color: '#085041',
          marginTop: '24px',
          marginBottom: '8px',
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
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
          fontSize: '14px',
          color: '#444441',
          lineHeight: '1.8',
          marginBottom: '14px',
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
  const slug = params.slug.toLowerCase()
  const name = slug.charAt(0).toUpperCase() + slug.slice(1)
  return {
    title: `${name} Health Guide for Travelers — NomadVital`,
    description: `Food safety, allergen guide, and nutrition tips for travelers heading to ${name}. Covers diabetes, gluten-free, nut allergy, vegan, and more.`,
    alternates: { canonical: `https://nomadvital.com/destinations/${slug}` },
  }
}

export default async function DestinationPage({ params }) {
  const slug = params.slug.toLowerCase()

  const session = await auth()
  const isPro = session?.user?.plan === 'pro'
  const isLoggedIn = !!session

  let destination = null
  let averageRating = 0
  let totalRatings = 0
  let userRating = null

  try {
    await connectDB()

    // Fetch + increment viewCount atomically
    destination = await Destination.findOneAndUpdate(
      { slug, isPublished: true },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).select('name slug country content conditions isFree averageRating totalRatings viewCount')

    if (!destination) notFound()

    averageRating = destination.averageRating ?? 0
    totalRatings = destination.totalRatings ?? 0

    if (session?.user?.id) {
      const existing = await DestinationRating.findOne({
        destinationSlug: slug,
        userId: session.user.id,
      })
      if (existing) userRating = existing.rating
    }
  } catch (err) {
    console.error('DestinationPage:', err)
    if (!destination) notFound()
  }

  const dest = JSON.parse(JSON.stringify(destination))
  const meta = DEST_META[slug] || {}
  const isLocked = !dest.isFree && !isPro
  const destinationName = dest.name

  return (
    <div>
      {/* HERO — image banner with overlay */}
      <div style={{ position: 'relative', height: '220px', width: '100%', background: meta.placeholder || '#F1EFE8', overflow: 'hidden' }}>
        {meta.image && (
          <Image
            src={meta.image}
            alt={`${destinationName} travel`}
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="100vw"
          />
        )}
        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,80,65,0.5) 0%, rgba(8,80,65,0.75) 100%)',
        }} />
        {/* Hero text */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
        }}>
          {meta.flag && <div style={{ fontSize: '36px', marginBottom: '8px', lineHeight: 1 }}>{meta.flag}</div>}
          <h1 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: '700',
            color: '#fff',
            letterSpacing: '0.01em',
            marginBottom: '6px',
          }}>
            {destinationName} Health Guide
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '14px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Food safety, allergens &amp; nutrition for travelers
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '36px 24px 56px' }}>

        {/* Rating summary card */}
        <RatingSummaryCard
          destination={slug}
          destinationName={destinationName}
          initialAverage={averageRating}
          initialTotal={totalRatings}
          userExistingRating={userRating}
          isPro={isPro}
          isLoggedIn={isLoggedIn}
        />

        {/* Health conditions covered */}
        {dest.conditions && dest.conditions.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#1D9E75', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Health conditions covered
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {dest.conditions.map((c) => {
                const s = conditionStyle(c)
                return (
                  <span key={c} style={{
                    background: s.bg,
                    color: s.color,
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}>
                    {c}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Guide content — paywalled for locked destinations */}
        {isLocked ? (
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
            {/* Blurred preview */}
            <div style={{ filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.5 }}>
              <div style={{ fontSize: '14px', color: '#444441', lineHeight: '1.8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                <p>Japan is one of the most food-safe destinations in the world — food hygiene standards are exceptionally high, ingredient labeling is meticulous, and the cuisine is naturally low in saturated fat. However, travelers with specific dietary conditions should be aware of several important considerations...</p>
                <p>For diabetics, Japanese cuisine is generally favorable for blood sugar management. White rice is the dietary staple and has a moderate glycemic index when eaten with protein and vegetables, as is traditional...</p>
                <p>For gluten-free travelers, this is the most significant challenge in Japan. Soy sauce (shoyu) contains wheat and appears in almost everything — miso soup, ramen, teriyaki, yakitori glazes...</p>
              </div>
            </div>
            {/* Paywall overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.98) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '32px 24px',
              borderRadius: '16px',
            }}>
              <div style={{
                textAlign: 'center',
                background: '#fff',
                border: '1px solid #D3D1C7',
                borderRadius: '16px',
                padding: '28px 24px',
                maxWidth: '380px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: '#E1F5EE',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                }}>
                  <svg width="20" height="20" fill="none" stroke="#1D9E75" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-playfair, Georgia, serif)',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#085041',
                  marginBottom: '8px',
                }}>
                  Pro guide
                </h3>
                <p style={{ fontSize: '13px', color: '#5F5E5A', marginBottom: '18px', lineHeight: '1.5', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  Upgrade to Pro to unlock the full {destinationName} guide — including condition-specific sections, local food safety tips, and key phrases.
                </p>
                <Link
                  href="/pricing"
                  style={{
                    display: 'block',
                    background: '#1D9E75',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '14px',
                    padding: '12px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    marginBottom: '10px',
                  }}
                >
                  Upgrade to Pro — $12/mo
                </Link>
                <p style={{ fontSize: '11px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  No charge until day 8 · Cancel anytime
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '40px' }}>
            {renderMarkdown(dest.content)}
          </div>
        )}

        {/* Traveler type links */}
        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#1D9E75', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Guides by traveler type
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {travelerPersonas.map((persona) => (
              <Link
                key={persona.id}
                href={`${persona.pageUrl}?destination=${slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: persona.lightColor,
                  border: `1px solid ${persona.color}40`,
                  borderRadius: '20px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: persona.color,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                <span style={{ fontSize: '14px' }}>{persona.emoji}</span>
                {persona.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Traveler tips — always visible */}
        <TravelerTipsSection destination={slug} />

        {/* Tip submit form — only for logged-in users */}
        <TipSubmitForm
          destination={slug}
          destinationName={destinationName}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  )
}
