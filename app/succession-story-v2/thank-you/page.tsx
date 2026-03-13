'use client';

import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/bg-succession.png')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60" />

      {/* Logo */}
      <div className="fixed top-8 left-8 z-20">
        <p className="text-white text-sm tracking-wide font-medium">Succession Story</p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg text-center">

        {/* Checkmark */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-[#B5A692] flex items-center justify-center">
            <svg className="w-10 h-10 text-[#B5A692]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Headline — meets them in relief, not transaction */}
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">
          <span className="text-white">You said what </span>
          <span className="text-[#B5A692]">needed to be said.</span>
        </h1>

        {/* Sub — validates the emotional weight of what they just did */}
        <p className="text-white/70 text-base md:text-lg mb-3 max-w-md mx-auto leading-relaxed">
          Most people never get here. You did.
        </p>

        {/* Delivery expectation — specific, reassuring */}
        <p className="text-white/50 text-sm md:text-base mb-10 max-w-sm mx-auto leading-relaxed">
          We&apos;re writing your letter now. It will arrive in your inbox within 24 hours — written in your voice, ready to keep forever.
        </p>

        {/* What to do next — one action only */}
        <div className="mb-10 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 max-w-sm mx-auto text-left">
          <p className="text-[#B5A692] text-xs font-semibold tracking-widest uppercase mb-3">What happens next</p>
          <div className="space-y-3">
            {[
              ['Check your email', 'Your letter arrives within 24 hours.'],
              ['Review it', 'Make sure it sounds like you.'],
              ['Store it somewhere safe', 'With your will, or somewhere they\'ll find it.'],
            ].map(([title, detail]) => (
              <div key={title} className="flex items-start gap-3">
                <span className="text-[#B5A692] text-xs mt-1 shrink-0">✦</span>
                <p className="text-white/60 text-sm leading-relaxed">
                  <span className="text-white/90 font-medium">{title} —</span> {detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-block px-12 py-3.5 bg-transparent border border-white/30 text-white/70 rounded-full text-sm font-medium hover:border-white hover:text-white transition-all duration-300"
        >
          Return Home
        </Link>
      </div>

      {/* Footer */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-8 text-white/40 text-sm z-20">
        <a href="/terms" className="hover:text-[#B5A692] transition-colors">Terms</a>
        <a href="/privacy" className="hover:text-[#B5A692] transition-colors">Privacy</a>
      </div>
    </div>
  );
}