import Link from 'next/link'
import Image from 'next/image'

export default function BlogCard({ slug, tag, title, readTime, summary, image, placeholderColor }) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-[#D3D1C7] shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Cover image */}
      <div
        style={{
          position: 'relative',
          height: '120px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: placeholderColor,
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Card content */}
      <div className="p-6">
        <div className="font-inter text-[11px] font-medium text-[#1D9E75] tracking-[2.5px] uppercase mb-3">{tag}</div>
        <h3
          className="font-playfair text-base text-[#085041] mb-3 group-hover:text-[#1D9E75] transition-colors"
          style={{ letterSpacing: '0.01em', lineHeight: '1.35', fontWeight: '600' }}
        >
          {title}
        </h3>
        {summary && (
          <p className="font-inter text-sm text-[#5F5E5A] leading-relaxed mb-4">{summary}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-inter text-xs text-[#888780]">{readTime} min read</span>
          <span className="font-inter text-[#1D9E75] text-sm font-semibold flex items-center gap-1">
            Read
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
