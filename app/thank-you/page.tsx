'use client';

import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: "url('/bg-succession.png')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60" />

      {/* Logo - Fixed top left */}
      <div className="fixed top-8 left-8 z-20">
        <p className="text-white text-sm tracking-wide font-medium">Succession Story</p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Success Checkmark Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-[#B5A692] flex items-center justify-center">
            <svg className="w-10 h-10 text-[#B5A692]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Main Title - "Succession" in white, "Story" in tan */}
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">
          <span className="text-white">Thank </span>
          <span className="text-[#B5A692]">You</span>
        </h1>

        {/* Confirmation Message */}
        <p className="text-white/80 text-lg md:text-xl mb-4 max-w-md mx-auto leading-relaxed">
          Your story has been submitted successfully.
        </p>

        <p className="text-white/60 text-base mb-10 max-w-md mx-auto leading-relaxed">
          We will carefully craft your legacy letter and reach out to you soon.
        </p>

        {/* Return Home Button - Outlined rounded pill */}
        <Link
          href="/"
          className="inline-block px-12 py-3.5 bg-transparent border border-white text-white rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300"
        >
          Return Home
        </Link>
      </div>

      {/* Footer links */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-8 text-white text-sm z-20">
        <a href="#" className="hover:text-[#B5A692] transition-colors">Succession Story</a>
        <a href="#" className="hover:text-[#B5A692] transition-colors">Terms</a>
        <a href="#" className="hover:text-[#B5A692] transition-colors">Policy</a>
        <a href="#" className="hover:text-[#B5A692] transition-colors">Privacy</a>
      </div>

      {/* Settings icon - Fixed bottom right */}
      <div className="fixed bottom-8 right-8 z-20">
        <button className="text-white hover:text-[#B5A692] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
