import Link from 'next/link'
import Image from 'next/image'

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

function MiniStars({ average, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4, marginBottom: 6 }}>
      <svg width="12" height="12" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
        <path d={STAR_PATH} fill="#EF9F27" stroke="none" />
      </svg>
      <span style={{ fontSize: 11, color: '#888780', fontFamily: 'var(--font-inter), sans-serif' }}>
        {average.toFixed(1)}&nbsp;
        <span style={{ color: '#C0C0BB' }}>({total})</span>
      </span>
    </div>
  )
}

export default function DestinationCard({
  name,
  slug,
  description,
  image,
  placeholderColor,
  averageRating,
  totalRatings,
}) {
  return (
    <Link
      href={`/destinations/${slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-[#D3D1C7] shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Cover image */}
      <div
        style={{
          position: 'relative',
          height: '140px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: placeholderColor,
        }}
      >
        <Image
          src={image}
          alt={`${name} travel and food`}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="p-5">
        <h3
          className="font-playfair text-lg text-[#085041] mb-1 group-hover:text-[#1D9E75] transition-colors"
          style={{ fontWeight: '600', letterSpacing: '0.01em' }}
        >
          {name}
        </h3>
        {totalRatings > 0 && <MiniStars average={averageRating} total={totalRatings} />}
        <p className="font-inter text-sm text-[#5F5E5A] leading-relaxed">{description}</p>

        <div className="flex items-center gap-1 mt-4 text-[#1D9E75] text-sm font-semibold font-inter">
          View guide
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
