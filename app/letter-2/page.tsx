"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── ANALYTICS SETUP ───────────────────────────────────────────────
// Google Analytics 4: add NEXT_PUBLIC_GA_ID to Vercel env vars
// Microsoft Clarity: add NEXT_PUBLIC_CLARITY_ID to Vercel env vars
// ───────────────────────────────────────────────────────────────────

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "CLARITY_PROJECT_ID";

function Analytics() {
  useEffect(() => {
    if (GA_ID && GA_ID !== "G-XXXXXXXXXX") {
      const gaScript = document.createElement("script");
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      gaScript.async = true;
      document.head.appendChild(gaScript);

      const gaInline = document.createElement("script");
      gaInline.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { page_path: window.location.pathname });
      `;
      document.head.appendChild(gaInline);
    }

    if (CLARITY_ID && CLARITY_ID !== "CLARITY_PROJECT_ID") {
      const clarityScript = document.createElement("script");
      clarityScript.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `;
      document.head.appendChild(clarityScript);
    }
  }, []);

  return null;
}

function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
}

// ─── YOUTUBE VIDEO EMBED ───────────────────────────────────────────
// Drop your YouTube video ID here (e.g. 'dQw4w9WgXcQ' from the URL)
const YOUTUBE_VIDEO_ID = "hma2VrOJjZg";
// ───────────────────────────────────────────────────────────────────

