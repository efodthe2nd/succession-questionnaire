'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ThankYouPurchasePage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', { value: 97.00, currency: 'USD' })
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/bg-succession.png')" }} />
      <div className="absolute inset-0 bg-black opacity-60" />

      <div className="fixed top-8 left-8 z-20">
        <p className="text-white text-sm tracking-wide font-medium">Succession Story</p>
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-[#B5A692] flex items-center justify-center">
            <svg className="w-10 h-10 text-[#B5A692]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
          <span className="text-white">Your purchase is </span>
          <span className="text-[#B5A692]">confirmed.</span>
        </h1>

        <p className="text-white/80 text-lg md:text-xl mb-4 max-w-md mx-auto leading-relaxed">
          Check your email — your login details are on their way.
        </p>

        <p className="text-white/50 text-sm mb-10 max-w-md mx-auto leading-relaxed">
          Once you log in, you'll answer a short guided questionnaire. We'll write your Succession Story from your answers and deliver it within 24 hours.
        </p>

        <Link
          href="/login"
          className="inline-block px-12 py-3.5 bg-[#B5A692] text-black rounded-full font-medium hover:bg-[#a09280] transition-all duration-300 mb-4"
        >
          Log In Now
        </Link>

        <div className="block mt-3">
          <Link href="/" className="text-white/40 text-sm hover:text-white transition-colors">
            Return Home
          </Link>
        </div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-8 text-white text-sm z-20">
        <a href="/terms" className="hover:text-[#B5A692] transition-colors">Terms</a>
        <a href="/privacy" className="hover:text-[#B5A692] transition-colors">Privacy</a>
      </div>
    </div>
  );
}