export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { travelerPersonas, getPersonaBySlug } from '@/lib/travelerPersonas'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import PricingSection from '@/components/public/PricingSection'

export async function generateMetadata({ params }) {
  const persona = getPersonaBySlug(params.type)
  if (!persona) return {}
  return {
    title: persona.metaTitle,
    description: persona.metaDescription,
    alternates: {
      canonical: `https://nomadvital.com/for/${params.type}`,
    },
  }
}

// Hardcoded AI demo answers per persona
const aiDemoAnswers = {
  'general-traveler': {
    question: 'I have a nut allergy and I am traveling to Thailand next month. Which dishes should I avoid?',
    answer: `Thailand uses peanuts extensively — they appear in pad thai, satay sauces, some curries, and many street food garnishes. Key dishes to avoid or verify carefully: pad thai (almost always contains ground peanuts), massaman curry (peanuts in the sauce base), satay skewers (peanut dipping sauce), and som tum (green papaya salad often has peanuts). Safe options to explore: most plain rice dishes, grilled meats without sauce, tom yum soup (confirm no peanuts), and freshly made noodle soups where you can watch preparation. Carry a Thai allergy card (available free online) explaining your nut allergy — Thai kitchen staff respond well to written communication. Always ask "mai sai tua lisong" (no peanuts) when ordering. Note: general wellness information only — not medical advice. Always consult your doctor before traveling with a severe allergy.`,
  },
  'marathon-runners': {
    question: 'I am running the Tokyo Marathon next month. What local foods are best for carb loading the night before? What should I avoid to prevent GI issues on race day?',
    answer: `Great timing to plan this. For carb loading in Tokyo the night before your race: Safe high-carb choices — tonkotsu or shoyu ramen (request no extra oil), plain onigiri (rice balls) from any convenience store, udon noodles with light broth, white rice with grilled salmon at most izakayas. Avoid: high-fibre soba, raw fish (sushi) the night before due to GI risk, tempura (heavy oil), and excessive soy sauce (sodium). On race morning: convenience store bananas and plain rice crackers are runner staples. Carry your own gels — Japanese aid stations provide sports drinks but not always gels. Note: general wellness information only — not medical advice. Consult your sports nutritionist for personal race-day protocols.`,
  },
  'ironman-triathlete': {
    question: 'I am doing Ironman Malaysia next month. The heat and humidity will be extreme. What electrolyte foods are available locally and how should I adjust my nutrition in the final week before the race?',
    answer: `Ironman Malaysia in the heat and humidity is one of the toughest courses nutritionally. Final week priorities: increase sodium intake — Malaysian food is naturally high in salt which works in your favour. Local electrolyte sources: 100Plus isotonic drink (widely available), young coconut water (fresh at any hawker centre — superior to packaged), and salted crackers. Safe protein sources: grilled fish at hawker stalls, tofu, eggs, chicken rice. Avoid high-fibre foods from day 3 before race. Race morning at 6:30am start: eat by 4am — plain white rice, banana, and a pinch of salt. Avoid nasi lemak (coconut rice, too high-fat). Note: general wellness information only — not medical advice.`,
  },
  'mountaineers-trekkers': {
    question: 'I am trekking to Everest Base Camp next month. What should I eat during the acclimatisation days? Are there foods to avoid that worsen altitude sickness?',
    answer: `For EBC acclimatisation days, nutrition is critical. Increase carbohydrates significantly — at altitude your body burns more glycogen. Good local options in the tea houses: dal bhat (lentils and rice — perfect for altitude, iron-rich), tsampa (roasted barley porridge — traditional high-altitude Sherpa food), garlic soup (proven to reduce AMS symptoms — order it at every stop). Avoid alcohol completely until you are well acclimatised — it suppresses the hypoxic ventilatory response. Avoid heavy fats on acclimatisation days. Drink 4–5 litres of water daily. Iron tip: the altitude decreases oxygen absorption — dal and spinach dishes support iron levels for better oxygen carrying. Note: general wellness information only — not medical advice. Consult a travel medicine specialist before high altitude expeditions.`,
  },
  'business-travelers': {
    question: 'I am flying London to Singapore for a 3-day conference. I land at 6am local time after a 13-hour flight. What should I eat on the plane and immediately after landing to minimise jet lag and be sharp for meetings starting at 9am?',
    answer: `London to Singapore is a challenging eastward crossing. On the plane: avoid alcohol entirely (it fragments sleep and worsens jet lag). Eat lightly in the first 4 hours, then fast for the final 5–6 hours of the flight — this activates your liver clock to reset faster to Singapore time. Hydrate constantly. On landing at 6am Singapore time: eat a protein-forward breakfast immediately — local options at Changi or your hotel: kaya toast with eggs (Singaporean staple), soft-boiled eggs with rice, or a Western omelette. Avoid pastries and sugary options that cause an energy spike then crash before your 9am meeting. Bright light exposure from 6–8am is as important as food — get outside or sit by a window. Coffee is fine after 7am — avoid it earlier or it disrupts your cortisol awakening response. Note: general wellness information only — not medical advice.`,
  },
  'wellness-travelers': {
    question: 'I am going to a 21-day yoga retreat in Rishikesh, India. I want to eat as sattvic and plant-based as possible. What local foods support this and what should I be careful about food safety wise?',
    answer: `Rishikesh is one of the best destinations for sattvic eating — the town is predominantly vegetarian and many restaurants align with yogic principles. Ideal sattvic foods available locally: khichdi (rice and mung dal — the classic sattvic meal, easy to digest), fresh paneer, seasonal vegetables cooked with ghee and mild spices, moong dal soup, fresh fruit from the market (bananas, papayas, pomegranates), and lassi made at established cafes. Avoid: onion and garlic (considered rajasic/tamasic in Ayurveda), packaged or fried snacks, and meat entirely in Rishikesh. Food safety priorities: drink only filtered or bottled water — this is non-negotiable. Eat cooked food from clean, established venues. Be cautious with pre-cut fruit from street stalls. Many retreat centres serve their own kitchen meals — this is your safest and most sattvic option. Note: general wellness information only — not medical advice.`,
  },
}

