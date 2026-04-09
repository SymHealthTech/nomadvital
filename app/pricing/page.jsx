import PricingSection from '@/components/public/PricingSection'

export const metadata = {
  title: 'Pricing — NomadVital',
  description: 'Start free or upgrade to Pro for unlimited AI questions and 50+ destination guides.',
}

export default function PricingPage() {
  return (
    <div>
      <div className="bg-[#085041] text-white py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Plans &amp; Pricing</h1>
        <p className="text-[#9FE1CB] text-lg">Start free. Upgrade when you need more.</p>
      </div>
      <PricingSection />
    </div>
  )
}
