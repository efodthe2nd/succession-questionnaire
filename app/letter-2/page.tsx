'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SqueezePageVariant2() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
      if (typeof window !== 'undefined' && (window as any).fbq) {
        ;(window as any).fbq('track', 'Lead')
      }
      router.push(`/login?email=${encodeURIComponent(email.trim())}&from=squeeze`)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const testimonials = [
    {
      quote: 'I recently found a letter I\'d forgotten my dad had written. It\'s full of things he almost never said — how proud he was, that he loved me. It\'s one of the most precious things I own.',
      attribution: 'From our community',
      positive: true,
    },
    {
      quote: 'I kept putting it off for three years. Finished it in one sitting. I don\'t know why I waited so long.',
      attribution: 'From our community',
      positive: true,
    },
    {
      quote: 'I searched high and low for a letter from my mom when she passed. I came up empty. If she had known, she would have written me 1,000 letters — I am 100% sure of that.',
      attribution: 'From our community',
      positive: false,
    },
    {
      quote: 'His passing was so sudden. I never got to truly tell him how much I cared. I wish I could have looked him in the eye one more time.',
      attribution: 'From our community',
      positive: false,
    },
  ]

  const faqs = [
    { q: 'What exactly is a legacy letter?', a: 'A legacy letter is a personal message from you to the people you love written in your voice. Not a legal document. Not a will. Just the things that matter most: what shaped you, what you believe, what you want them to carry forward when life gets hard.' },
    { q: 'How is this different from a will?', a: 'A will distributes your assets. A legacy letter passes on your meaning. Your kids will know who gets the house — but without a letter, they may never know why you bought it, what you sacrificed for them, or what you actually believe. A will is for lawyers. A letter is for your family.' },
    { q: 'Do I have to be a good writer?', a: 'No. You never write a single word. We ask you guided questions. You answer in your own words — as if you\'re talking to someone you trust. We take your answers and write the finished letter for you, in your voice.' },
    { q: 'How long does it take?', a: 'Most people finish the questionnaire in 30 minutes or less. You can do it in one sitting, or save your progress and come back. There\'s no deadline.' },
    { q: 'What happens after I sign up?', a: 'You\'ll receive a login link by email immediately. From there, you\'ll answer guided questions about your life, your values, and what you want your family to know. Once you\'re done, we write your letter and send it to you — usually within minutes.' },
    { q: 'Is this AI-generated?', a: 'Your letter is built entirely from your own words and answers. The result reads like you — because it is you. We use your responses to craft something personal and specific, not a generic template.' },
    { q: 'Is my information private?', a: 'Yes. Your answers and your letter are completely private. We never share your information with anyone. Your letter belongs to you.' },
    { q: 'What if I don\'t love the letter?', a: 'You don\'t pay until you\'ve read it and decided it\'s right. If it doesn\'t feel like you, we\'ll revise it. Still not happy? Full refund, no questions asked.' },
    { q: 'How much does it cost?', a: 'Starting is completely free. You only pay $97 when your letter is ready and you\'ve decided you love it. One-time payment — no subscriptions, no hidden fees.' },
    { q: 'Who is this for?', a: 'Anyone who has thought about leaving something meaningful behind but hasn\'t acted. Our customers are mostly parents and grandparents aged 45–70 who want their kids and grandchildren to truly know who they were — not just what they owned.' },
    { q: 'Can I write letters for more than one person?', a: 'Yes. Many people write individual letters to each child or grandchild. Once you\'ve completed your first letter, you can start another at any time.' },
    { q: 'What if I start and don\'t finish?', a: 'Your progress is saved automatically. You can pick up where you left off at any time. We\'ll also send you a gentle reminder if you\'ve been away for a while.' },
  ]

  const FormBlock = ({ id }: { id: string }) => (
    <div id={id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError('') }}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        disabled={loading}
        style={{
          width: '100%', padding: '16px 20px',
          border: '1.5px solid #d4c8bb', background: '#fff', color: '#1a1a1a',
          borderRadius: '10px', fontSize: '16px',
          fontFamily: 'DM Sans, sans-serif',
          outline: 'none', boxSizing: 'border-box' as const,
          transition: 'border-color 0.2s',
        }}
      />
      {error && <p style={{ color: '#c0392b', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%', padding: '17px',
          background: '#1a1a1a', color: '#B5A692',
          fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
          fontSize: '16px', border: 'none', borderRadius: '10px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.5 : 1,
          letterSpacing: '0.02em',
        }}
      >
        {loading ? 'Creating your account...' : "Start my family's letter →"}
      </button>
      <p style={{ color: '#b0a89e', fontSize: '12px', textAlign: 'center', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
        We'll send your login link to this email. We never share it with anyone.
      </p>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f9f6f1', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-1 { animation: fadeUp 0.6s ease forwards; animation-delay: 0.05s; opacity: 0; }
        .fade-2 { animation: fadeUp 0.6s ease forwards; animation-delay: 0.15s; opacity: 0; }
        .fade-3 { animation: fadeUp 0.6s ease forwards; animation-delay: 0.25s; opacity: 0; }
        .fade-4 { animation: fadeUp 0.6s ease forwards; animation-delay: 0.35s; opacity: 0; }
        .fade-5 { animation: fadeUp 0.6s ease forwards; animation-delay: 0.45s; opacity: 0; }

        .texture-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
        }

        .faq-trigger {
          width: 100%; background: none; border: none;
          padding: 18px 0;
          display: flex; justify-content: space-between; align-items: center;
          cursor: pointer; text-align: left; gap: 16px;
        }
        .faq-answer {
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.3s ease, padding-bottom 0.3s ease;
        }
        .faq-item { border-bottom: 1px solid #e8e4de; }
        .faq-item:last-child { border-bottom: none; }

        .testimonial-card {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 14px;
          padding: 22px 24px;
        }

        .stat-divider { width: 1px; height: 24px; background: #d4c8bb; }

        /* Ensure input focus style */
        input[type="email"]:focus {
          border-color: #B5A692 !important;
          outline: none;
        }
      `}</style>

      <div className="texture-overlay" />

      {/* Top accent */}
      <div style={{ width: '100%', height: '3px', background: 'linear-gradient(90deg, #B5A692 0%, #d4c8bb 50%, #B5A692 100%)', position: 'relative', zIndex: 1 }} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#1a1a1a', fontSize: '17px', fontWeight: 500, letterSpacing: '0.04em' }}>
          Succession <span style={{ color: '#B5A692' }}>Story</span>
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#8a7f78', fontSize: '11px', letterSpacing: '0.06em' }}>
          Trusted by 2,800+ families
        </p>
      </nav>

      {/* ── SINGLE COLUMN CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto', width: '100%', padding: '0 20px 64px' }}>

        {/* ── 1. HEADLINE — centered, Feeling + Result ── */}
        <div className="fade-1" style={{ textAlign: 'center', padding: '28px 0 24px' }}>
          {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', gap: '10px' }}>
            <div style={{ width: '32px', height: '1px', background: '#B5A692' }} />
            <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Free to start</span>
            <div style={{ width: '32px', height: '1px', background: '#B5A692' }} />
          </div> */}

          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#1a1a1a', fontSize: 'clamp(32px, 8vw, 48px)', lineHeight: 1.15, fontWeight: 500, marginBottom: '18px' }}>
            Give your kids the one thing<br />
            they&apos;ll search for<br />
            <em style={{ color: '#B5A692' }}>after you&apos;re gone.</em>
          </h1>

          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#5a5450', fontSize: '16px', lineHeight: 1.75, marginBottom: '8px', maxWidth: '480px', margin: '0 auto 8px' }}>
            A personal letter that is written in your voice, from your answers, that tells your family who you really were, what you believed, and why you made the choices you made.
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#8a7f78', fontSize: '14px', lineHeight: 1.6, margin: '8px auto 0', maxWidth: '380px' }}>
            30 minutes. No writing skill needed. Free to start.
          </p>
        </div>

        {/* ── 2. VSL ── */}
        <div className="fade-2" style={{ marginBottom: '28px' }}>
          <div style={{
            background: '#1a1a1a', borderRadius: '16px', overflow: 'hidden',
            aspectRatio: '16/9', display: 'flex', alignItems: 'center',
            justifyContent: 'center', position: 'relative',
          }}>
            {/*
              REPLACE with Romy's video once recorded:
              <video
                src="/romy-vsl.mp4"
                controls
                poster="/romy-poster.jpg"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                playsInline
              />
            */}
            <div style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: '#B5A692', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#1a1a1a">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#f0ece6', fontSize: '18px', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '6px' }}>
                A message from Romy Frazier, Esq.
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#B5A692', fontSize: '12px', letterSpacing: '0.08em' }}>
                Succession Attorney & Founder
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#4a4540', fontSize: '11px', marginTop: '8px' }}>
                Video coming soon
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. FOUNDER BIO ── */}
        <div className="fade-2" style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '16px 20px', background: '#fff',
          border: '1px solid #e8e4de', borderRadius: '12px',
          marginBottom: '28px',
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e8e4de', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#B5A692', fontSize: '20px', fontStyle: 'italic' }}>R</span> */}
            <img src="/founder.jpg" alt="Romy Frazier" style={{ width:'48px', height:'48px', borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
          </div>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#1a1a1a', fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>Romy Frazier, Esq.</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#8a7f78', fontSize: '12px', lineHeight: 1.55 }}>
              Succession attorney. After years watching families search for words never written, she built the tool she wished had existed.
            </p>
          </div>
        </div>

        {/* ── 4. FORM — primary ── */}
        <div className="fade-3" style={{ marginBottom: '40px' }}>
          <FormBlock id="form-top" />
        </div>

        {/* ── 5. HOW IT WORKS ── */}
        <div className="fade-3" style={{ marginBottom: '40px' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
            How it works
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', background: '#fff', border: '1px solid #e8e4de', borderRadius: '14px', overflow: 'hidden' }}>
            {[
              ['01', 'We ask. You answer.', 'Guided questions draw out what matters most — in your own words, at your own pace.'],
              ['02', 'We write it for you.', 'We turn your answers into a finished letter that sounds exactly like you.'],
              ['03', 'Pay only when it\'s ready.', 'Read it. Love it. Then decide. Not a cent before.'],
            ].map(([num, title, desc], i) => (
              <div key={num} style={{ display: 'flex', gap: '16px', padding: '18px 20px', borderBottom: i < 2 ? '1px solid #e8e4de' : 'none' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#B5A692', fontSize: '18px', fontWeight: 500, flexShrink: 0, marginTop: '2px' }}>{num}</span>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#1a1a1a', fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>{title}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#8a7f78', fontSize: '13px', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. STATS ── */}
        <div className="fade-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '40px', padding: '20px', background: '#fff', border: '1px solid #e8e4de', borderRadius: '14px' }}>
          {[['2,800+', 'families served'], ['30 min', 'to complete'], ['100%', 'private']].map(([num, label], i) => (
            <React.Fragment key={label}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#1a1a1a', fontWeight: 600, fontSize: '20px', lineHeight: 1 }}>{num}</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#8a7f78', fontSize: '11px', marginTop: '4px', letterSpacing: '0.04em' }}>{label}</p>
              </div>
              {i < 2 && <div className="stat-divider" />}
            </React.Fragment>
          ))}
        </div>

        {/* ── 7. TESTIMONIALS ── */}
        <div className="fade-4" style={{ marginBottom: '40px' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
            From families who found letters — and those who didn't
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#2a2520', fontSize: '18px', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '12px' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: t.positive ? '#B5A692' : '#b0a89e', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  — {t.attribution}
                </p>
              </div>
            ))}
          </div>

          {/* Closing dark card */}
          <div style={{ marginTop: '12px', padding: '22px 24px', background: '#1a1a1a', borderRadius: '14px' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#f0ece6', fontSize: '19px', lineHeight: 1.65, fontStyle: 'italic' }}>
              The letter they&apos;ll search for after you&apos;re gone —
              you can write it today.{' '}
              <span style={{ color: '#B5A692' }}>30 minutes. Free to start.</span>
            </p>
          </div>
        </div>

        {/* ── 8. SECOND FORM ── */}
        <div className="fade-4" style={{ marginBottom: '56px' }}>
          <FormBlock id="form-mid" />
        </div>

        {/* ── 9. FAQ ── */}
        <div className="fade-5">
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
            Questions & answers
          </p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#1a1a1a', fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 500, lineHeight: 1.2, textAlign: 'center', marginBottom: '24px' }}>
            Everything you need to know
          </h2>

          <div style={{ background: '#fff', border: '1px solid #e8e4de', borderRadius: '16px', padding: '0 20px' }}>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-trigger" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#1a1a1a', fontSize: '14px', fontWeight: 500, lineHeight: 1.5 }}>
                    {faq.q}
                  </p>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    border: '1.5px solid #B5A692', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#B5A692', fontSize: '16px', lineHeight: 1,
                    transform: openFaq === i ? 'rotate(45deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}>
                    +
                  </div>
                </button>
                <div style={{
                  maxHeight: openFaq === i ? '400px' : '0',
                  opacity: openFaq === i ? 1 : 0,
                  overflow: 'hidden',
                  paddingBottom: openFaq === i ? '16px' : '0',
                  transition: 'max-height 0.35s ease, opacity 0.3s ease, padding-bottom 0.3s ease',
                }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#5a5450', fontSize: '14px', lineHeight: 1.75 }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── 10. THIRD FORM — bottom of FAQ ── */}
          <div style={{ marginTop: '32px' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#1a1a1a', fontSize: '22px', fontStyle: 'italic', textAlign: 'center', marginBottom: '20px', lineHeight: 1.4 }}>
              Still unsure? Start free — you don&apos;t pay<br />until you&apos;ve read your letter and loved it.
            </p>
            <FormBlock id="form-bottom" />
          </div>
        </div>

      </div>
    </main>
  )
}