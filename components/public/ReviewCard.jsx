export default function ReviewCard({ name, detail, quote, stars = 5 }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#D3D1C7] shadow-sm">
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: stars }).map((_, i) => (
          <svg key={i} className="w-5 h-5 text-[#EF9F27]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="font-playfair italic text-[#085041] text-base mb-5" style={{ letterSpacing: '0.01em', lineHeight: '1.65' }}>&ldquo;{quote}&rdquo;</p>

      {/* Reviewer */}
      <div>
        <div className="font-inter font-semibold text-[#085041] text-sm">{name}</div>
        {detail && <div className="font-inter text-[#888780] text-xs mt-0.5">{detail}</div>}
      </div>
    </div>
  )
}
