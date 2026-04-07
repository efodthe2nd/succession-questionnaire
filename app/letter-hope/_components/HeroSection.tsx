import CtaButton from "./CtaButton";
import YouTubeFacade from "./YouTubeFacade";
import { YOUTUBE_VIDEO_ID } from "./data";

export default function HeroSection() {
  return (
    <div className="fade-1" style={{ textAlign: "center", padding: "28px 0 24px" }}>
      <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1a1a", fontSize: "clamp(28px, 7.5vw, 46px)", lineHeight: 1.15, fontWeight: 600, marginBottom: "18px" }}>
        The Most Important Letter<br />You'll Ever Write.<br />
        <span style={{ color: "#B5A692" }}>Finish in 30 Minutes.</span>
      </h1>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#5a5450", fontSize: "16px", lineHeight: 1.75, maxWidth: "480px", margin: "0 auto 28px" }}>
        Stop carrying the weight of the &ldquo;unsaid.&rdquo; Using our guided process, we turn your stories and values into a permanent legacy letter that sounds exactly like you, delivered to your family when it matters most.
      </p>
      <div style={{ marginBottom: "24px" }}>
        <YouTubeFacade videoId={YOUTUBE_VIDEO_ID} />
      </div>
      <div className="cta-pulse" style={{ borderRadius: "10px", marginBottom: "8px" }}>
        <CtaButton label="Write My Letter → $167" trackId="hero" />
      </div>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "13px", marginTop: "10px" }}>
        No writing skill needed.
      </p>
    </div>
  );
}