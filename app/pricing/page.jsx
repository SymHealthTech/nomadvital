import PricingSection from '@/components/public/PricingSection'

export const metadata = {
  title: 'Pricing — Pro Plan for AI Travel Health',
  description:
    'Start free or upgrade to NomadVital Pro for unlimited AI health questions and 50+ destination guides. From $8.25/mo billed annually. 7-day free trial.',
  keywords: ['travel health app pricing', 'NomadVital pro', 'AI travel advisor subscription'],
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
