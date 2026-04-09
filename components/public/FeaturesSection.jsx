export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-7 h-7 text-[#1D9E75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      label: 'AI HEALTH ADVISOR',
      title: 'Ask anything about staying healthy abroad.',
      desc: 'Get personalised, research-backed answers about managing your health condition while traveling — from safe street foods in Bangkok to medication storage in humid climates.',
    },
    {
      icon: (
        <svg className="w-7 h-7 text-[#1D9E75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
      label: 'DESTINATION GUIDES',
      title: 'Country-by-country guides covering safe foods, allergens, water safety.',
      desc: 'Every destination guide is structured around common traveler health conditions — diabetes, celiac, nut allergies, IBS, vegan diets — with real food examples and local tips.',
    },
    {
      icon: (
        <svg className="w-7 h-7 text-[#1D9E75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      label: 'DIET TRAVEL PLANNER',
      title: 'Enter your destination and health condition — get a personalised meal plan.',
      desc: 'Tell us where you\'re going and what you\'re managing — we\'ll generate a day-by-day meal guide with safe local dishes, foods to avoid, and restaurant ordering tips.',
    },
  ]

  return (
    <section id="features" className="bg-[#F1EFE8] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#085041] mb-4" style={{ letterSpacing: '0.01em', lineHeight: '1.3', fontWeight: '600' }}>
            Everything you need to travel healthy
          </h2>
          <p className="font-inter text-[#5F5E5A] text-lg max-w-2xl mx-auto">
            Built specifically for travelers managing dietary conditions, food allergies, and
            chronic health issues.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-[#D3D1C7]">
              <div className="w-12 h-12 bg-[#E1F5EE] rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <div className="font-inter text-[11px] font-medium text-[#1D9E75] tracking-[2.5px] uppercase mb-2">{f.label}</div>
              <h3 className="font-inter text-lg font-semibold text-[#085041] mb-3 leading-snug">{f.title}</h3>
              <p className="font-inter text-[#5F5E5A] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
