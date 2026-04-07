import ProcessItem from "./ProcessItem";
import { processItems } from "./data";

export default function ProcessSection() {
  return (
    <div style={{ marginTop: "48px" }}>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#B5A692", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "10px", textAlign: "center" }}>
        About the process
      </p>
      <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1a1a", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 500, lineHeight: 1.2, textAlign: "center", marginBottom: "24px" }}>
        Simple, guided, and entirely yours
      </h2>
      <div style={{ background: "#fff", border: "1px solid #e8e4de", borderRadius: "16px", padding: "0 20px" }}>
        {processItems.map((item, i, arr) => (
          <ProcessItem key={i} item={item} isLast={i === arr.length - 1} />
        ))}
      </div>
    </div>
  );
}