'use client'

import React, { useState } from 'react'
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
      // Dynamic import here too — no static import at top of file
      const { default: ReactPixel } = await import('react-facebook-pixel')
      ReactPixel.track('Lead')
      router.push(`/login?email=${encodeURIComponent(email.trim())}&from=squeeze`)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f9f6f1] flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

        .font-cormorant { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.7; }
        }

        .animate-fade-up-1  { animation: fadeUp 0.7s ease forwards; animation-delay: 0.05s; opacity: 0; }
        .animate-fade-up-2  { animation: fadeUp 0.7s ease forwards; animation-delay: 0.2s;  opacity: 0; }
        .animate-fade-up-3  { animation: fadeUp 0.7s ease forwards; animation-delay: 0.35s; opacity: 0; }
        .animate-fade-up-4  { animation: fadeUp 0.7s ease forwards; animation-delay: 0.5s;  opacity: 0; }
        .animate-fade-up-5  { animation: fadeUp 0.7s ease forwards; animation-delay: 0.65s; opacity: 0; }
        .animate-fade-in-6  { animation: fadeIn 0.9s ease forwards; animation-delay: 0.8s;  opacity: 0; }

        .divider-line {
          width: 40px;
          height: 1px;
          background: #B5A692;
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
        }

        .card-dark {
          background: #1a1a1a;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 24px 60px rgba(0,0,0,0.18);
        }

        .step-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #2a2a2a;
        }
        .step-row:last-child { border-bottom: none; }

        .input-field {
          width: 100%;
          padding: 15px 20px;
          border: 1.5px solid #d4c8bb;
          background: #fff;
          color: #1a1a1a;
          border-radius: 10px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .input-field::placeholder { color: #b0a89e; }
        .input-field:focus { border-color: #B5A692; }
        .input-field:disabled { opacity: 0.5; }

        .cta-btn {
          width: 100%;
          padding: 16px;
          background: #1a1a1a;
          color: #B5A692;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 15px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.02em;
        }
        .cta-btn:hover:not(:disabled) {
          background: #2d2d2d;
          transform: translateY(-1px);
        }
        .cta-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .spin {
          display: inline-block;
          width: 15px; height: 15px;
          border: 2px solid rgba(181,166,146,0.3);
          border-top-color: #B5A692;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .quote-mark {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 72px;
          line-height: 0.6;
          color: #B5A692;
          opacity: 0.4;
          display: block;
          margin-bottom: 8px;
        }

        .stat-divider {
          width: 1px;
          height: 28px;
          background: #d4c8bb;
        }

        /* Subtle paper texture overlay */
        .texture-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Texture overlay */}
      <div className="texture-overlay" />

      {/* Top accent bar */}
      <div style={{ width: '100%', height: '3px', background: 'linear-gradient(90deg, #B5A692 0%, #d4c8bb 50%, #B5A692 100%)', position: 'relative', zIndex: 1 }} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 1, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <p className="font-cormorant" style={{ color: '#1a1a1a', fontSize: '17px', fontWeight: 500, letterSpacing: '0.04em' }}>
          Succession <span style={{ color: '#B5A692' }}>Story</span>
        </p>
        <p className="font-dm" style={{ color: '#8a7f78', fontSize: '12px', letterSpacing: '0.08em' }}>
          Trusted by 2,800+ families
        </p>
      </nav>

      {/* Main content */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center' }}>

          {/* LEFT — Emotional copy */}
          <div>
            {/* Eyebrow */}
            <div className="animate-fade-up-1 font-dm" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <span className="divider-line" />
              <span style={{ color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Free to start</span>
            </div>

            {/* Headline — catches them mid-feeling from the ad */}
            <h1 className="animate-fade-up-2 font-cormorant" style={{ color: '#1a1a1a', fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.15, marginBottom: '16px', fontWeight: 500 }}>
              They'll search for a letter<br />
              from you.<br />
              <em style={{ color: '#B5A692' }}>Make sure they find one.</em>
            </h1>

            {/* Sub — collapses the effort objection immediately */}
            <p className="animate-fade-up-3 font-dm" style={{ color: '#5a5450', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px', maxWidth: '440px' }}>
              You talk. We write. Your family keeps it forever.<br />
              No writing ability needed. No appointments. No pressure.
            </p>

            {/* Benefits — reframed around outcome not process */}
            <ul className="animate-fade-up-4" style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Answer guided questions — in your own words, at your own pace',
                'We write your finished letter in your voice',
                'Pay only when your letter is ready — not a cent before',
              ].map((item) => (
                <li key={item} className="font-dm" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#3a3530', fontSize: '15px', lineHeight: 1.6 }}>
                  <span style={{ color: '#B5A692', marginTop: '3px', flexShrink: 0, fontSize: '14px' }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Email capture */}
            <div className="animate-fade-up-5" style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                disabled={loading}
                className="input-field"
              />
              {error && (
                <p className="font-dm" style={{ color: '#c0392b', fontSize: '13px' }}>{error}</p>
              )}
              {/* First-person CTA — outcome framed */}
              <button onClick={handleSubmit} disabled={loading} className="cta-btn">
                {loading ? (
                  <>
                    <span className="spin" />
                    Creating your account...
                  </>
                ) : 'Write my letter →'}
              </button>
              <p className="font-dm" style={{ color: '#b0a89e', fontSize: '12px', textAlign: 'center', marginTop: '2px' }}>
                Free to start. No credit card required.
              </p>
            </div>
          </div>

          {/* RIGHT — Dark card: process + VOC quote */}
          <div className="animate-fade-in-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Process card */}
            <div className="card-dark">
              <p className="font-dm" style={{ color: '#B5A692', fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '20px' }}>
                What happens after you sign up
              </p>

              <div>
                {[
                  ['01', 'Check your email for your login details'],
                  ['02', 'Answer guided questions — your words, your voice, your pace'],
                  ['03', 'We write your finished letter. You pay only when it\'s ready.'],
                ].map(([num, text]) => (
                  <div key={num} className="step-row">
                    <span className="font-cormorant" style={{ color: '#B5A692', fontSize: '18px', flexShrink: 0, marginTop: '1px', fontWeight: 500 }}>{num}</span>
                    <p className="font-dm" style={{ color: '#a09890', fontSize: '14px', lineHeight: 1.65 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* VOC quote card — the emotional anchor from the ad */}
            <div style={{ background: '#fff', border: '1px solid #e8e4de', borderRadius: '16px', padding: '28px 28px 24px' }}>
              <span className="quote-mark">"</span>
              <p className="font-cormorant" style={{ color: '#2a2520', fontSize: '19px', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '16px' }}>
                I searched everywhere for a letter from my mom after she passed. There wasn't one.
              </p>
              <p className="font-dm" style={{ color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                — From our community
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ borderTop: '1px solid #e8e4de', padding: '20px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
          {[
            ['2,800+', 'families served'],
            ['30 min', 'to complete'],
            ['100%', 'private & secure'],
          ].map(([num, label], i) => (
            <React.Fragment key={label}>
              <div style={{ textAlign: 'center' }}>
                <p className="font-cormorant" style={{ color: '#1a1a1a', fontWeight: 600, fontSize: '20px', lineHeight: 1 }}>{num}</p>
                <p className="font-dm" style={{ color: '#8a7f78', fontSize: '11px', marginTop: '4px', letterSpacing: '0.06em' }}>{label}</p>
              </div>
              {i < 2 && <div className="stat-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </main>
  )
}