import Link from 'next/link'

export default function PaywallOverlay({ message = 'This content is available to Pro members.' }) {
  return (
    <div className="relative">
      {/* Blurred content placeholder */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 rounded-2xl">
        <div className="w-12 h-12 bg-[#E1F5EE] rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-[#1D9E75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#085041] mb-2 text-center">Pro content</h3>
        <p className="text-[#5F5E5A] text-sm text-center mb-6 max-w-xs">{message}</p>
        <Link
          href="/pricing"
          className="bg-[#1D9E75] hover:bg-[#085041] text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
        >
          Upgrade to Pro — $12/mo
        </Link>
        <Link href="/signup" className="text-[#888780] text-xs mt-3 hover:text-[#085041] transition-colors">
          Or start free →
        </Link>
      </div>
    </div>
  )
}
