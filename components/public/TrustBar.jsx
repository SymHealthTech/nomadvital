export default function TrustBar() {
  const countries = ['USA', 'UK', 'Australia', 'Germany', 'Japan', 'UAE', 'India', 'Canada']

  return (
    <div className="bg-[#0F6E56] py-4 border-y border-[#085041]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Mobile: 3 compact stats in one row */}
        <div className="flex md:hidden items-center justify-around gap-2">
          <div className="flex items-center gap-1.5 text-white text-xs">
            <svg className="w-3.5 h-3.5 text-[#5DCAA5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-[#9FE1CB] font-medium">Research-backed</span>
          </div>
          <div className="w-px h-4 bg-[#085041]" />
          <div className="flex items-center gap-1.5 text-white text-xs">
            <svg className="w-3.5 h-3.5 text-[#5DCAA5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[#9FE1CB] font-medium">50+ guides</span>
          </div>
          <div className="w-px h-4 bg-[#085041]" />
          <div className="flex items-center gap-1.5 text-white text-xs">
            <svg className="w-3.5 h-3.5 text-[#5DCAA5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[#9FE1CB] font-medium">40+ countries</span>
          </div>
        </div>

        {/* Desktop: stats row + country pills row below */}
        <div className="hidden md:flex flex-col items-center gap-2">
          <div className="flex items-center justify-center divide-x divide-[#085041]">
            <div className="flex items-center gap-2 px-4 py-1 text-white text-sm">
              <svg className="w-4 h-4 text-[#5DCAA5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Built on health and nutrition research</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1 text-white text-sm">
              <svg className="w-4 h-4 text-[#5DCAA5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>50+ destination guides</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1 text-white text-sm">
              <svg className="w-4 h-4 text-[#5DCAA5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Travelers from 40+ countries</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#9FE1CB] text-xs">Including</span>
            <div className="flex gap-1">
              {countries.map((c) => (
                <span key={c} className="bg-[#085041] text-[#9FE1CB] text-xs px-2 py-0.5 rounded-full font-medium">{c}</span>
              ))}
              <span className="bg-[#085041] text-[#9FE1CB] text-xs px-2 py-0.5 rounded-full font-medium">+more</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
