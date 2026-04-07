import CtaButton from "./CtaButton";
import TrustLine from "./TrustLine";
import { deliverables } from "./data";

export default function OfferBlock() {
  return (
    <div className="fade-5" style={{ marginBottom: "48px" }}>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#B5A692", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "10px", textAlign: "center" }}>
        Founding member pricing
      </p>
      <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1a1a", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 500, lineHeight: 1.2, textAlign: "center", marginBottom: "6px" }}>
        Write your letter today.
      </h2>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "13px", textAlign: "center", marginBottom: "24px" }}>
        This founding member price is available for a limited number of families this month.
      </p>
      <div className="offer-block">
        <div style={{ padding: "24px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "4px" }}>
            <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1a1a", fontSize: "42px", fontWeight: 500, lineHeight: 1 }}>$167</p>
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#b0a89e", fontSize: "16px", textDecoration: "line-through" }}>$247</p>
            <span style={{ background: "#1a1a1a", color: "#B5A692", fontFamily: "var(--font-dm-sans), sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "4px" }}>Founding Member</span>
          </div>
          <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "12px", marginBottom: "20px" }}>One time · No subscription · No upsell</p>
          <div style={{ marginBottom: "20px" }}>
            {deliverables.map((item, i) => (
              <div key={i} className="deliverable-item">
                <span style={{ color: "#B5A692", fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "16px", flexShrink: 0, marginTop: "2px" }}>✦</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <CtaButton label="Write My Letter — $167" trackId="offer-block" />
          <TrustLine />
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "20px 24px", background: "#f9f6f1", marginTop: "24px", borderTop: "1px solid #e8e4de" }}>
          <svg width="20" height="20" fill="none" stroke="#B5A692" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: "2px" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#1a1a1a", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>30-day complete guarantee</p>
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "12px", lineHeight: 1.6 }}>
              If your letter doesn't sound like you, if it feels like a template or anything other than a document written specifically for you, you have 30 days to ask for a full refund. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}