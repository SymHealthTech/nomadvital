import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Destination from '@/models/Destination'

export const metadata = {
  title: 'Destination Health Guides — 50+ Countries',
  description:
    'Country-specific food safety guides for travelers. Get condition-specific advice for diabetes, gluten-free diets, and allergies across 50+ destinations worldwide.',
  keywords: [
    'destination health guide',
    'food safety by country',
    'travel dietary guide',
    'gluten free destination guide',
    'diabetes travel guide by country',
  ],
  openGraph: {
    title: 'Destination Health Guides — 50+ Countries | NomadVital',
    url: 'https://nomadvital.com/destinations',
  },
}

// Static metadata per destination (flags, placeholder colors, descriptions)
const DEST_META = {
  japan:    { flag: '🇯🇵', placeholder: '#E1F5EE', description: 'Navigate soy sauce, gluten, and allergens in Japanese cuisine — with safe options for every dietary need.' },
  thailand: { flag: '🇹🇭', placeholder: '#FFF3E0', description: 'Manage nut allergies, diabetes, and spice sensitivity across Thai street food and restaurants.' },
  italy:    { flag: '🇮🇹', placeholder: '#E8F4FD', description: "Eating gluten-free in pasta country, managing lactose intolerance, and Italy's celiac-friendly options." },
  mexico:   { flag: '🇲🇽', placeholder: '#FAECE7', description: "Water safety, traveler's diarrhea prevention, and safe eating for diabetics and vegans." },
  nepal:    { flag: '🇳🇵', placeholder: '#FBF0E8', description: 'High altitude nutrition, water safety, and trekking food guide for Himalayan travelers.' },
  singapore:{ flag: '🇸🇬', placeholder: '#E8EFF8', description: 'Navigating hawker centres with allergies, diabetes, and special diets in Singapore.' },
  india:    { flag: '🇮🇳', placeholder: '#EAF3DE', description: 'Vegetarian travel, spice sensitivity, and safe eating across India\'s diverse regions.' },
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

export default async function DestinationsPage() {
  const session = await auth()
  const isPro = session?.user?.plan === 'pro'

  let destinations = []
  try {
    await connectDB()
    const docs = await Destination.find({ isPublished: true })
      .select('name slug conditions isFree averageRating totalRatings image')
      .sort({ isFree: -1, name: 1 })
    destinations = JSON.parse(JSON.stringify(docs))
  } catch {
    // fall through — empty state shown below
  }

  return (
    <div>
      {/* Page header */}
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
          Destination health guides
        </h1>
        <p style={{ color: '#9FE1CB', fontSize: '17px', maxWidth: '520px', margin: '0 auto', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Country-specific food safety, allergen awareness, and nutrition guidance — tailored to your dietary conditions.
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Free vs Pro label */}
        {!isPro && destinations.some(d => !d.isFree) && (
          <div
            style={{
              background: '#F1EFE8',
              border: '1px solid #D3D1C7',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              color: '#5F5E5A',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            <svg width="16" height="16" fill="none" stroke="#1D9E75" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <span>
              <strong style={{ color: '#085041' }}>5 guides are free.</strong> Unlock all destinations with{' '}
              <Link href="/pricing" style={{ color: '#1D9E75', textDecoration: 'underline', fontWeight: '600' }}>
                Pro — from $8.25/mo
              </Link>
            </span>
          </div>
        )}

        {destinations.length === 0 ? (
          <div style={{ background: '#F1EFE8', borderRadius: '16px', padding: '48px', textAlign: 'center', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            Destination guides coming soon.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {destinations.map((dest) => {
              const meta = DEST_META[dest.slug] || {}
              const isLocked = !dest.isFree && !isPro

              return (
                <div key={dest.slug} style={{ position: 'relative' }}>
                  {/* Card */}
                  <Link
                    href={`/destinations/${dest.slug}`}
                    style={{
                      display: 'block',
                      background: '#fff',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid #D3D1C7',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      textDecoration: 'none',
                      transition: 'box-shadow 0.15s',
                      pointerEvents: isLocked ? 'none' : 'auto',
                    }}
                    tabIndex={isLocked ? -1 : 0}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', height: '150px', width: '100%', backgroundColor: meta.placeholder || '#F1EFE8' }}>
                      {dest.image && (
                        <Image
                          src={dest.image}
                          alt={`${dest.name} travel and food guide`}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      )}
                      {/* Free badge — only show to non-pro users */}
                      {dest.isFree && !isPro && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: '#085041',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '20px',
                          letterSpacing: '0.5px',
                          fontFamily: 'var(--font-inter, Inter, sans-serif)',
                        }}>
                          FREE
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '16px 18px 18px' }}>
                      {/* Name + flag */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
                        {meta.flag && (
                          <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>{meta.flag}</span>
                        )}
                        <h3 style={{
                          fontFamily: 'var(--font-playfair, Georgia, serif)',
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#085041',
                          letterSpacing: '0.01em',
                          margin: 0,
                        }}>
                          {dest.name}
                        </h3>
                      </div>

                      {/* Star rating */}
                      {dest.totalRatings > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#EF9F27"/>
                          </svg>
                          <span style={{ fontSize: '11px', color: '#888780', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                            {dest.averageRating.toFixed(1)}{' '}
                            <span style={{ color: '#C0C0BB' }}>({dest.totalRatings})</span>
                          </span>
                        </div>
                      )}

                      {/* Condition pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                        {(dest.conditions || []).slice(0, 4).map((c) => {
                          const s = conditionStyle(c)
                          return (
                            <span key={c} style={{
                              background: s.bg,
                              color: s.color,
                              fontSize: '10px',
                              fontWeight: '500',
                              padding: '2px 8px',
                              borderRadius: '20px',
                              fontFamily: 'var(--font-inter, Inter, sans-serif)',
                            }}>
                              {c}
                            </span>
                          )
                        })}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1D9E75', fontSize: '13px', fontWeight: '600', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                        View guide
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </Link>

                  {/* Paywall overlay for locked cards */}
                  {isLocked && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255,255,255,0.72)',
                      backdropFilter: 'blur(3px)',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                      gap: '8px',
                    }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        background: '#E1F5EE',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <svg width="16" height="16" fill="none" stroke="#1D9E75" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#085041', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                        Pro guide
                      </div>
                      <Link
                        href="/pricing"
                        style={{
                          fontSize: '12px',
                          color: '#1D9E75',
                          fontWeight: '600',
                          textDecoration: 'underline',
                          fontFamily: 'var(--font-inter, Inter, sans-serif)',
                        }}
                      >
                        Upgrade to unlock →
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Bottom CTA for free users */}
        {!isPro && (
          <div style={{
            marginTop: '48px',
            background: '#085041',
            borderRadius: '16px',
            padding: '32px 28px',
            textAlign: 'center',
            color: '#fff',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: '22px',
              fontWeight: '600',
              marginBottom: '10px',
            }}>
              Unlock all destination guides
            </h2>
            <p style={{ color: '#9FE1CB', fontSize: '14px', marginBottom: '20px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              50+ destinations covered. Cancel anytime.
            </p>
            <Link
              href="/pricing"
              style={{
                display: 'inline-block',
                background: '#1D9E75',
                color: '#fff',
                fontWeight: '700',
                fontSize: '14px',
                padding: '12px 28px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              See plans — from $8.25/mo
            </Link>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '8px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              7-day free trial · No charge until day 8 · Cancel anytime
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
