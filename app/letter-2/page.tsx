'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// ─── ANALYTICS SETUP ───────────────────────────────────────────────
// 1. Google Analytics 4
//    - Go to analytics.google.com → create property → get Measurement ID (G-XXXXXXXXXX)
//    - Replace 'G-XXXXXXXXXX' below with your real ID
//    - OR add NEXT_PUBLIC_GA_ID to your Vercel environment variables
//
// 2. Microsoft Clarity (FREE heatmaps + session recordings — highly recommended)
//    - Go to clarity.microsoft.com → create project → get Project ID
//    - Replace 'CLARITY_PROJECT_ID' below with your real ID
//    - OR add NEXT_PUBLIC_CLARITY_ID to your Vercel environment variables
//
// Both tools are free. Clarity will show you EXACTLY where people scroll,
// click, and drop off. Install both.
// ───────────────────────────────────────────────────────────────────

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || 'CLARITY_PROJECT_ID'

function Analytics() {
  useEffect(() => {
    // ── Google Analytics 4 ──
    if (GA_ID && GA_ID !== 'G-XXXXXXXXXX') {
      const gaScript = document.createElement('script')
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      gaScript.async = true
      document.head.appendChild(gaScript)

      const gaInline = document.createElement('script')
      gaInline.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { page_path: window.location.pathname });
      `
      document.head.appendChild(gaInline)
    }

    // ── Microsoft Clarity ──
    if (CLARITY_ID && CLARITY_ID !== 'CLARITY_PROJECT_ID') {
      const clarityScript = document.createElement('script')
      clarityScript.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `
      document.head.appendChild(clarityScript)
    }
  }, [])

  return null
}