// Persona-specific destination cards
const personaDestinations = {
  'general-traveler': [
    { name: 'Thailand', caption: 'Street food safety guide', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=75' },
    { name: 'Japan', caption: 'Allergen awareness guide', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=75' },
    { name: 'Mexico', caption: 'Water & food safety guide', img: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&q=75' },
    { name: 'Italy', caption: 'Gluten-free traveler guide', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=75' },
  ],
  'marathon-runners': [
    { name: 'Japan', caption: 'Tokyo Marathon — carb loading guide', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=75' },
    { name: 'Germany', caption: 'Berlin Marathon — race nutrition guide', img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&q=75' },
    { name: 'Thailand', caption: 'Race-day GI safety in tropical heat', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=75' },
    { name: 'Italy', caption: 'Rome Marathon — pasta loading guide', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=75' },
  ],
  'ironman-triathlete': [
    { name: 'Malaysia', caption: 'Ironman Malaysia — heat & electrolyte guide', img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=75' },
    { name: 'Japan', caption: 'Ironman Japan — race-day nutrition guide', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=75' },
    { name: 'Italy', caption: 'Ironman Italy — carb & recovery guide', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=75' },
    { name: 'Thailand', caption: 'Triathlon nutrition in tropical conditions', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=75' },
  ],
  'mountaineers-trekkers': [
    { name: 'Nepal', caption: 'Everest Base Camp — altitude nutrition', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=75' },
    { name: 'Peru', caption: 'Machu Picchu & Inca Trail food guide', img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&q=75' },
    { name: 'Tanzania', caption: 'Kilimanjaro — acclimatisation nutrition', img: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=75' },
    { name: 'Switzerland', caption: 'Alps trekking nutrition guide', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=75' },
  ],
  'business-travelers': [
    { name: 'Singapore', caption: 'Business dining guide — healthy hawker picks', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=75' },
    { name: 'Japan', caption: 'Tokyo business traveler nutrition guide', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=75' },
    { name: 'Germany', caption: 'Frankfurt conference nutrition guide', img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&q=75' },
    { name: 'Thailand', caption: 'Bangkok business trip food guide', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=75' },
  ],
  'wellness-travelers': [
    { name: 'India', caption: 'Rishikesh & Goa — sattvic & Ayurvedic guide', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=75' },
    { name: 'Thailand', caption: 'Koh Samui retreat nutrition guide', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=75' },
    { name: 'Bali', caption: 'Plant-based & wellness eating guide', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=75' },
    { name: 'Japan', caption: 'Shojin ryori — Buddhist wellness food', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=75' },
  ],
}

// Hero background images per persona
const heroImages = {
  'general-traveler':    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80',
  'marathon-runners':    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&q=80',
  'ironman-triathlete':  'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1400&q=80',
  'mountaineers-trekkers': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80',
  'business-travelers':  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80',
  'wellness-travelers':  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1400&q=80',
}

// Persona benefit cards
const personaBenefits = {
  'general-traveler': [
    { title: 'Food safety by country', desc: 'Know which foods are safe and which to avoid based on local food hygiene standards and common allergens.' },
    { title: 'Allergy alerts abroad', desc: 'Get specific guidance on hidden allergens in local cuisines and how to communicate your needs to restaurants.' },
    { title: 'Stay well, not just alive', desc: 'Practical nutrition advice so you feel energised throughout your trip — not just surviving on safe bland food.' },
  ],
  'marathon-runners': [
    { title: 'Race-specific nutrition', desc: 'Carb loading plans and GI-safe food lists for your specific race destination.' },
    { title: 'Local food translated', desc: 'Know exactly which local dishes fuel performance and which cause race-day problems.' },
    { title: 'Recovery after the finish', desc: 'Post-race nutrition guidance using locally available foods for faster recovery.' },
  ],
  'ironman-triathlete': [
    { title: 'Electrolyte management', desc: 'Destination-specific electrolyte sources and heat acclimatisation nutrition for Ironman courses worldwide.' },
    { title: 'Protein sourcing abroad', desc: 'Find quality local protein sources to maintain your training load without GI risk.' },
    { title: 'Multi-day race nutrition', desc: 'Nutrition planning for race week, taper, race day, and 8–12 hour recovery — all using local foods.' },
  ],
  'mountaineers-trekkers': [
    { title: 'Altitude nutrition science', desc: 'Understand how calorie needs, iron, and hydration change at elevation — and which local foods deliver.' },
    { title: 'AMS prevention foods', desc: 'Foods that support acclimatisation and the ones that worsen altitude sickness to avoid.' },
    { title: 'Trail food planning', desc: 'Calorie-dense local foods available for packing, and food safety guidance without refrigeration.' },
  ],
  'business-travelers': [
    { title: 'Jet lag eating protocols', desc: 'Strategic fasting and eating windows on long-haul flights to arrive sharp and reset your body clock faster.' },
    { title: 'Hotel & airport nutrition', desc: 'Healthy high-performance choices in business hotels, airport lounges, and conference venues worldwide.' },
    { title: 'Client dinner navigation', desc: 'How to eat well at business entertainment meals in every culture without sacrificing your health goals.' },
  ],
  'wellness-travelers': [
    { title: 'Plant-based by destination', desc: 'Vegan and vegetarian eating guides for every country — including the hidden animal ingredients to watch for.' },
    { title: 'Ayurvedic food guidance', desc: 'Sattvic food principles and Ayurvedic eating guidance tailored to your retreat destination.' },
    { title: 'Retreat food safety', desc: 'Food safety guidance specific to wellness retreats, local markets, and plant-based restaurants abroad.' },
  ],
}

// Extra pro feature line per persona
const proFeatureLine = {
  'general-traveler': '50+ country food safety guides',
  'marathon-runners': 'Race-specific nutrition guides for World Majors',
  'ironman-triathlete': 'Multi-sport event nutrition planning',
  'mountaineers-trekkers': 'High-altitude destination guides',
  'business-travelers': 'Jet lag management nutrition plans',
  'wellness-travelers': 'Plant-based destination guides',
}

function darken(hex, amount = 0.15) {
  const num = parseInt(hex.slice(1), 16)
  const r = Math.max(0, (num >> 16) - Math.round(255 * amount))
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount))
  const b = Math.max(0, (num & 0xff) - Math.round(255 * amount))
  return `rgb(${r},${g},${b})`
}

export default async function PersonaLandingPage({ params }) {
  const session = await auth()
  const isPro = session?.user?.plan === 'pro'
  const isLoggedIn = !!session

  const persona = getPersonaBySlug(params.type)
  if (!persona) notFound()

  const demo = aiDemoAnswers[persona.slug]
  const destinations = personaDestinations[persona.slug] || personaDestinations['general-traveler']
  const benefits = personaBenefits[persona.slug] || personaBenefits['general-traveler']
  const proLine = proFeatureLine[persona.slug] || '50+ destination guides'
  const trustBg = darken(persona.color)
  const heroBg = heroImages[persona.slug]

  return (
    <>
      {/* SECTION 1 — HERO */}
      <section style={{ position: 'relative', color: '#fff', padding: '80px 24px 68px', overflow: 'hidden', background: persona.color }}>
        {/* Background image */}
        {heroBg && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.55,
          }} />
        )}
        {/* Gradient overlay — keeps text readable while image shows through */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${persona.color}CC 0%, ${persona.color}99 50%, ${persona.color}66 100%)`,
        }} />
        <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '20px',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
          }}>
            For {persona.name}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: '700',
            lineHeight: '1.25',
            color: '#fff',
            marginBottom: '16px',
          }}>
            {persona.heroHeadline}
          </h1>
          <p style={{
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            fontSize: '15px',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: '560px',
            margin: '0 auto 28px',
            lineHeight: '1.6',
          }}>
            {persona.heroSub}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isPro ? (
              <>
                <Link href="/ask" style={{ background: '#fff', color: persona.color, fontWeight: '700', fontSize: '14px', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  Ask AI Advisor →
                </Link>
                <Link href="/destinations" style={{ background: 'transparent', color: '#fff', fontWeight: '600', fontSize: '14px', padding: '12px 24px', borderRadius: '10px', border: '1.5px solid rgba(255,255,255,0.6)', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  View destinations
                </Link>
              </>
            ) : (
              <>
                <Link href={isLoggedIn ? '/pricing' : '/signup'} style={{ background: '#fff', color: persona.color, fontWeight: '700', fontSize: '14px', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  {isLoggedIn ? 'Upgrade to Pro →' : 'Start free →'}
                </Link>
                <Link href="#how-it-works" style={{ background: 'transparent', color: '#fff', fontWeight: '600', fontSize: '14px', padding: '12px 24px', borderRadius: '10px', border: '1.5px solid rgba(255,255,255,0.6)', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  See how it works
                </Link>
              </>
            )}
          </div>
          {!isPro && (
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '12px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Cancel anytime · No card needed
            </p>
          )}
        </div>
      </section>

      {/* SECTION 2 — TRUST STRIP */}
      <section style={{ background: trustBg, padding: '14px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontFamily: 'var(--font-inter, Inter, sans-serif)', letterSpacing: '0.3px' }}>
          Built on nutrition and health research · 50+ destination guides · Travelers from 40+ countries
        </div>
      </section>

      {/* SECTION 3 — TOP CONCERNS */}
      <section style={{ background: '#fff', padding: '60px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: '600',
            color: '#085041',
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            Your specific nutrition challenges abroad
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
          }}>
            {persona.topConcerns.map((concern, i) => (
              <div key={i} style={{
                background: persona.lightColor,
                border: `1px solid ${persona.color}4D`,
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M20 6L9 17l-5-5" stroke={persona.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: '13px', color: '#085041', lineHeight: '1.4', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  {concern}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — AI DEMO */}
      <section id="how-it-works" style={{ background: persona.color, padding: '60px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* Section heading — matches homepage layout */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(0,0,0,0.18)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '11px',
              fontWeight: '600',
              padding: '4px 14px',
              borderRadius: '20px',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              marginBottom: '16px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}>
              AI ADVISOR — LIVE DEMO
            </div>
            <h2 style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '10px',
              letterSpacing: '0.01em',
              lineHeight: '1.3',
            }}>
              Ask anything. Get answers built for {persona.name}.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '15px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Here&rsquo;s a real example of what NomadVital&rsquo;s AI advisor looks like in action.
            </p>
          </div>

          {/* Chat window — matches homepage ChatDemo design */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            overflow: 'hidden',
          }}>
            {/* Chat header bar */}
            <div style={{
              background: '#085041',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              {/* NomadVital logo mark */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#1D9E75',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
                    <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
                    <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
                  </svg>
                </div>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '15px', letterSpacing: '-0.3px', color: '#E1F5EE', fontWeight: 700 }}>
                  Nomad<span style={{ fontWeight: 400, fontStyle: 'italic', color: '#5DCAA5' }}>Vital</span>
                </span>
              </div>
              <div style={{ marginLeft: '4px', paddingLeft: '12px', borderLeft: '1px solid #0F6E56' }}>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  AI Advisor
                </div>
                <div style={{ color: '#9FE1CB', fontSize: '11px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  Online · Powered by Claude
                </div>
              </div>
            </div>

            {/* Messages */}
            {demo && (
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', minHeight: '200px' }}>
                {/* User bubble */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    background: persona.lightColor,
                    color: '#085041',
                    borderRadius: '16px 16px 4px 16px',
                    padding: '11px 15px',
                    maxWidth: '80%',
                    fontSize: '13px',
                    lineHeight: '1.55',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}>
                    {demo.question}
                  </div>
                </div>

                {/* AI bubble + disclaimer */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '88%' }}>
                    <div style={{
                      background: '#F1EFE8',
                      color: '#085041',
                      borderRadius: '16px 16px 16px 4px',
                      padding: '13px 15px',
                      fontSize: '13px',
                      lineHeight: '1.65',
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {demo.answer}
                    </div>
                    {/* Disclaimer sub-box */}
                    <div style={{
                      background: '#085041',
                      color: '#9FE1CB',
                      borderRadius: '10px',
                      padding: '9px 13px',
                      fontSize: '11px',
                      lineHeight: '1.55',
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    }}>
                      General wellness information for educational purposes only — not medical advice. Always consult your doctor before making changes to your diet or travel health plan.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Disabled input bar */}
            <div style={{
              borderTop: '1px solid #D3D1C7',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <input
                type="text"
                placeholder="Ask about your health condition and destination..."
                disabled
                style={{
                  flex: 1,
                  fontSize: '13px',
                  color: '#888780',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  cursor: 'default',
                }}
              />
              <button
                disabled
                style={{
                  background: '#1D9E75',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  opacity: 0.55,
                  cursor: 'not-allowed',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                Ask
              </button>
            </div>
          </div>

          {/* CTA row */}
          {isPro ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link href="/ask" style={{ background: '#fff', color: persona.color, fontWeight: '700', fontSize: '14px', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)', display: 'inline-block' }}>
                Ask AI Advisor →
              </Link>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '16px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                {isLoggedIn ? '3 free questions per day — ask your own question now.' : 'Try free — no account needed. 3 questions per day, unlimited with Pro.'}
              </p>
              <Link href={isLoggedIn ? '/ask' : '/guest'} style={{ background: '#fff', color: persona.color, fontWeight: '700', fontSize: '14px', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'var(--font-inter, Inter, sans-serif)', display: 'inline-block' }}>
                {isLoggedIn ? 'Ask now →' : 'Try it free →'}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5 — DESTINATIONS */}
      <section style={{ background: '#F1EFE8', padding: '60px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: '600',
            color: '#085041',
            textAlign: 'center',
            marginBottom: '28px',
          }}>
            Destinations with guides for {persona.name}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {destinations.map((dest, i) => (
              <Link key={i} href={`/destinations/${dest.name.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #D3D1C7',
                  transition: 'transform 0.15s ease',
                }}>
                  <div style={{
                    height: '80px',
                    background: dest.img ? `url(${dest.img}) center/cover` : persona.lightColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {!dest.img && (
                      <span style={{ fontSize: '28px' }}>🌍</span>
                    )}
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#085041', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                      {dest.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#5F5E5A', marginTop: '2px', lineHeight: '1.4', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                      {dest.caption}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — BENEFITS */}
      <section style={{ background: '#fff', padding: '60px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: '600',
            color: '#085041',
            textAlign: 'center',
            marginBottom: '28px',
          }}>
            Built specifically for {persona.name}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{
                background: persona.lightColor,
                borderRadius: '14px',
                padding: '20px',
                border: `1px solid ${persona.color}30`,
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: persona.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#085041', marginBottom: '6px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#5F5E5A', lineHeight: '1.5', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — PRICING (hidden for Pro users) */}
      {!isPro && <PricingSection />}

    </>
  )
}
