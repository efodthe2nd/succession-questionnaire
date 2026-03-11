'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SqueezePageVariant3() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'variant-3-fear' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }
      router.push(`/login?email=${encodeURIComponent(email.trim())}&from=squeeze`)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f9f6f1] flex flex-col">
      <div className="w-full h-1 bg-[#B5A692]" />

      <nav className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <p className="text-[#1a1a1a] text-sm font-medium tracking-wide">
          Succession <span className="text-[#B5A692]">Story</span>
        </p>
        <p className="text-[#8a7f78] text-xs hidden sm:block">Trusted by 2,800+ families</p>
      </nav>

      <section className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div>
            <p className="text-[#B5A692] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Free Access
            </p>

            <blockquote
              className="text-[#1a1a1a] text-3xl sm:text-4xl leading-tight mb-3 border-l-4 border-[#B5A692] pl-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              &ldquo;I know she loved me.
              <br />
              But I don&apos;t know if
              <br />
              she <em>liked</em> me.&rdquo;
            </blockquote>

            <p className="text-[#8a7f78] text-sm mb-8 pl-6">
              — Written by a daughter, six months after her mother&apos;s funeral
            </p>

            <p className="text-[#1a1a1a] text-xl sm:text-2xl mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              Don&apos;t let your children say that about you.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                'Start free — no credit card, no commitment.',
                'Answer 9 questions. We write the letter in your voice.',
                'Pay only when your letter is ready to send.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[#4a4a4a] text-base">
                  <span className="text-[#B5A692] mt-0.5 shrink-0">✦</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="space-y-3 max-w-md">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                disabled={loading}
                className="w-full px-5 py-4 border border-[#d4c8bb] bg-white text-[#1a1a1a] rounded-lg text-base placeholder-[#b0a89e] focus:outline-none focus:border-[#B5A692] transition-colors disabled:opacity-50"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed text-[#B5A692] font-semibold text-base rounded-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#B5A692]/30 border-t-[#B5A692] rounded-full animate-spin" />
                    Creating your account...
                  </span>
                ) : 'Start for Free →'}
              </button>
              <p className="text-[#b0a89e] text-xs text-center">
                Free to start. No credit card required.
              </p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="w-full max-w-sm bg-[#1a1a1a] rounded-2xl p-8 shadow-2xl">
              <div className="w-full h-1 bg-[#B5A692] rounded-full mb-8" />
              <p className="text-[#B5A692] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                What families say they wish they had
              </p>
              <div className="space-y-5">
                {[
                  'Something in his own words. Not about money — about us.',
                  'I just wanted to know what she was proud of. I never thought to ask.',
                  'He left everything in order. But he never told us what any of it meant to him.',
                ].map((quote, i) => (
                  <div key={i} className="border-l-2 border-[#B5A692]/40 pl-4">
                    <p className="text-[#a09890] text-sm leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-[#2a2a2a]">
                <p className="text-[#4a4a4a] text-xs">
                  These are real words from real families.
                  The letter they wished existed — you can still write it.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <div className="border-t border-[#e8e4de] py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {[['2,800+', 'families served'], ['30 min', 'to complete'], ['100%', 'private & secure']].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="text-[#1a1a1a] font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>{num}</p>
              <p className="text-[#8a7f78] text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}