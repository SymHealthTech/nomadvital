import Link from 'next/link'
import DestinationCard from './DestinationCard'
import connectDB from '@/lib/mongodb'
import Destination from '@/models/Destination'

const destinations = [
  {
    name: 'Japan',
    slug: 'japan',
    description: 'Navigate soy, gluten, and allergens in Japanese cuisine — with safe options for every dietary need.',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    placeholderColor: '#1D9E75',
  },
  {
    name: 'Thailand',
    slug: 'thailand',
    description: 'Manage diabetes, nut allergies, and spice sensitivity across Thai street food and restaurants.',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
    placeholderColor: '#EF9F27',
  },
  {
    name: 'Italy',
    slug: 'italy',
    description: "Eating gluten-free in pasta country, managing lactose intolerance, and Italy's celiac-friendly options.",
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
    placeholderColor: '#378ADD',
  },
  {
    name: 'Mexico',
    slug: 'mexico',
    description: "Water safety, traveler's diarrhea prevention, and safe eating for IBS and sensitive stomachs.",
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80',
    placeholderColor: '#D85A30',
  },
]

async function getRatings() {
  try {
    await connectDB()
    const slugs = destinations.map((d) => d.slug)
    const docs = await Destination.find({ slug: { $in: slugs } }).select('slug averageRating totalRatings')
    return Object.fromEntries(docs.map((d) => [d.slug, { averageRating: d.averageRating, totalRatings: d.totalRatings }]))
  } catch {
    return {}
  }
}

export default async function DestinationsSection() {
  const ratings = await getRatings()

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#085041] mb-2" style={{ letterSpacing: '0.01em', lineHeight: '1.3', fontWeight: '600' }}>
              Destination health guides
            </h2>
            <p className="font-inter text-[#5F5E5A] text-lg">
              50+ countries covered — each tailored to common traveler health conditions.
            </p>
          </div>
          <Link
            href="/destinations"
            className="font-inter shrink-0 border border-[#085041] text-[#085041] hover:bg-[#085041] hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            View all guides
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map((d) => (
            <DestinationCard
              key={d.slug}
              {...d}
              averageRating={ratings[d.slug]?.averageRating ?? 0}
              totalRatings={ratings[d.slug]?.totalRatings ?? 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
