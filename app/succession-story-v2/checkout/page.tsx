"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const fetchClientSecret = useCallback(async () => {
    const response = await fetch("/api/create-checkout-session-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.clientSecret;
  }, [email]);

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}

function CheckoutLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", gap: "16px" }}>
      <div style={{ position: "relative", width: "36px", height: "36px" }}>
        <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(181,166,146,0.15)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 0, border: "2px solid transparent", borderTopColor: "#B5A692", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "18px", color: "#1a1a1a", fontStyle: "italic", marginBottom: "6px" }}>
          Securing your spot...
        </p>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "#8a7f78" }}>
          One moment — preparing the secure gateway.
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f9f6f1", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
          padding: 0 16px 48px;
        }

        @media (min-width: 860px) {
          .checkout-grid {
            grid-template-columns: 1fr 1fr;
            max-width: 1060px;
            gap: 48px;
            padding: 0 32px 64px;
            align-items: start;
          }
        }

        .stripe-panel  { order: 1; }
        .summary-panel { order: 2; }

        @media (min-width: 860px) {
          .stripe-panel  { order: 2; }
          .summary-panel { order: 1; }
        }

        .affirmation-bar {
          background: #1a1a1a;
          padding: 20px 24px;
          text-align: center;
        }

        @media (min-width: 860px) {
          .affirmation-bar { display: none; }
        }

        .affirmation-desktop { display: none; }

        @media (min-width: 860px) {
          .affirmation-desktop { display: block; }
        }

        .what-happens-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #e8e4de;
        }
        .what-happens-item:last-child { border-bottom: none; }
      `}</style>

      <div style={{ width: "100%", height: "3px", background: "linear-gradient(90deg, #B5A692 0%, #d4c8bb 50%, #B5A692 100%)" }} />

      <header style={{ padding: "16px 24px", background: "#f9f6f1", borderBottom: "1px solid #e8e4de", position: "sticky", top: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", color: "#1a1a1a", fontSize: "17px", fontWeight: 500, letterSpacing: "0.04em" }}>
            Succession <span style={{ color: "#B5A692" }}>Story</span>
          </p>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="14" height="14" fill="none" stroke="#8a7f78" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span style={{ fontFamily: "DM Sans, sans-serif", color: "#8a7f78", fontSize: "12px" }}>Secure checkout</span>
        </div>
      </header>

      <div className="affirmation-bar">
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", color: "#f0ece6", fontSize: "20px", fontStyle: "italic", lineHeight: 1.4, marginBottom: "6px" }}>
          The weight of the "unsaid" ends here.
        </p>
        <p style={{ fontFamily: "DM Sans, sans-serif", color: "#B5A692", fontSize: "13px", letterSpacing: "0.02em" }}>
          Complete your order to begin your guided letter experience.
        </p>
      </div>

      <main style={{ flex: 1, paddingTop: "32px" }}>
        <div className="checkout-grid">

          <div className="summary-panel">
            <div className="affirmation-desktop" style={{ marginBottom: "28px" }}>
              <p style={{ fontFamily: "DM Sans, sans-serif", color: "#B5A692", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "10px" }}>
                Founding member access
              </p>
              <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", color: "#1a1a1a", fontSize: "clamp(28px, 3.5vw, 38px)", fontWeight: 500, lineHeight: 1.2, marginBottom: "14px" }}>
                Unlock your guided<br />
                <em style={{ color: "#B5A692" }}>Succession Story.</em>
              </h2>
              <p style={{ fontFamily: "DM Sans, sans-serif", color: "#5a5450", fontSize: "15px", lineHeight: 1.7, maxWidth: "400px" }}>
                Securing your spot allows us to assign a dedicated writer to your legacy letter. Immediately after payment, you'll gain access to the questionnaire that draws out your most important stories.
              </p>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e8e4de", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
              <p style={{ fontFamily: "DM Sans, sans-serif", color: "#B5A692", fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "16px" }}>
                Your next 30 minutes
              </p>
              {[
                ["01", "Access the Guided Questionnaire", "Unlock the system designed by Romy Frazier to draw out your faith, values, and vision."],
                ["02", "Share your story at your own pace", "Speak or type your answers. No writing skill needed. We capture your tone exactly."],
                ["03", "A human writer takes over", "Our team reads your words and crafts a permanent legacy letter that sounds like you."],
              ].map(([num, title, desc]) => (
                <div key={num} className="what-happens-item">
                  <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", color: "#B5A692", fontSize: "16px", fontWeight: 500, flexShrink: 0, marginTop: "2px" }}>{num}</span>
                  <div>
                    <p style={{ fontFamily: "DM Sans, sans-serif", color: "#1a1a1a", fontSize: "14px", fontWeight: 600, marginBottom: "3px" }}>{title}</p>
                    <p style={{ fontFamily: "DM Sans, sans-serif", color: "#8a7f78", fontSize: "13px", lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", border: "1px solid #e8e4de", borderRadius: "16px", padding: "20px 24px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "DM Sans, sans-serif", color: "#1a1a1a", fontSize: "15px", fontWeight: 600 }}>Founding Member Plan</p>
                <p style={{ fontFamily: "DM Sans, sans-serif", color: "#8a7f78", fontSize: "13px", marginTop: "2px" }}>One-time payment · Lifetime storage</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", justifyContent: "flex-end" }}>
                  <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", color: "#1a1a1a", fontSize: "28px", fontWeight: 600 }}>$167</p>
                  <p style={{ fontFamily: "DM Sans, sans-serif", color: "#b0a89e", fontSize: "14px", textDecoration: "line-through" }}>$247</p>
                </div>
                <span style={{ background: "#1a1a1a", color: "#B5A692", fontFamily: "DM Sans, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "4px" }}>
                  Limited Time
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px 20px", background: "#f9f6f1", border: "1px solid #e8e4de", borderRadius: "12px" }}>
              <svg width="18" height="18" fill="none" stroke="#B5A692" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: "2px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p style={{ fontFamily: "DM Sans, sans-serif", color: "#1a1a1a", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                  Our "Sounds Like You" Guarantee
                </p>
                <p style={{ fontFamily: "DM Sans, sans-serif", color: "#8a7f78", fontSize: "12px", lineHeight: 1.6 }}>
                  If your finished letter doesn&apos;t sound like your voice, or if you don&apos;t feel it truly honors your story, we offer a 100% refund. This isn't software—it's a human service.
                </p>
              </div>
            </div>

          </div>

          <div className="stripe-panel">
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8e4de", overflow: "hidden", position: "sticky", top: "80px" }}>
              <div style={{ background: "#1a1a1a", padding: "20px 24px" }}>
                <p style={{ fontFamily: "DM Sans, sans-serif", color: "#B5A692", fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "4px" }}>
                  Payment Detail
                </p>
                <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", color: "#f0ece6", fontSize: "20px", fontStyle: "italic" }}>
                  Start your letter today.
                </p>
              </div>
              <div style={{ padding: "8px" }}>
                <Suspense fallback={<CheckoutLoading />}>
                  <CheckoutContent />
                </Suspense>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e4de", padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "DM Sans, sans-serif", color: "#8a7f78", fontSize: "12px", marginBottom: "4px" }}>
          Bank-level security. Your stories are private and protected.
        </p>
        <p style={{ fontFamily: "DM Sans, sans-serif", color: "#b0a89e", fontSize: "11px" }}>
          © 2026 Succession Story. All rights reserved.
        </p>
      </footer>
    </div>
  );
}