// ─── OUTSIDE the main component ───────────────────────────────────
function FormBlock({
  id,
  email,
  loading,
  error,
  onEmailChange,
  onSubmit,
  onFocus,
}: {
  id: string;
  email: string;
  loading: boolean;
  error: string;
  onEmailChange: (val: string) => void;
  onSubmit: () => void;
  onFocus: (id: string) => void;
}) {
  return (
    <div
      id={id}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        onFocus={() => onFocus(id)}
        disabled={loading}
        style={{
          width: "100%",
          padding: "16px 20px",
          border: "1.5px solid #d4c8bb",
          background: "#fff",
          color: "#1a1a1a",
          borderRadius: "10px",
          fontSize: "16px",
          fontFamily: "var(--font-dm-sans), sans-serif",
          outline: "none",
          boxSizing: "border-box" as const,
          transition: "border-color 0.2s",
        }}
      />
      {error && (
        <p
          style={{
            color: "#c0392b",
            fontSize: "13px",
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
        >
          {error}
        </p>
      )}
      <button
        onClick={onSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "17px",
          background: "#1a1a1a",
          color: "#B5A692",
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontWeight: 600,
          fontSize: "16px",
          border: "none",
          borderRadius: "10px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
          letterSpacing: "0.02em",
        }}
      >
        {loading ? "Creating your account..." : "Start my family's letter"}
      </button>
      <p
        style={{
          color: "#b0a89e",
          fontSize: "12px",
          textAlign: "center",
          fontFamily: "var(--font-dm-sans), sans-serif",
          marginTop: "2px",
        }}
      >
        We'll send your login link to this email. We never share it with anyone.
      </p>
    </div>
  );
}

export default function SqueezePageVariant2() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setError("");

    trackEvent("form_submit_attempt", { location: "squeeze_page" });

    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "variant-2-unfinished",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead");
      }

      trackEvent("lead_captured", { source: "variant-2-unfinished" });

      window.location.href = data.redirect || "/questionnaire";
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const testimonials = [
    {
      quote:
        "I recently found a letter I'd forgotten my dad had written. It's full of things he almost never said, how proud he was, that he loved me. It's one of the most precious things I own.",
      attribution: "From our community",
      positive: true,
    },
    {
      quote:
        "I kept putting it off for three years. Finished it in one sitting. I don't know why I waited so long.",
      attribution: "From our community",
      positive: true,
    },
    {
      quote:
        "I searched high and low for a letter from my mom when she passed. I came up empty. If she had known, she would have written me 1,000 letters. I am 100% sure of that.",
      attribution: "From our community",
      positive: false,
    },
    {
      quote:
        "His passing was so sudden. I never got to truly tell him how much I cared. I wish I could have looked him in the eye one more time.",
      attribution: "From our community",
      positive: false,
    },
  ];

  const letterSamples = [
    {
      img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/b6928b1ff3-5f14b58975b1d2ee8653.png",
      alt: "handwritten letter excerpt on cream paper",
      excerpt:
        '"To my children: The business was never about the money. The main goal was to employ people, to create work that families could count on, year after year. That responsibility shaped every decision I made."',
    },
    {
      img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/edfa5d937f-76da4d6ffa1e2ba295bf.png",
      alt: "typewritten letter on vintage paper",
      excerpt:
        '"When I went into labor, my delivery room had a huge mural of a cardinal across the entire wall. I knew my dad was with me. I hope that you will feel me with you, always."',
    },
    {
      img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/78f547d41e-360d242a7e8bd017efb5.png",
      alt: "elegant handwritten note on stationery",
      excerpt:
        '"She taught me about generosity. She bought me my graduation dress, the price tag was more than every other dress in my closet combined. She was the richest person I knew."',
    },
    {
      img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/65d8b3b6e3-08a7c89f663e9d7d2c99.png",
      alt: "personal letter on fine paper",
      excerpt:
        '"Remember the summers at the lake house. It is more than a property. It is where we became us. Keep taking the kids there and measuring their height on the bark of the oak tree, like we did with you."',
    },
  ];

  const faqs = [
  {
    q: "What exactly is a Succession Story?",
    a: "It's a personal letter from you that captures the 'why' behind your decisions, the stories you want to preserve, the wisdom you've earned. Not just that you're leaving the house to them — but how you decided to trust them with it. Not just a bank account getting transferred — but the philosophy behind how you made your money compound. Think of it as the voice your trust never had.",
  },
  {
    q: "Do I need a will or estate plan before I start?",
    a: "No. A Succession Story stands completely on its own. While it makes a powerful companion to a formal estate plan, you don't need one to begin. Many of our members create their Succession Story first and find it clarifies their thinking when it comes time to work with an attorney. What you need is something to say — and if you're here, you already have that.",
  },
  {
    q: "How is this different from my estate plan or will?",
    a: "Your estate plan was drafted by attorneys to list and distribute your assets. Your life insurance simply lists beneficiaries. Your bank account will just be dollars transferred. Not one of those documents says a word about you. Not why you made the decisions you made. Not what the money cost you. Not what you believed, what you sacrificed, or what you hope for the people who are about to inherit your life's work. One handles the paperwork. The other handles everything your successors will actually need when the paperwork is done.",
  },
  {
    q: "I already have a succession plan. Why do I need this?",
    a: "Your succession plan tells your successors who leads and who receives what. It doesn't tell them why you made the decisions you made, what you want the culture to remain, what you would say on their first hard day without you, or what the wealth is actually for across generations. Legal documents transfer structure. Succession Story transfers meaning. They are not competing, they are completing each other.",
  },
  {
    q: "Why not just write the letter myself or use ChatGPT?",
    a: "You absolutely can write it yourself — and if you do, it will mean everything to your family. But most people face a blank page and don't know where to start. As for AI: it can write a letter, but it cannot ask the right questions. Our founder is an attorney who developed this questionnaire from years working directly with high-net-worth families navigating inheritance, business transition, and loss. We know what successors wish they'd been told. A human reviews your letter before it's delivered. An AI outputs a document. We help you leave a legacy.",
  },
  {
    q: "Is this a legal document?",
    a: "No. Succession Story has no legal effect and does not replace, modify, or override any will, trust, shareholder agreement, or estate plan. It is a personal and philosophical document — the kind that gives your legal documents context and your successors direction. For legal matters, always work with qualified counsel.",
  },
  {
    q: "I'm not the kind of person who writes letters. Is this really for me?",
    a: "It is built for you specifically. You do not have to write anything. You answer questions. We do the writing. Most who approach this with resistance tell us afterward that it felt like a conversation, not a composition. When they read the finished letter, they recognized themselves in it completely.",
  },
  {
    q: "I have said what I needed to say to my children in person. Why write it down?",
    a: "Because you will not always be there to say it again. A conversation cannot be retrieved. A letter can be returned to at the exact moment it is most needed — which is almost never the moment you expected. Your daughter reads it the day after your funeral. Your grandson reads it at twenty-two before his first major decision. The conversations were for the present. The letter is for every moment after.",
  },
  {
    q: "My children are young. Is it worth doing this now?",
    a: "Especially now. The families who benefit most are often the ones where children were young when a parent passed — they had the fewest memories and the most questions. Your letter becomes something they can grow into, returning to it at different stages of life and finding new meaning each time. There is no such thing as doing this too early.",
  },
  {
    q: "I'm young and my life is still changing. Why would I do this now?",
    a: "Because now is exactly when it matters most. A Succession Story is not a document for the end of life. It is a record of who you are right now, at this exact moment, for the people who need to know you most. If you wait, your child may not remember this version of you. Even you might not. This letter will. It takes under an hour. The next generation is worth an hour. So are you.",
  },
  {
    q: "Will this help prevent conflict between my children after I'm gone?",
    a: "It won't guarantee harmony — nothing can. But it removes the single most common cause of post-loss family conflict: the unanswered question. Most disputes aren't really about money. They're about feeling unseen, unloved, or confused about why things happened the way they did. When your family has your words, your actual reasoning, in your actual voice, there is far less room for assumption, resentment, or misunderstanding.",
  },
  {
    q: "What if I have a blended family or complicated family dynamics?",
    a: "This is exactly where a Succession Story earns its greatest value. In families with complexity — stepchildren, estrangements, unequal distributions, or long-held tensions — the silence that follows a loss can do real damage. Your letter doesn't need to resolve every conflict. It simply needs to explain your heart. When your family understands the love and intention behind your decisions, even difficult ones become easier to accept.",
  },
  {
    q: "My children are financially educated. Do they still need a letter from me?",
    a: "Financial education tells them how to manage wealth. Only you can tell them why it was built, what it cost, what it means, and what you hope they do with it beyond managing it. The families that sustain wealth across generations are not always the most financially sophisticated. They are the ones with the clearest shared understanding of what the wealth is for. That understanding comes from you. It cannot come from a financial advisor.",
  },
  {
    q: "My grandchildren will carry their father's name, not mine. Will they know where the wealth came from?",
    a: "Not unless you tell them. Assets transfer. Names and stories do not. Without a deliberate record, the origin of wealth fades within a generation. Succession Story gives your grandchildren something no inheritance document can: the experience of knowing you, where you came from, and what you built. They come from you too. This is how you make sure they know it.",
  },
  {
    q: "My parents never talked about things like this and I turned out fine. Why does this generation need a letter?",
    a: "Think about what you wished you had known about them. The questions you would have asked. The stories that died with them. You have the chance to provide a more complete version.",
  },
  {
    q: "I want my children to understand the mindset that created this wealth, not just the wealth itself. How do I pass that down?",
    a: "By writing it down before it dies with you. Your philosophy about risk, work, money, and what both are for lives inside you and goes nowhere unless you put it on paper. Succession Story surfaces that mindset deliberately. Your grandchildren may never build what you built. But if they understand how you thought, they will make better decisions with what you leave them. That is worth more than the assets themselves.",
  },
  {
    q: "Why should I pay for something I could write myself?",
    a: "You could. The question is whether you will. Most people who intend to write this on their own don't — not because they lack the ability, but because without structure and process, the intention stays an intention. The $97 is not for the writing. It is for the questions that unlock the writing, the process that organizes it, the human who reads it before it reaches you, and the certainty that it actually gets done. Let us do this for you.",
  },
  {
    q: "I've been meaning to do something like this for years. What's actually stopping me?",
    a: "Usually one of three things: not knowing where to start (our guided process solves this entirely), not having the time (most members finish in under an hour), or a quiet belief that it can wait. In twenty years of succession work, the most painful situations I've encountered are not the ones where the legal documents were imperfect. They are the ones where the person ran out of time before they said what needed to be said. This is the thing that cannot wait.",
  },
];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f9f6f1",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Analytics />

      <style>{`
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

        /* YouTube embed — lazy loads only on click, no tracking params */
        .yt-facade {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
        }
        .yt-facade img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .yt-play-btn {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .yt-play-btn svg {
          width: 72px; height: 72px; filter: drop-shadow(0 2px 12px rgba(0,0,0,0.4));
          transition: transform 0.2s;
        }
        .yt-facade:hover .yt-play-btn svg { transform: scale(1.08); }
        .yt-iframe {
          width: 100%; height: 100%;
          border: none; border-radius: 16px;
          aspect-ratio: 16/9;
        }
      `}</style>

      <div className="texture-overlay" />
      <div
        style={{
          width: "100%",
          height: "3px",
          background:
            "linear-gradient(90deg, #B5A692 0%, #d4c8bb 50%, #B5A692 100%)",
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Nav */}
      <nav
        style={{
          position: "relative",
          zIndex: 1,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "600px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            color: "#1a1a1a",
            fontSize: "17px",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          Succession <span style={{ color: "#B5A692" }}>Story</span>
        </p>
        <button
          onClick={() => setShowContact(true)}
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#8a7f78",
            fontSize: "11px",
            letterSpacing: "0.04em",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            transition: "color 0.2s",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#B5A692")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#8a7f78")}
        >
          <svg
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Need help?
        </button>
      </nav>

      {/* Sticky help button */}
      <button
        onClick={() => setShowContact(true)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "20px",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#1a1a1a",
          color: "#B5A692",
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          padding: "12px 18px",
          borderRadius: "50px",
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.02em",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        }}
      >
        <svg
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Have a question?
      </button>

      {/* Contact modal */}
      {showContact && (
        <div
          onClick={() => {
            setShowContact(false);
            setContactSent(false);
            setContactName("");
            setContactMsg("");
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#f9f6f1",
              borderRadius: "20px 20px 0 0",
              padding: "28px 24px 40px",
              width: "100%",
              maxWidth: "600px",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "4px",
                background: "#d4c8bb",
                borderRadius: "2px",
                margin: "0 auto 24px",
              }}
            />

            {!contactSent ? (
              <>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    color: "#1a1a1a",
                    fontSize: "22px",
                    fontWeight: 500,
                    marginBottom: "6px",
                    lineHeight: 1.3,
                  }}
                >
                  Have a question?
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    color: "#8a7f78",
                    fontSize: "13px",
                    marginBottom: "20px",
                    lineHeight: 1.6,
                  }}
                >
                  Send us a message and we'll get back to you shortly.
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1.5px solid #d4c8bb",
                      background: "#fff",
                      color: "#1a1a1a",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      outline: "none",
                      boxSizing: "border-box" as const,
                    }}
                  />
                  <textarea
                    placeholder="What would you like to know?"
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1.5px solid #d4c8bb",
                      background: "#fff",
                      color: "#1a1a1a",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      outline: "none",
                      resize: "none",
                      boxSizing: "border-box" as const,
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 16px",
                      background: "#fff",
                      border: "1px solid #e8e4de",
                      borderRadius: "10px",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="#B5A692"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        color: "#5a5450",
                        fontSize: "13px",
                        flex: 1,
                      }}
                    >
                      Or email us directly:{" "}
                      <strong style={{ color: "#1a1a1a", userSelect: "all" }}>
                        hello@successionstory.now
                      </strong>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (!contactMsg.trim()) return;
                      const subject = encodeURIComponent(
                        "Question about Succession Story",
                      );
                      const body = encodeURIComponent(
                        (contactName ? `Name: ${contactName}\n\n` : "") +
                          `Message: ${contactMsg}`,
                      );
                      window.open(
                        `https://mail.google.com/mail/?view=cm&to=hello@successionstory.now&su=${subject}&body=${body}`,
                        "_blank",
                      );
                      setContactSent(true);
                    }}
                    disabled={!contactMsg.trim()}
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: contactMsg.trim() ? "#1a1a1a" : "#e8e4de",
                      color: contactMsg.trim() ? "#B5A692" : "#b0a89e",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontWeight: 600,
                      fontSize: "15px",
                      border: "none",
                      borderRadius: "10px",
                      cursor: contactMsg.trim() ? "pointer" : "not-allowed",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Send message
                  </button>

                  <button
                    onClick={() => setShowContact(false)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      color: "#b0a89e",
                      fontSize: "13px",
                      padding: "4px",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "#1a1a1a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    stroke="#B5A692"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    color: "#1a1a1a",
                    fontSize: "22px",
                    fontWeight: 500,
                    marginBottom: "8px",
                  }}
                >
                  Message sent
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    color: "#8a7f78",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    marginBottom: "24px",
                  }}
                >
                  We'll get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setShowContact(false);
                    setContactSent(false);
                    setContactName("");
                    setContactMsg("");
                  }}
                  style={{
                    background: "#1a1a1a",
                    color: "#B5A692",
                    border: "none",
                    padding: "14px 32px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "600px",
          margin: "0 auto",
          width: "100%",
          padding: "0 20px 64px",
        }}
      >
        {/* ── 1. HEADLINE ── */}
        <div
          className="fade-1"
          style={{ textAlign: "center", padding: "28px 0 24px" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              color: "#1a1a1a",
              fontSize: "clamp(32px, 8vw, 48px)",
              lineHeight: 1.15,
              fontWeight: 500,
              marginBottom: "18px",
            }}
          >
            Give your kids the one thing
            <br />
            they&apos;ll search for
            <br />
            <em style={{ color: "#B5A692" }}>after you&apos;re gone.</em>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#5a5450",
              fontSize: "16px",
              lineHeight: 1.75,
              marginBottom: "8px",
              maxWidth: "480px",
              margin: "0 auto 8px",
            }}
          >
            A personal letter, written in your voice, from your answers, that
            tells your family who you really were, what you believed, and why
            you made the choices you made.
          </p>
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#8a7f78",
              fontSize: "14px",
              lineHeight: 1.6,
              margin: "8px auto 0",
              maxWidth: "380px",
            }}
          >
            No writing skill needed.
          </p>
        </div>

        {/* ── 2. TESTIMONIALS — immediately after headline ── */}
        <div className="fade-2" style={{ marginBottom: "32px" }}>
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#B5A692",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            From families who found letters, and those who didn't
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    color: "#2a2520",
                    fontSize: "18px",
                    lineHeight: 1.65,
                    fontStyle: "italic",
                    marginBottom: "12px",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    color: t.positive ? "#B5A692" : "#b0a89e",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {t.attribution}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "12px",
              padding: "22px 24px",
              background: "#1a1a1a",
              borderRadius: "14px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                color: "#f0ece6",
                fontSize: "19px",
                lineHeight: 1.65,
                fontStyle: "italic",
              }}
            >
              The letter they&apos;ll search for after you&apos;re gone.{" "}
              <span style={{ color: "#B5A692" }}>You can write it today.</span>
            </p>
          </div>
        </div>

        {/* ── 3. FORM #1 — right after testimonials ── */}
        <div className="fade-3" style={{ marginBottom: "48px" }}>
          <FormBlock
            id="form-top"
            email={email}
            loading={loading}
            error={error}
            onEmailChange={(val) => {
              setEmail(val);
              setError("");
            }}
            onSubmit={handleSubmit}
            onFocus={(id) => trackEvent("form_focus", { form_id: id })}
          />
        </div>

        {/* ── 4. LETTER SAMPLES ── */}
        <div className="fade-3" style={{ marginBottom: "48px" }}>
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#B5A692",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            What a legacy letter sounds like
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              color: "#1a1a1a",
              fontSize: "clamp(22px, 5vw, 30px)",
              fontWeight: 500,
              lineHeight: 1.25,
              textAlign: "center",
              marginBottom: "6px",
            }}
          >
            Real letters. Real families.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#8a7f78",
              fontSize: "13px",
              textAlign: "center",
              marginBottom: "24px",
              lineHeight: 1.6,
            }}
          >
            Blurred to protect privacy. Every word is real.
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {letterSamples.map((letter, i) => (
              <div key={i} className="letter-card">
                <Image
                  src={letter.img}
                  alt={letter.alt}
                  width={560}
                  height={180}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    filter: "blur(2px)",
                    display: "block",
                  }}
                />
                <div style={{ padding: "18px 20px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      color: "#3a3530",
                      fontSize: "17px",
                      lineHeight: 1.7,
                      fontStyle: "italic",
                    }}
                  >
                    {letter.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA after samples */}
          <div style={{ marginTop: "28px" }}>
            <p
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                color: "#1a1a1a",
                fontSize: "20px",
                fontStyle: "italic",
                textAlign: "center",
                marginBottom: "20px",
                lineHeight: 1.45,
              }}
            >
              Your letter is already inside you.
              <br />
              <span style={{ color: "#B5A692" }}>
                We just help you get it out.
              </span>
            </p>
            <FormBlock
              id="form-letters"
              email={email}
              loading={loading}
              error={error}
              onEmailChange={(val) => {
                setEmail(val);
                setError("");
              }}
              onSubmit={handleSubmit}
              onFocus={(id) => trackEvent("form_focus", { form_id: id })}
            />
          </div>
        </div>

        {/* ── 5. HOW IT WORKS ── */}
        <div className="fade-4" style={{ marginBottom: "40px" }}>
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#B5A692",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            How it works
          </p>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e4de",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            {[
              [
                "01",
                "We ask. You answer.",
                "Guided questions draw out what matters most, in your own words, at your own pace.",
              ],
              [
                "02",
                "We write it for you.",
                "We turn your answers into a finished letter that sounds exactly like you.",
              ],
              [
                "03",
                "Read it. Then decide.",
                "You see the finished letter before anything else. Your story, your call.",
              ],
            ].map(([num, title, desc], i) => (
              <div
                key={num}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "18px 20px",
                  borderBottom: i < 2 ? "1px solid #e8e4de" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    color: "#B5A692",
                    fontSize: "18px",
                    fontWeight: 500,
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  {num}
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      color: "#1a1a1a",
                      fontSize: "14px",
                      fontWeight: 600,
                      marginBottom: "3px",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      color: "#8a7f78",
                      fontSize: "13px",
                      lineHeight: 1.6,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. STATS ── */}
        <div
          className="fade-4"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "40px",
            padding: "20px",
            background: "#fff",
            border: "1px solid #e8e4de",
            borderRadius: "14px",
          }}
        >
          {[
            ["2,800+", "families served"],
            ["One sitting", "start to finish"],
            ["100%", "private"],
          ].map(([num, label], i) => (
            <React.Fragment key={label}>
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    color: "#1a1a1a",
                    fontWeight: 600,
                    fontSize: "20px",
                    lineHeight: 1,
                  }}
                >
                  {num}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    color: "#8a7f78",
                    fontSize: "11px",
                    marginTop: "4px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {label}
                </p>
              </div>
              {i < 2 && <div className="stat-divider" />}
            </React.Fragment>
          ))}
        </div>

        {/* ── 7. VIDEO + ROMY BIO ── */}
        <div className="fade-4" style={{ marginBottom: "40px" }}>
          {/* YouTube facade: loads thumbnail, only embeds iframe on click = much faster */}
          <YouTubeFacade videoId={YOUTUBE_VIDEO_ID} />

          {/* Romy bio — first person */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px 20px",
              background: "#fff",
              border: "1px solid #e8e4de",
              borderRadius: "12px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#e8e4de",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <Image
                src="/founder.jpg"
                alt="Romy Frazier"
                width={48}
                height={48}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "#1a1a1a",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "3px",
                }}
              >
                Romy Frazier, Esq.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "#8a7f78",
                  fontSize: "12px",
                  lineHeight: 1.55,
                }}
              >
                I'm a succession attorney. After years watching families search
                for words that were never written, I built the tool I wished had
                existed.
              </p>
            </div>
          </div>
        </div>

        {/* ── 8. FAQ ── */}
        <div className="fade-5">
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#B5A692",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Questions and answers
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              color: "#1a1a1a",
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: 500,
              lineHeight: 1.2,
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            Everything you need to know
          </h2>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e4de",
              borderRadius: "16px",
              padding: "0 20px",
            }}
          >
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-trigger"
                  onClick={() => {
                    setOpenFaq(openFaq === i ? null : i);
                    trackEvent("faq_opened", {
                      question: faq.q.substring(0, 50),
                    });
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      color: "#1a1a1a",
                      fontSize: "14px",
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    {faq.q}
                  </p>
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      border: "1.5px solid #B5A692",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#B5A692",
                      fontSize: "16px",
                      lineHeight: 1,
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    +
                  </div>
                </button>
                <div
                  style={{
                    maxHeight: openFaq === i ? "400px" : "0",
                    opacity: openFaq === i ? 1 : 0,
                    overflow: "hidden",
                    paddingBottom: openFaq === i ? "16px" : "0",
                    transition:
                      "max-height 0.35s ease, opacity 0.3s ease, padding-bottom 0.3s ease",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      color: "#5a5450",
                      fontSize: "14px",
                      lineHeight: 1.75,
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          

          {/* ── 9. ABOUT THE PROCESS ── */}
          <div style={{ marginTop: "48px" }}>
            <p
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                color: "#B5A692",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              About the process
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                color: "#1a1a1a",
                fontSize: "clamp(24px, 5vw, 32px)",
                fontWeight: 500,
                lineHeight: 1.2,
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              Simple, guided, and entirely yours
            </h2>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e8e4de",
                borderRadius: "16px",
                padding: "0 20px",
              }}
            >
              {[
                {
                  q: "How does it work?",
                  a: "You work through our guided questionnaire — thoughtful prompts that help you reflect on your life, your values, your decisions, and the people you love. Many prompts have multiple choice answers you can simply select from a dropdown. For open-ended questions, you can type your answers or speak them using our voice-to-text option. Or skip them entirely. The more of your words and voice you give us, the more we can tailor your letter to you. We shape your answers into a beautifully written letter in your voice.",
                },
                {
                  q: "How long does it take?",
                  a: "Most people finish in under an hour. The same hour that disappears scrolling Reels. The same hour that passes without memory watching television. Spent here, it produces something your family will read for the rest of their lives. Some take a little longer because they find themselves reflecting more deeply than expected — which we consider a feature, not a delay. There is no deadline and no pressure. You can save your progress and return whenever you're ready.",
                },
                {
                  q: "I'm not a writer. Can I still do this?",
                  a: "Of course. This was built specifically with you in mind. You never face a blank page. Our guided tool walks you through curated questions and you simply answer what feels true. It's mostly multiple choice, and your spoken answers don't need to be polished or perfect. That's our job.",
                },
                {
                  q: "Can I edit my letter after I receive it?",
                  a: "Yes. Your Succession Story is yours to adjust, refine, and update as life changes. We encourage you to revisit it when significant things happen — a new grandchild, a change in your estate plan, or simply a moment when something new feels worth saying.",
                },
                {
                  q: "Can you send the letter to my family for me?",
                  a: "Yes. When your Succession Story is complete, you can provide us with the physical mailing addresses or email addresses of the people you want to receive it, along with the date you want it delivered. We handle everything from there. Some members schedule delivery immediately, choosing to give their family the gift of hearing it while they're still here to see what it means to them. Some schedule for a meaningful date — a child's wedding, a grandchild's eighteenth birthday, a significant anniversary. Some do both, sending a piece of it now and preserving the full letter for later.",
                },
              ].map((item, i, arr) => (
                <ProcessItem key={i} item={item} isLast={i === arr.length - 1} />
              ))}
            </div>
          </div>

          {/* ── 10. FINAL FORM ── */}
          <div style={{ marginTop: "32px" }}>
            <p
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                color: "#1a1a1a",
                fontSize: "22px",
                fontStyle: "italic",
                textAlign: "center",
                marginBottom: "20px",
                lineHeight: 1.4,
              }}
            >
              The letter your family will carry with them forever.
              <br />
              <span style={{ color: "#B5A692" }}>Write it today.</span>
            </p>
            <FormBlock
              id="form-bottom"
              email={email}
              loading={loading}
              error={error}
              onEmailChange={(val) => {
                setEmail(val);
                setError("");
              }}
              onSubmit={handleSubmit}
              onFocus={(id) => trackEvent("form_focus", { form_id: id })}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── YOUTUBE FACADE COMPONENT ─────────────────────────────────────
