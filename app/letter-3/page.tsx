'use client'

import React, { useState } from 'react'
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
      if (typeof window !== 'undefined' && (window as any).fbq) {
        ;(window as any).fbq('track', 'Lead')
      }
      router.push(`/login?email=${encodeURIComponent(email.trim())}&from=squeeze`)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#0f0e0d' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

        .font-cormorant { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-dm        { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92%  { opacity: 1; }
          93%  { opacity: 0.85; }
          94%  { opacity: 1; }
        }

        .fade-1 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.05s; opacity: 0; }
        .fade-2 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.18s; opacity: 0; }
        .fade-3 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.32s; opacity: 0; }
        .fade-4 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.46s; opacity: 0; }
        .fade-5 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.60s; opacity: 0; }
        .fade-6 { animation: fadeIn 1s ease forwards;   animation-delay: 0.72s; opacity: 0; }

        .input-field {
          width: 100%;
          padding: 15px 20px;
          border: 1.5px solid #2e2a26;
          background: #181614;
          color: #f0ece6;
          border-radius: 10px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .input-field::placeholder { color: #3d3730; }
        .input-field:focus { border-color: #B5A692; }
        .input-field:disabled { opacity: 0.4; }

        .cta-btn {
          width: 100%;
          padding: 17px;
          background: #B5A692;
          color: #0f0e0d;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.03em;
        }
        .cta-btn:hover:not(:disabled) { background: #c9b9a5; transform: translateY(-1px); }
        .cta-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .spin {
          display: inline-block;
          width: 15px; height: 15px;
          border: 2px solid rgba(15,14,13,0.3);
          border-top-color: #0f0e0d;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .stat-divider { width: 1px; height: 28px; background: #2a2520; }

        .vignette {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%);
        }

        .grain {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
        }

        .voc-row {
          padding: 20px 0;
          border-bottom: 1px solid #1e1c1a;
        }
        .voc-row:last-child { border-bottom: none; }
      `}</style>

      <div className="vignette" />
      <div className="grain" />

      <div style={{ width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #B5A692 30%, #B5A692 70%, transparent)', position: 'relative', zIndex: 1 }} />

      <nav style={{ position: 'relative', zIndex: 1, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <p className="font-cormorant" style={{ color: '#f0ece6', fontSize: '18px', fontWeight: 500, letterSpacing: '0.05em', animation: 'flicker 8s infinite' }}>
          Succession <span style={{ color: '#B5A692' }}>Story</span>
        </p>
        <p className="font-dm" style={{ color: '#3d3730', fontSize: '12px', letterSpacing: '0.08em' }}>Trusted by 2,800+ families</p>
      </nav>

      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '72px', alignItems: 'start' }}>

          {/* LEFT */}
          <div>
            <div className="fade-1 font-dm" style={{ marginBottom: '20px' }}>
              <span style={{ color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Free to start</span>
            </div>

            {/* Headline — you still have the chance. use it. */}
            <h1 className="fade-2 font-cormorant" style={{ color: '#f0ece6', fontSize: 'clamp(34px, 5vw, 52px)', lineHeight: 1.15, marginBottom: '20px', fontWeight: 500 }}>
              You still have<br />
              the chance to say it.<br />
              <em style={{ color: '#B5A692' }}>Most people wait too long.</em>
            </h1>

            {/* Sub — names what disappears if they don't act, then opens the door */}
            <p className="fade-3 font-dm" style={{ color: '#6a6058', fontSize: '16px', lineHeight: 1.75, marginBottom: '10px', maxWidth: '420px' }}>
              The things that matter most, what you believe, what shaped you,
              what you want them to carry forward, aren&apos;t in any document.
              They live in you. And they leave when you do.
            </p>
            <p className="fade-3 font-dm" style={{ color: '#c9b9a5', fontSize: '16px', lineHeight: 1.75, marginBottom: '32px', maxWidth: '420px' }}>
              30 minutes. Guided questions. We write it for you.
              Free to start — because this shouldn&apos;t be something
              you put off one more day.
            </p>

            {/* Form */}
            <div className="fade-4" style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px' }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                disabled={loading}
                className="input-field"
              />
              {error && <p className="font-dm" style={{ color: '#c0392b', fontSize: '13px' }}>{error}</p>}
              <button onClick={handleSubmit} disabled={loading} className="cta-btn">
                {loading ? (<><span className="spin" />Creating your account...</>) : 'Write my letter →'}
              </button>
              <p className="font-dm" style={{ color: '#3d3730', fontSize: '12px', textAlign: 'center', marginTop: '2px' }}>
                Free to start. No credit card required.
              </p>
            </div>

            {/* How it works */}
            <div className="fade-5">
              <p className="font-dm" style={{ color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '14px' }}>
                How it works
              </p>
              {[
                ['Answer guided questions', 'In your own words. At your own pace. No writing skill needed.'],
                ['We write your letter', 'We turn your answers into a finished letter — in your voice.'],
                ['Pay only when it\'s ready', 'Read it first. Love it first. Then decide.'],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                  <span style={{ color: '#B5A692', fontSize: '10px', marginTop: '5px', flexShrink: 0 }}>✦</span>
                  <div>
                    <p className="font-dm" style={{ color: '#c9b9a5', fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>{title}</p>
                    <p className="font-dm" style={{ color: '#5a5450', fontSize: '13px', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — VOC: people who ran out of time, people who didn't */}
          <div className="fade-6">
            <p className="font-dm" style={{ color: '#3d3730', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>
              From families who found letters — and those who didn&apos;t
            </p>

            {/* VOC 1 — the cancer mom who would have written 1000 letters */}
            <div className="voc-row">
              <p className="font-cormorant" style={{ color: '#d4c8bb', fontSize: '19px', fontStyle: 'italic', lineHeight: 1.65, marginBottom: '10px' }}>
                &ldquo;I lost my mom to cancer. She wasn&apos;t able to write
                or talk at the end. If she had known, she would have
                written me 1,000 letters — I am 100% sure of that.&rdquo;
              </p>
              <p className="font-dm" style={{ color: '#4a4540', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                — From our community
              </p>
            </div>

            {/* VOC 2 — the daughter who still has her dad's text messages */}
            <div className="voc-row">
              <p className="font-cormorant" style={{ color: '#d4c8bb', fontSize: '19px', fontStyle: 'italic', lineHeight: 1.65, marginBottom: '10px' }}>
                &ldquo;I currently still have his text messages on my phone.
                I cannot believe that I will never get
                a text message from him again.&rdquo;
              </p>
              <p className="font-dm" style={{ color: '#4a4540', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                — From our community
              </p>
            </div>

            {/* VOC 3 — the found letter, the pivot to hope */}
            <div className="voc-row">
              <p className="font-cormorant" style={{ color: '#d4c8bb', fontSize: '19px', fontStyle: 'italic', lineHeight: 1.65, marginBottom: '10px' }}>
                &ldquo;I found a letter I&apos;d forgotten my dad had written.
                It&apos;s full of things he almost never said.
                It&apos;s one of the most precious things I own now.&rdquo;
              </p>
              <p className="font-dm" style={{ color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                — From our community
              </p>
            </div>

            {/* Closing — urgency with agency, not fear */}
            <div style={{ marginTop: '24px', padding: '20px 24px', background: '#141210', border: '1px solid #2e2a26', borderRadius: '14px' }}>
              <p className="font-cormorant" style={{ color: '#f0ece6', fontSize: '19px', lineHeight: 1.65, fontStyle: 'italic' }}>
                You have the chance to write it today.{' '}
                <span style={{ color: '#B5A692' }}>Don&apos;t be the person who meant to.</span>
              </p>
            </div>
          </div>

        </div>
      </section>

      <div style={{ borderTop: '1px solid #1e1c1a', padding: '20px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
          {[['2,800+', 'families served'], ['30 min', 'to complete'], ['100%', 'private & secure']].map(([num, label], i) => (
            <React.Fragment key={label}>
              <div style={{ textAlign: 'center' }}>
                <p className="font-cormorant" style={{ color: '#f0ece6', fontWeight: 600, fontSize: '20px', lineHeight: 1 }}>{num}</p>
                <p className="font-dm" style={{ color: '#3d3730', fontSize: '11px', marginTop: '4px', letterSpacing: '0.06em' }}>{label}</p>
              </div>
              {i < 2 && <div className="stat-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </main>
  )
}