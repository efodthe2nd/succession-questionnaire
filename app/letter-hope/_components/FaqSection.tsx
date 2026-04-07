"use client";
import { useState } from "react";
import { faqs } from "./data";
// import { trackEvent } from "./trackEvent";

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <div className="fade-5">
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#B5A692", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "10px", textAlign: "center" }}>
        Questions and answers
      </p>
      <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1a1a", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 500, lineHeight: 1.2, textAlign: "center", marginBottom: "24px" }}>
        Everything you need to know
      </h2>
      <div style={{ background: "#fff", border: "1px solid #e8e4de", borderRadius: "16px", padding: "0 20px" }}>
        {faqs.map((faq, i) => (
          <div key={i} className="faq-item">
            <button className="faq-trigger" onClick={() => { setOpenFaq(openFaq === i ? null : i); }}>
              <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#1a1a1a", fontSize: "14px", fontWeight: 500, lineHeight: 1.5 }}>{faq.q}</p>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: "1.5px solid #B5A692", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#B5A692", fontSize: "16px", lineHeight: 1, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</div>
            </button>
            <div style={{ maxHeight: openFaq === i ? "400px" : "0", opacity: openFaq === i ? 1 : 0, overflow: "hidden", paddingBottom: openFaq === i ? "16px" : "0", transition: "max-height 0.35s ease, opacity 0.3s ease, padding-bottom 0.3s ease" }}>
              <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#5a5450", fontSize: "14px", lineHeight: 1.75 }}>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}