// Helper to fire GA events from within the page
function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', eventName, params)
  }
}
// ───────────────────────────────────────────────────────────────────

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

    // Track form submission attempt
    trackEvent('form_submit_attempt', { location: 'squeeze_page' })

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

      // Track successful lead capture
      trackEvent('lead_captured', { source: 'variant-2-unfinished' })

      router.push(`/login?email=${encodeURIComponent(email.trim())}&from=squeeze`)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const testimonials = [
    {
      quote: "I recently found a letter I'd forgotten my dad had written. It's full of things he almost never said — how proud he was, that he loved me. It's one of the most precious things I own.",
      attribution: 'From our community',
      positive: true,
    },
    {
      quote: "I kept putting it off for three years. Finished it in one sitting. I don't know why I waited so long.",
      attribution: 'From our community',
      positive: true,
    },
    {
      quote: "I searched high and low for a letter from my mom when she passed. I came up empty. If she had known, she would have written me 1,000 letters — I am 100% sure of that.",
      attribution: 'From our community',
      positive: false,
    },
    {
      quote: "His passing was so sudden. I never got to truly tell him how much I cared. I wish I could have looked him in the eye one more time.",
      attribution: 'From our community',
      positive: false,
    },
  ]

  const letterSamples = [
    {
      img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/b6928b1ff3-5f14b58975b1d2ee8653.png',
      alt: 'handwritten letter excerpt on cream paper',
      excerpt: '"To my children: The business was never about the money. The main goal was to employ people — to create work that families could count on, year after year. That responsibility shaped every decision I made."',
    },
    {
      img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/edfa5d937f-76da4d6ffa1e2ba295bf.png',
      alt: 'typewritten letter on vintage paper',
      excerpt: '"When I went into labor, my delivery room had a huge mural of a cardinal across the entire wall. I knew my dad was with me. I hope that you will feel me with you, always."',
    },
    {
      img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/78f547d41e-360d242a7e8bd017efb5.png',
      alt: 'elegant handwritten note on stationery',
      excerpt: '"She taught me about generosity. She bought me my graduation dress — the price tag was more than every other dress in my closet combined. She was the richest person I knew."',
    },
    {
      img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/65d8b3b6e3-08a7c89f663e9d7d2c99.png',
      alt: 'personal letter on fine paper',
      excerpt: '"Remember the summers at the lake house. It is more than a property. It is where we became us. Keep taking the kids there and measuring their height on the bark of the oak tree — like we did with you."',
    },
  ]

  const faqs = [
    { q: 'What happens in the first 5 minutes after I sign up?', a: "You'll receive a secure login link in your inbox immediately. Once you click it, you can begin answering your first guided questions right away. There's no complex setup — just your story, at your own pace." },
    { q: 'How soon will I see a draft of my letter?', a: 'As soon as you finish the questionnaire, we begin crafting your letter. Most families see their draft ready for review within 15 to 30 minutes of completing their answers.' },
    { q: "What if I'm not ready to finish everything today?", a: "That's perfectly fine. Your progress is saved in real-time. Answer two questions today, finish the rest next week. You move at whatever pace feels right." },
    { q: 'What exactly is a legacy letter?', a: "A legacy letter is a personal message from you to the people you love — written in your voice. Not a legal document. Not a will. Just the things that matter most: what shaped you, what you believe, what you want them to carry forward when life gets hard." },
    { q: 'How is this different from a will?', a: "A will distributes your assets. A legacy letter passes on your meaning. Your kids will know who gets the house — but without a letter, they may never know why you bought it, what you sacrificed for them, or what you actually believe. A will is for lawyers. A letter is for your family." },
    { q: 'Do I have to be a good writer?', a: "No. You never write a single word. We ask you guided questions. You answer in your own words — as if you're talking to someone you trust. We take your answers and write the finished letter for you, in your voice." },
    { q: 'How long does it take?', a: "Most people finish the questionnaire in 30 minutes or less. You can do it in one sitting, or save your progress and come back. There's no deadline." },
    { q: 'Is this AI-generated?', a: "Your letter is built entirely from your own words and answers. The result reads like you — because it is you. We use your responses to craft something personal and specific, not a generic template." },
    { q: 'Is my information private?', a: "Yes. Your answers and your letter are completely private. We never share your information with anyone. Your letter belongs to you." },
    { q: "What if I don't love the letter?", a: "You don't pay until you've read it and decided it's right. If it doesn't feel like you, we'll revise it. Still not happy? Full refund, no questions asked." },
    { q: 'How much does it cost?', a: "Starting is completely free. You only pay $97 when your letter is ready and you've decided you love it. One-time payment — no subscriptions, no hidden fees." },
    { q: 'Can I write letters for more than one person?', a: "Yes. Many people write individual letters to each child or grandchild. Once you've completed your first letter, you can start another at any time." },
  ]

  const FormBlock = ({ id }: { id: string }) => (
    <div id={id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError('') }}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        onFocus={() => trackEvent('form_focus', { form_id: id })}
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
      {/* Analytics — loads GA4 + Clarity */}
      <Analytics />

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
        .faq-item { border-bottom: 1px solid #e8e4de; }
        .faq-item:last-child { border-bottom: none; }

        .testimonial-card {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 14px;
          padding: 22px 24px;
        }

        .letter-card {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 14px;
          overflow: hidden;
        }

        .stat-divider { width: 1px; height: 24px; background: #d4c8bb; }

        input[type="email"]:focus {
          border-color: #B5A692 !important;
          outline: none;
        }
      `}</style>

      <div className="texture-overlay" />
      <div style={{ width: '100%', height: '3px', background: 'linear-gradient(90deg, #B5A692 0%, #d4c8bb 50%, #B5A692 100%)', position: 'relative', zIndex: 1 }} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 1, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#1a1a1a', fontSize: '17px', fontWeight: 500, letterSpacing: '0.04em' }}>
          Succession <span style={{ color: '#B5A692' }}>Story</span>
        </p>
        <a
          href="mailto:davidefod@gmail.com?subject=Question about Succession Story&body=Hi, I have a question about..."
          style={{
            fontFamily: 'DM Sans, sans-serif', color: '#8a7f78', fontSize: '11px',
            letterSpacing: '0.04em', textDecoration: 'none', display: 'flex',
            alignItems: 'center', gap: '5px', transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#B5A692')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8a7f78')}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Need help?
        </a>
      </nav>

      {/* Trust strip — avatars + stars + family count */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto', width: '100%', padding: '0 20px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Overlapping avatars */}
          <div style={{ display: 'flex' }}>
            {[
              'https://i.pravatar.cc/40?img=47',
              'https://i.pravatar.cc/40?img=32',
              'https://i.pravatar.cc/40?img=15',
              'https://i.pravatar.cc/40?img=57',
              'https://i.pravatar.cc/40?img=24',
            ].map((src, i) => (
              <div key={i} style={{
                width: '34px', height: '34px', borderRadius: '50%',
                border: '2px solid #f9f6f1', overflow: 'hidden',
                marginLeft: i === 0 ? 0 : '-10px',
                position: 'relative', zIndex: 5 - i,
                background: '#e8e4de',
              }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          {/* Stars */}
          <div style={{ display: 'flex', gap: '2px', marginLeft: '4px' }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="15" height="15" viewBox="0 0 20 20" fill="#f5a623">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        {/* Count line */}
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#5a5450', fontSize: '12px', letterSpacing: '0.02em' }}>
          Trusted by <strong style={{ color: '#1a1a1a' }}>2,800+ families</strong> who've secured their legacy
        </p>
      </div>

      {/* Sticky help button — bottom right, appears after scroll */}
      <a
        href="mailto:davidefod@gmail.com?subject=Question about Succession Story&body=Hi, I have a question about Succession Story..."
        style={{
          position: 'fixed', bottom: '24px', right: '20px', zIndex: 100,
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#1a1a1a', color: '#B5A692',
          fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600,
          padding: '12px 18px', borderRadius: '50px',
          textDecoration: 'none', letterSpacing: '0.02em',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          transition: 'transform 0.2s, background 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Have a question?
      </a>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto', width: '100%', padding: '0 20px 64px' }}>

        {/* ── 1. HEADLINE ── */}
        <div className="fade-1" style={{ textAlign: 'center', padding: '28px 0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', gap: '10px' }}>
            <div style={{ width: '32px', height: '1px', background: '#B5A692' }} />
            <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Free to start</span>
            <div style={{ width: '32px', height: '1px', background: '#B5A692' }} />
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#1a1a1a', fontSize: 'clamp(32px, 8vw, 48px)', lineHeight: 1.15, fontWeight: 500, marginBottom: '18px' }}>
            Give your kids the one thing<br />
            they&apos;ll search for<br />
            <em style={{ color: '#B5A692' }}>after you&apos;re gone.</em>
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#5a5450', fontSize: '16px', lineHeight: 1.75, marginBottom: '8px', maxWidth: '480px', margin: '0 auto 8px' }}>
            A personal letter — written in your voice, from your answers — that tells your family who you really were, what you believed, and why you made the choices you made.
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#8a7f78', fontSize: '14px', lineHeight: 1.6, margin: '8px auto 0', maxWidth: '380px' }}>
            30 minutes. No writing skill needed. Free to start.
          </p>
        </div>

        {/* ── 2. VSL ── */}
        <div className="fade-2" style={{ marginBottom: '20px' }}>
          <div style={{ background: '#1a1a1a', borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video src="/video.mp4" controls poster="/romy-poster.jpg"
                style={{ width:'100%', height:'100%', objectFit:'cover' }} playsInline />
            {/* <div style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#B5A692', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#1a1a1a"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#f0ece6', fontSize: '18px', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '6px' }}>
                A message from Romy Frazier, Esq.
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#B5A692', fontSize: '12px', letterSpacing: '0.08em' }}>Succession Attorney & Founder</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#4a4540', fontSize: '11px', marginTop: '8px' }}>Video coming soon</p>
            </div> */}
          </div>
        </div>

        {/* ── 3. FOUNDER BIO ── */}
        <div className="fade-2" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', background: '#fff', border: '1px solid #e8e4de', borderRadius: '12px', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e8e4de', flexShrink: 0, overflow: 'hidden' }}>
            <img src="/founder.jpg" alt="Romy Frazier" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#1a1a1a', fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>Romy Frazier, Esq.</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#8a7f78', fontSize: '12px', lineHeight: 1.55 }}>
              Succession attorney. After years watching families search for words never written, she built the tool she wished had existed.
            </p>
          </div>
        </div>

        {/* ── 4. FORM #1 ── */}
        <div className="fade-3" style={{ marginBottom: '40px' }}>
          <FormBlock id="form-top" />
        </div>

        {/* ── 5. HOW IT WORKS ── */}
        <div className="fade-3" style={{ marginBottom: '40px' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
            How it works
          </p>
          <div style={{ background: '#fff', border: '1px solid #e8e4de', borderRadius: '14px', overflow: 'hidden' }}>
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
          <div style={{ marginTop: '12px', padding: '22px 24px', background: '#1a1a1a', borderRadius: '14px' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#f0ece6', fontSize: '19px', lineHeight: 1.65, fontStyle: 'italic' }}>
              The letter they&apos;ll search for after you&apos;re gone —
              you can write it today.{' '}
              <span style={{ color: '#B5A692' }}>30 minutes. Free to start.</span>
            </p>
          </div>
        </div>

        {/* ── 8. FORM #2 ── */}
        <div className="fade-4" style={{ marginBottom: '56px' }}>
          <FormBlock id="form-mid" />
        </div>

        {/* ── 9. LETTER SAMPLES — shows the product, creates desire ── */}
        <div className="fade-4" style={{ marginBottom: '56px' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#B5A692', fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
            What a legacy letter sounds like
          </p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#1a1a1a', fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 500, lineHeight: 1.25, textAlign: 'center', marginBottom: '6px' }}>
            Real letters. Real families.
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#8a7f78', fontSize: '13px', textAlign: 'center', marginBottom: '24px', lineHeight: 1.6 }}>
            Blurred to protect privacy — every word is real.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {letterSamples.map((letter, i) => (
              <div key={i} className="letter-card">
                <img
                  src={letter.img}
                  alt={letter.alt}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', filter: 'blur(2px)', display: 'block' }}
                />
                <div style={{ padding: '18px 20px' }}>
                  <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#3a3530', fontSize: '17px', lineHeight: 1.7, fontStyle: 'italic' }}>
                    {letter.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA directly after samples — desire peaks here */}
          <div style={{ marginTop: '28px' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#1a1a1a', fontSize: '20px', fontStyle: 'italic', textAlign: 'center', marginBottom: '20px', lineHeight: 1.45 }}>
              Your letter is already inside you.<br />
              <span style={{ color: '#B5A692' }}>We just help you get it out.</span>
            </p>
            <FormBlock id="form-letters" />
          </div>
        </div>

        {/* ── 10. FAQ ── */}
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
                <button
                  className="faq-trigger"
                  onClick={() => {
                    setOpenFaq(openFaq === i ? null : i)
                    trackEvent('faq_opened', { question: faq.q.substring(0, 50) })
                  }}
                >
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

          {/* ── 11. FORM #4 — bottom catch ── */}
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