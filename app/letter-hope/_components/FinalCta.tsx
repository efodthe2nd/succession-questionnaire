import CtaButton from "./CtaButton";
import TrustLine from "./TrustLine";

export default function FinalCta() {
  return (
    <div style={{ marginTop: "48px", textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1a1a", fontSize: "22px", fontStyle: "italic", marginBottom: "6px", lineHeight: 1.4 }}>
        The letter your family will carry with them forever.
      </p>
      <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#B5A692", fontSize: "20px", fontStyle: "italic", marginBottom: "20px" }}>
        Write it today.
      </p>
      <CtaButton label="Write My Letter — $17" trackId="final" />
      <TrustLine />
    </div>
  );
}