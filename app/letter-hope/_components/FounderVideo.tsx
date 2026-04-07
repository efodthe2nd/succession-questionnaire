import Image from "next/image";
import YouTubeFacade from "./YouTubeFacade";
import { YOUTUBE_VIDEO_ID } from "./data";

export default function FounderVideo() {
  return (
    <div className="fade-4" style={{ marginBottom: "40px" }}>
      <YouTubeFacade videoId={YOUTUBE_VIDEO_ID} />
      <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", background: "#fff", border: "1px solid #e8e4de", borderRadius: "12px", marginTop: "16px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e8e4de", flexShrink: 0, overflow: "hidden" }}>
          <Image src="/founder.jpg" alt="Romy Frazier" width={48} height={48} style={{ borderRadius: "50%", objectFit: "cover" }} />
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#1a1a1a", fontSize: "13px", fontWeight: 600, marginBottom: "3px" }}>Romy Frazier, Esq.</p>
          <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "12px", lineHeight: 1.55 }}>
            I'm a succession attorney. After years watching families search for words that were never written, I built the tool I wished had existed.
          </p>
        </div>
      </div>
    </div>
  );
}