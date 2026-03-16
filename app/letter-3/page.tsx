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
        body: JSON.stringify({ email: email.trim(), source: 'variant-1-fear' }),
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

  const disappears = [
    { thing: 'Why you made the hardest choices you made.' },
    { thing: 'What you actually believe — not what you showed.' },
    { thing: 'What you want them to remember when life gets hard.' },
  ]

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
          92%       { opacity: 1; }
          93%       { opacity: 0.85; }
          94%       { opacity: 1; }
        }

        .fade-1 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.05s; opacity: 0; }
        .fade-2 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.2s;  opacity: 0; }
        .fade-3 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.38s; opacity: 0; }
        .fade-4 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.54s; opacity: 0; }
        .fade-5 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.7s;  opacity: 0; }
        .fade-6 { animation: fadeIn 1s ease forwards;   animation-delay: 0.8s;  opacity: 0; }

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

        .disappears-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 0;
          border-bottom: 1px solid #1e1c1a;
          animation: fadeUp 0.7s ease forwards;
          opacity: 0;
        }
        .disappears-item:last-child { border-bottom: none; }
        .disappears-item:nth-child(1) { animation-delay: 0.85s; }
        .disappears-item:nth-child(2) { animation-delay: 1.05s; }
        .disappears-item:nth-child(3) { animation-delay: 1.25s; }

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

        /* ─── MOBILE OVERRIDES ─── */
        /* The "What disappears" block and relief box move below form on mobile */
        .disappears-section-desktop { display: block; }
        .disappears-section-mobile  { display: none; }
        .relief-box-desktop { display: block; }
        .relief-box-mobile  { display: none; }

        @media (max-width: 640px) {
          .disappears-section-desktop { display: none; }
          .disappears-section-mobile  { display: block; }
          .relief-box-desktop { display: none; }
          .relief-box-mobile  { display: block; }
        }
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

            {/* VOC blockquote — stays above fold, it's the best hook */}
            <div className="fade-2" style={{ borderLeft: '3px solid #B5A692', paddingLeft: '24px', marginBottom: '10px' }}>
              <p className="font-cormorant" style={{ color: '#f0ece6', fontSize: 'clamp(28px, 4.5vw, 44px)', lineHeight: 1.2, fontStyle: 'italic', marginBottom: '12px' }}>
                &ldquo;I know she loved me.<br />
                But I don&apos;t know if<br />
                she <em style={{ color: '#B5A692' }}>liked</em> me.&rdquo;
              </p>
              <p className="font-dm" style={{ color: '#3d3730', fontSize: '13px', letterSpacing: '0.03em' }}>
                — Said by a daughter, six months after her mother&apos;s funeral
              </p>
            </div>

            {/* Pivot line */}
            <p className="fade-3 font-cormorant" style={{ color: '#8a7f78', fontSize: 'clamp(19px, 2.8vw, 24px)', fontStyle: 'italic', margin: '28px 0 20px', lineHeight: 1.5 }}>
              Your kids don&apos;t have to wonder.<br />
              <span style={{ color: '#B5A692' }}>Write it down before you can&apos;t.</span>
            </p>

            {/* "What disappears" — DESKTOP: above form */}
            <div className="disappears-section-desktop">
              <p className="fade-3 font-dm" style={{ color: '#5a5450', fontSize: '13px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '4px' }}>
                What disappears without a letter
              </p>
              <div className="fade-4" style={{ marginBottom: '32px' }}>
                {disappears.map(({ thing }) => (
                  <div key={thing} className="disappears-item">
                    <span style={{ color: '#B5A692', flexShrink: 0, fontSize: '10px', marginTop: '5px' }}>✦</span>
                    <p className="font-cormorant" style={{ color: '#a09488', fontSize: '19px', fontStyle: 'italic', lineHeight: 1.5 }}>{thing}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Relief box — DESKTOP: above form */}
            <div className="relief-box-desktop fade-4" style={{ padding: '18px 20px', border: '1px solid #2e2a26', borderRadius: '12px', marginBottom: '28px', background: '#141210' }}>
              <p className="font-dm" style={{ color: '#6a6058', fontSize: '14px', lineHeight: 1.7 }}>
                That&apos;s not in the will. It&apos;s not in the photos.<br />
                <span style={{ color: '#c9b9a5' }}>You talk. We write. Your family keeps it forever.</span>
              </p>
            </div>

            {/* Form — immediately after pivot on mobile */}
            <div className="fade-5" style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

            {/* "What disappears" — MOBILE: below form */}
            <div className="disappears-section-mobile" style={{ marginTop: '32px' }}>
              <p className="font-dm" style={{ color: '#5a5450', fontSize: '13px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '4px' }}>
                What disappears without a letter
              </p>
              <div>
                {disappears.map(({ thing }) => (
                  <div key={thing} className="disappears-item">
                    <span style={{ color: '#B5A692', flexShrink: 0, fontSize: '10px', marginTop: '5px' }}>✦</span>
                    <p className="font-cormorant" style={{ color: '#a09488', fontSize: '18px', fontStyle: 'italic', lineHeight: 1.5 }}>{thing}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Relief box — MOBILE: below form */}
            <div className="relief-box-mobile" style={{ padding: '18px 20px', border: '1px solid #2e2a26', borderRadius: '12px', marginTop: '20px', background: '#141210' }}>
              <p className="font-dm" style={{ color: '#6a6058', fontSize: '14px', lineHeight: 1.7 }}>
                That&apos;s not in the will. It&apos;s not in the photos.<br />
                <span style={{ color: '#c9b9a5' }}>You talk. We write. Your family keeps it forever.</span>
              </p>
            </div>
          </div>

          {/* RIGHT — VOC quotes */}
          <div className="fade-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="font-dm" style={{ color: '#3d3730', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>
              From families who found letters — and those who didn&apos;t
            </p>

            <div style={{ background: '#141210', border: '1px solid #2e2a26', borderRadius: '16px', padding: '24px' }}>
              <p className="font-cormorant" style={{ color: '#d4c8bb', fontSize: '20px', fontStyle: 'italic', lineHeight: 1.65, marginBottom: '14px' }}>
                &ldquo;I recently found a letter I&apos;d forgotten my dad had written. It&apos;s full of things he almost never said — how proud he was, that he loved me. It&apos;s one of the most precious things I own.&rdquo;
              </p>
              <div style={{ height: '1px', background: '#2e2a26', marginBottom: '14px' }} />
              <p className="font-dm" style={{ color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>— From our community</p>
            </div>

            <div style={{ background: '#141210', border: '1px solid #2e2a26', borderRadius: '16px', padding: '24px' }}>
              <p className="font-cormorant" style={{ color: '#706860', fontSize: '20px', fontStyle: 'italic', lineHeight: 1.65, marginBottom: '14px' }}>
                &ldquo;I searched everywhere for a letter from my mom after she passed. There wasn&apos;t one. I know she loved me. But I don&apos;t know if she liked me.&rdquo;
              </p>
              <div style={{ height: '1px', background: '#2e2a26', marginBottom: '14px' }} />
              <p className="font-dm" style={{ color: '#4a4540', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>— From our community</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
              <div style={{ background: '#141210', border: '1px solid #2e2a26', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <p className="font-cormorant" style={{ color: '#B5A692', fontSize: '28px', fontWeight: 600, lineHeight: 1 }}>One letter.</p>
                <p className="font-dm" style={{ color: '#5a5450', fontSize: '12px', marginTop: '6px', lineHeight: 1.5 }}>keeps you present long after you&apos;re gone</p>
              </div>
              <div style={{ background: '#141210', border: '1px solid #2e2a26', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <p className="font-cormorant" style={{ color: '#3d3730', fontSize: '28px', fontWeight: 600, lineHeight: 1 }}>No letter.</p>
                <p className="font-dm" style={{ color: '#3d3730', fontSize: '12px', marginTop: '6px', lineHeight: 1.5 }}>and they&apos;re left guessing who you really were</p>
              </div>
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