'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SqueezePageVariant2() {
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
        body: JSON.stringify({ email: email.trim(), source: 'variant-2-unfinished' }),
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
    <main className="min-h-screen bg-[#1a1a1a] flex flex-col">
      <div className="w-full h-1 bg-[#B5A692]" />

      <nav className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <p className="text-white text-sm font-medium tracking-wide">
          Succession <span className="text-[#B5A692]">Story</span>
        </p>
        <p className="text-[#4a4a4a] text-xs hidden sm:block">Trusted by 2,800+ families</p>
      </nav>

      <section className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div>
            <p className="text-[#B5A692] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Free Access
            </p>

            <h1 className="text-white text-4xl sm:text-5xl leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Your will is signed.
              <br />
              <em className="text-[#B5A692]">Something still feels incomplete.</em>
            </h1>

            <p className="text-[#8a7f78] text-xl sm:text-2xl mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              Start your legacy letter free — pay only when it&apos;s written.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                'Legal documents transfer assets. They don\'t transfer meaning.',
                'Answer 9 questions in your own words — takes 30 minutes.',
                'We write the finished letter. You pay only at the end.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[#706860] text-base">
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
                className="w-full px-5 py-4 border border-[#2a2a2a] bg-[#111] text-white rounded-lg text-base placeholder-[#4a4a4a] focus:outline-none focus:border-[#B5A692] transition-colors disabled:opacity-50"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-[#B5A692] hover:bg-[#a59682] disabled:opacity-50 disabled:cursor-not-allowed text-[#1a1a1a] font-semibold text-base rounded-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#1a1a1a]/30 border-t-[#1a1a1a] rounded-full animate-spin" />
                    Creating your account...
                  </span>
                ) : 'Start for Free →'}
              </button>
              <p className="text-[#4a4a4a] text-xs text-center">
                Free to start. No credit card required.
              </p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="w-full max-w-sm bg-[#111] border border-[#2a2a2a] rounded-2xl p-8">
              <div className="w-full h-px bg-[#2a2a2a] mb-8" />
              <p className="text-[#B5A692] text-xs font-bold tracking-[0.2em] uppercase mb-6">
                What legal documents can&apos;t say
              </p>
              <div className="space-y-6">
                {[
                  ['Your will says...', 'Who gets the house.', 'Your letter says...', 'Why you bought it in the first place.'],
                  ['Your will says...', 'Who gets the money.', 'Your letter says...', 'What you hope they do with it.'],
                  ['Your will says...', 'Who gets custody.', 'Your letter says...', 'What kind of person you hope they become.'],
                ].map(([label1, val1, label2, val2], i) => (
                  <div key={i} className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1a1a1a] rounded-lg p-3">
                      <p className="text-[#4a4a4a] text-xs mb-1">{label1}</p>
                      <p className="text-[#706860] text-sm">{val1}</p>
                    </div>
                    <div className="bg-[#1a1a1a] border border-[#B5A692]/20 rounded-lg p-3">
                      <p className="text-[#B5A692] text-xs mb-1">{label2}</p>
                      <p className="text-white text-sm">{val2}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      <div className="border-t border-[#2a2a2a] py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {[['2,800+', 'families served'], ['30 min', 'to complete'], ['100%', 'private & secure']].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="text-white font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>{num}</p>
              <p className="text-[#4a4a4a] text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}