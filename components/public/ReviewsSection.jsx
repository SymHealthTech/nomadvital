import ReviewCard from './ReviewCard'

const reviews = [
  {
    name: 'Rajesh K.',
    detail: 'Type 2 diabetic · Bali, Indonesia',
    quote:
      "I've been managing Type 2 diabetes for 8 years. NomadVital gave me a list of safe Balinese dishes and told me exactly which street foods to avoid. I traveled for 2 weeks and never had a bad glucose spike. This is genuinely life-changing for diabetic travelers.",
    stars: 5,
  },
  {
    name: 'Sophie F.',
    detail: 'Nut allergy · Thailand and Vietnam',
    quote:
      "Having a nut allergy in Southeast Asia is terrifying — peanuts are in everything. NomadVital gave me phrase cards in Thai and Vietnamese, a list of hidden peanut dishes, and safe restaurant chains to look for. I finally felt confident eating out abroad.",
    stars: 5,
  },
  {
    name: 'Aisha M.',
    detail: 'IBS + vegan · Dubai, UAE',
    quote:
      "Traveling as a vegan with IBS is complicated. NomadVital understood both conditions and gave me a Dubai-specific guide covering safe plant-based meals, high-fibre trigger foods to avoid, and even which supermarkets stock gut-friendly options. Excellent service.",
    stars: 5,
  },
]

export default function ReviewsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#085041] mb-4" style={{ letterSpacing: '0.01em', lineHeight: '1.3', fontWeight: '600' }}>
            Trusted by travelers worldwide
          </h2>
          <p className="text-[#5F5E5A] text-lg max-w-2xl mx-auto">
            Real people, real health conditions, real peace of mind on the road.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </div>
      </div>
    </section>
  )
}
