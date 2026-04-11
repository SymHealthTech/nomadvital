import Link from 'next/link'
import BlogCard from './BlogCard'

const articles = [
  {
    slug: '10-foods-diabetics-avoid-traveling',
    tag: 'DIABETES · TRAVEL',
    title: '10 foods diabetics must avoid while traveling abroad',
    readTime: 5,
    summary: 'Hidden sugars in sauces, high-GI staple foods, and drinks that spike blood sugar — what to watch for in every destination.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    placeholderColor: '#C0DD97',
  },
  {
    slug: 'gluten-free-japan-complete-guide',
    tag: 'GLUTEN-FREE · JAPAN',
    title: 'How to eat gluten-free in Japan — a complete guide',
    readTime: 7,
    summary: "Soy sauce is everywhere. Here's how to navigate Japanese cuisine safely with celiac disease or gluten sensitivity.",
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
    placeholderColor: '#C0DD97',
  },
  {
    slug: 'water-safety-international-travelers-2025',
    tag: 'WATER SAFETY · GLOBAL',
    title: 'Water safety guide for international travelers in 2025',
    readTime: 6,
    summary: "Which countries have safe tap water, which don't, and what to do in high-risk destinations to avoid getting sick.",
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    placeholderColor: '#C0DD97',
  },
]

export default function BlogSection() {
  return (
    <section className="bg-[#F1EFE8] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#085041] mb-2" style={{ letterSpacing: '0.01em', lineHeight: '1.3', fontWeight: '600' }}>
              Health &amp; travel articles
            </h2>
            <p className="font-inter text-[#5F5E5A] text-lg">
              Research-backed guides for travelers with dietary conditions.
            </p>
          </div>
          <Link
            href="/blog"
            className="font-inter shrink-0 border border-[#085041] text-[#085041] hover:bg-[#085041] hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            View all articles
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((a) => (
            <BlogCard key={a.slug} {...a} />
          ))}
        </div>
      </div>
    </section>
  )
}
