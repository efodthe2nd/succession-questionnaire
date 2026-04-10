import Image from "next/image";
import CtaButton from "./CtaButton";
import TrustLine from "./TrustLine";
import { letterSamples } from "./data";

export default function LetterSamples() {
  return (
    <div className="fade-3" style={{ marginBottom: "48px" }}>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#B5A692", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "10px", textAlign: "center" }}>
        What a legacy letter sounds like
      </p>
      <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1a1a", fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 500, lineHeight: 1.25, textAlign: "center", marginBottom: "6px" }}>
        Real letters. Real families.
      </h2>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "13px", textAlign: "center", marginBottom: "24px", lineHeight: 1.6 }}>
        Blurred to protect privacy. Every word is real.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {letterSamples.map((letter, i) => (
          <div key={i} className="letter-card">
            <Image src={letter.img} alt={letter.alt} width={560} height={180} loading="lazy" style={{ width: "100%", height: "180px", objectFit: "cover", filter: "blur(2px)", display: "block" }} />
            <div style={{ padding: "18px 20px" }}>
              <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#3a3530", fontSize: "17px", lineHeight: 1.7, fontStyle: "italic" }}>{letter.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "28px" }}>
        <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1a1a", fontSize: "20px", fontStyle: "italic", textAlign: "center", marginBottom: "20px", lineHeight: 1.45 }}>
          Your letter is already inside you.<br />
          <span style={{ color: "#B5A692" }}>We just help you get it out.</span>
        </p>
        <CtaButton label="Write My Letter — $17" trackId="after-samples" />
        <TrustLine />
      </div>
    </div>
  );
}