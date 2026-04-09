export default function ChatDemo() {
  return (
    <section className="bg-[#1D9E75] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="font-inter inline-block bg-[#0F6E56] text-[#5DCAA5] text-[11px] font-medium px-3 py-1 rounded-full mb-4 tracking-[2.5px] uppercase">
            AI ADVISOR — LIVE DEMO
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl text-white mb-3" style={{ letterSpacing: '0.01em', lineHeight: '1.3', fontWeight: '600' }}>
            Ask anything. Get research-backed answers.
          </h2>
          <p className="text-[#E1F5EE] text-lg">
            Here&rsquo;s a real example of what NomadVital&rsquo;s AI advisor looks like in action.
          </p>
        </div>

        {/* Chat window */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Chat header */}
          <div className="bg-[#085041] px-5 py-3 flex items-center gap-3">
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#1D9E75', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="9" r="7.5" stroke="#E1F5EE" strokeWidth="1"/>
                  <path d="M9 2.5L10.8 6L14.5 4.8L12.5 8.5L14.5 12.2L10.8 11L9 14.5L7.2 11L3.5 12.2L5.5 8.5L3.5 4.8L7.2 6Z" fill="#E1F5EE" opacity="0.85"/>
                  <circle cx="9" cy="9" r="2" fill="#1D9E75"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '16px', letterSpacing: '-0.3px', color: '#E1F5EE', fontWeight: 700 }}>
                Nomad<span style={{ fontWeight: 400, fontStyle: 'italic', color: '#5DCAA5' }}>Vital</span>
              </span>
            </div>
            <div className="ml-1 pl-3 border-l border-[#0F6E56]">
              <div className="text-white text-sm font-semibold font-inter">AI Advisor</div>
              <div className="text-[#9FE1CB] text-xs font-inter">Online · Powered by Claude</div>
            </div>
          </div>

          {/* Messages */}
          <div className="p-5 flex flex-col gap-4 min-h-[260px]">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-[#E1F5EE] text-[#085041] text-sm rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] leading-relaxed">
                I&rsquo;m a Type 2 diabetic traveling to Thailand for 3 weeks. What should I be
                careful about eating?
              </div>
            </div>

            {/* AI message */}
            <div className="flex justify-start">
              <div className="flex flex-col gap-2 max-w-[85%]">
                <div className="bg-[#F1EFE8] text-[#085041] text-sm rounded-2xl rounded-tl-sm px-4 py-3 leading-relaxed">
                  <p className="font-semibold mb-2">Great question — Thailand is very manageable for diabetics with the right awareness.</p>
                  <p className="mb-2">
                    <strong>Watch out for:</strong> Sticky rice, pad thai with sugar-laden sauces,
                    sweet Thai iced tea (cha yen), mango sticky rice, and many street desserts.
                    Thai cuisine often adds palm sugar to savory dishes — always ask for &ldquo;mai wan&rdquo; (not sweet).
                  </p>
                  <p className="mb-2">
                    <strong>Safe choices:</strong> Grilled meats (moo ping), stir-fried vegetables,
                    clear soups like tom yum (without noodles), som tam (green papaya salad, no sugar),
                    and jasmine rice in small portions.
                  </p>
                  <p>
                    <strong>Practical tips:</strong> Carry glucose tablets, keep snacks in your bag,
                    and consider a glucose monitor that works without refrigeration in the heat.
                  </p>
                </div>

                {/* Disclaimer box */}
                <div className="bg-[#085041] text-[#9FE1CB] text-xs rounded-xl px-4 py-2.5 leading-relaxed">
                  Please note: this is general wellness information for educational purposes only —
                  not medical advice. Always consult your doctor before making changes to your diet
                  or medication while traveling.
                </div>
              </div>
            </div>
          </div>

          {/* Input bar */}
          <div className="border-t border-[#D3D1C7] px-4 py-3 flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask about your health condition and destination..."
              className="flex-1 text-sm text-[#5F5E5A] bg-transparent outline-none placeholder-[#888780]"
              disabled
            />
            <button
              disabled
              className="bg-[#1D9E75] text-white text-sm font-semibold px-4 py-2 rounded-lg opacity-60 cursor-not-allowed"
            >
              Ask
            </button>
          </div>
        </div>

        <p className="text-center text-[#E1F5EE] text-sm mt-4">
          Sign up free to ask your own questions — 3 free per day, unlimited with Pro.
        </p>
      </div>
    </section>
  )
}
