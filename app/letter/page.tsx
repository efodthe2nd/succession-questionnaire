'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SqueezePageVariant1() {
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
        body: JSON.stringify({ email: email.trim(), source: 'variant-1-regret' }),
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

            <h1 className="text-[#1a1a1a] text-4xl sm:text-5xl leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Your will tells your family <em>what</em> you&apos;re leaving behind.
            </h1>

            <p className="text-[#B5A692] text-xl sm:text-2xl mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              A legacy letter tells them <em>why</em> — forever.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                'Answer 9 guided questions — takes 30 minutes',
                'We write your letter in your voice',
                'Pay only when your letter is ready',
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
                What happens after you sign up
              </p>
              <div className="space-y-4">
                {[
                  'Check your email for your login details',
                  'Answer 10 guided questions — your words, your voice',
                  'We write your finished letter — pay only at the end',
                ].map((q, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#B5A692] text-sm shrink-0 mt-0.5">0{i + 1}</span>
                    <p className="text-[#a09890] text-sm leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-[#2a2a2a]">
                <p className="text-[#706860] text-xs italic">
                  &ldquo;I searched everywhere for a letter from my mom after she passed. There wasn&apos;t one.&rdquo;
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