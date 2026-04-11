import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#085041] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <span className="text-sm text-[#9FE1CB]">
            © 2025 NomadVital &middot; a product by <span className="text-white font-medium">Sym HealthTech</span>
          </span>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="text-[#9FE1CB] hover:text-white transition-colors">
              Privacy policy
            </Link>
            <Link href="/disclaimer" className="text-[#9FE1CB] hover:text-white transition-colors">
              Medical disclaimer
            </Link>
            <Link href="/contact" className="text-[#9FE1CB] hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>

        <hr className="border-[#0F6E56] mb-6" />

        {/* Medical disclaimer */}
        <p className="text-xs text-[#9FE1CB] leading-relaxed max-w-4xl mx-auto text-center">
          NomadVital provides general health and nutrition information for educational and
          informational purposes only. The content on this website, including all AI-generated
          responses, is not medical advice and is not a substitute for professional medical
          consultation, diagnosis, or treatment. Always seek the advice of your physician or a
          qualified healthcare provider before making dietary changes or traveling with a medical
          condition.
        </p>
      </div>
    </footer>
  )
}
