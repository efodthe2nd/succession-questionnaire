"use client";

import { useState } from "react";
import Analytics from "./_components/Analytics";
import CtaButton from "./_components/CtaButton";
import TrustLine from "./_components/TrustLine";
import ContactModal from "./_components/ContactModal";
import HeroSection from "./_components/HeroSection";
import TestimonialsSection from "./_components/TestimonialsSection";
import AgitationBand from "./_components/AgitationBand";
import LetterSamples from "./_components/LetterSamples";
import HowItWorks from "./_components/HowItWorks";
import StatsBar from "./_components/StatsBar";
import FounderVideo from "./_components/FounderVideo";
import VisionBand from "./_components/VisionBand";
import OfferBlock from "./_components/OfferBlock";
import FaqSection from "./_components/FaqSection";
import ProcessSection from "./_components/ProcessSection";
import FinalCta from "./_components/FinalCta";

export default function LetterPage() {
  const [showContact, setShowContact] = useState(false);

  return (
    <main style={{ minHeight: "100vh", background: "#f9f6f1", display: "flex", flexDirection: "column" }}>
      <Analytics />

      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-1 { animation: fadeUp 0.6s ease forwards; animation-delay: 0.05s; opacity: 0; }
        .fade-2 { animation: fadeUp 0.6s ease forwards; animation-delay: 0.15s; opacity: 0; }
        .fade-3 { animation: fadeUp 0.6s ease forwards; animation-delay: 0.25s; opacity: 0; }
        .fade-4 { animation: fadeUp 0.6s ease forwards; animation-delay: 0.35s; opacity: 0; }
        .fade-5 { animation: fadeUp 0.6s ease forwards; animation-delay: 0.45s; opacity: 0; }
        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(181,166,146,0.35); }
          50% { box-shadow: 0 0 0 10px rgba(181,166,146,0); }
        }
        .cta-pulse { animation: pulseGold 3s ease-in-out 1.5s infinite; }
        .texture-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.025; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E"); }
        .letter-card { background: #fff; border: 1px solid #e8e4de; border-radius: 14px; overflow: hidden; }
        .stat-divider { width: 1px; height: 24px; background: #d4c8bb; }
        .faq-trigger { width: 100%; background: none; border: none; padding: 18px 0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; text-align: left; gap: 16px; }
        .faq-item { border-bottom: 1px solid #e8e4de; }
        .faq-item:last-child { border-bottom: none; }
        .band-dark { background: #1a1a1a; padding: 48px 20px; margin: 0; }
        .offer-block { background: #fff; border: 1px solid #e8e4de; border-radius: 16px; overflow: hidden; position: relative; }
        .offer-block::before { content: ''; display: block; width: 100%; height: 3px; background: linear-gradient(90deg, #B5A692 0%, #d4c8bb 50%, #B5A692 100%); }
        .deliverable-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f0ebe4; font-family: var(--font-dm-sans), sans-serif; color: #3a3530; font-size: 14px; line-height: 1.6; }
        .deliverable-item:last-child { border-bottom: none; }
        .sticky-mobile-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 90; background: #1a1a1a; border-top: 2px solid #B5A692; padding: 12px 20px 16px; }
        @media (max-width: 640px) { .sticky-mobile-cta { display: block; } main { padding-bottom: 90px; } }
        .vision-quote { border-left: 3px solid #B5A692; padding-left: 20px; margin: 24px 0; }
      `}</style>

      <div className="texture-overlay" />

      {/* Gold accent line */}
      <div style={{ width: "100%", height: "3px", background: "linear-gradient(90deg, #B5A692 0%, #d4c8bb 50%, #B5A692 100%)", position: "relative", zIndex: 1 }} />

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 1, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "600px", margin: "0 auto", width: "100%" }}>
        <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1a1a", fontSize: "17px", fontWeight: 500, letterSpacing: "0.04em" }}>
          Succession <span style={{ color: "#B5A692" }}>Story</span>
        </p>
        <button onClick={() => setShowContact(true)} style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "11px", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer" }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          Need help?
        </button>
      </nav>

      {/* Sticky help button */}
      <button onClick={() => setShowContact(true)} style={{ position: "fixed", bottom: "24px", right: "20px", zIndex: 100, display: "flex", alignItems: "center", gap: "8px", background: "#1a1a1a", color: "#B5A692", fontFamily: "var(--font-dm-sans), sans-serif", fontSize: "13px", fontWeight: 600, padding: "12px 18px", borderRadius: "50px", border: "none", cursor: "pointer", letterSpacing: "0.02em", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}>
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Have a question?
      </button>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}

      {/* Page body */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto", width: "100%", padding: "0 20px 64px" }}>
        <HeroSection />
        <TestimonialsSection />

        {/* Mid-page CTA */}
        <div className="fade-3" style={{ marginBottom: "48px" }}>
          <div className="cta-pulse" style={{ borderRadius: "10px" }}>
            <CtaButton label="Write My Letter — Founding Member $17" trackId="mid" />
          </div>
          <TrustLine />
        </div>

        <AgitationBand />
        <LetterSamples />
        <HowItWorks />
        <StatsBar />
        <FounderVideo />
        <VisionBand />
        <OfferBlock />
        <FaqSection />
        <ProcessSection />
        <FinalCta />
      </div>

      {/* Mobile sticky bar */}
      <div className="sticky-mobile-cta">
        <CtaButton label="Write My Letter — $17" trackId="sticky-mobile" />
      </div>
    </main>
  );
}