// Renders a thumbnail + play button. Only loads the actual YouTube
// iframe when user clicks — dramatically faster page load.
function ProcessItem({
  item,
  isLast,
}: {
  item: { q: string; a: string };
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid #e8e4de" }}>
      <button
        className="faq-trigger"
        onClick={() => setOpen(!open)}
      >
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#1a1a1a",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          {item.q}
        </p>
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            border: "1.5px solid #B5A692",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#B5A692",
            fontSize: "16px",
            lineHeight: 1,
            transform: open ? "rotate(45deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          +
        </div>
      </button>
      <div
        style={{
          maxHeight: open ? "600px" : "0",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          paddingBottom: open ? "16px" : "0",
          transition: "max-height 0.35s ease, opacity 0.3s ease, padding-bottom 0.3s ease",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#5a5450",
            fontSize: "14px",
            lineHeight: 1.75,
          }}
        >
          {item.a}
        </p>
      </div>
    </div>
  );
}

function YouTubeFacade({ videoId }: { videoId: string }) {
  const [clicked, setClicked] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (clicked) {
    return (
      <iframe
        className="yt-iframe"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title="Romy Frazier — Succession Story"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          width: "100%",
          aspectRatio: "16/9",
          border: "none",
          borderRadius: "16px",
          display: "block",
        }}
      />
    );
  }

  return (
    <div className="yt-facade" onClick={() => setClicked(true)}>
      <Image src={thumbnailUrl} alt="Play video" width={560} height={315} />
      <div className="yt-play-btn">
        <svg viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M66.5 7.7c-.8-2.9-2.9-5.1-5.8-5.9C55.8 0 34 0 34 0S12.2 0 7.3 1.8C4.4 2.6 2.3 4.8 1.5 7.7 0 12.7 0 24 0 24s0 11.3 1.5 16.3c.8 2.9 2.9 5.1 5.8 5.9C12.2 48 34 48 34 48s21.8 0 26.7-1.8c2.9-.8 5-3 5.8-5.9C68 35.3 68 24 68 24s0-11.3-1.5-16.3z"
            fill="#ff0000"
          />
          <path d="M45 24L27 14v20" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}
