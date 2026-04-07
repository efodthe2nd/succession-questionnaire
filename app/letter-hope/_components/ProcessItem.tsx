"use client";
import { useState } from "react";

export default function ProcessItem({ item, isLast }: { item: { q: string; a: string }; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid #e8e4de" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: "16px" }}
      >
        <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#1a1a1a", fontSize: "14px", fontWeight: 500, lineHeight: 1.5 }}>{item.q}</p>
        <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: "1.5px solid #B5A692", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#B5A692", fontSize: "16px", lineHeight: 1, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</div>
      </button>
      <div style={{ maxHeight: open ? "600px" : "0", opacity: open ? 1 : 0, overflow: "hidden", paddingBottom: open ? "16px" : "0", transition: "max-height 0.35s ease, opacity 0.3s ease, padding-bottom 0.3s ease" }}>
        <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#5a5450", fontSize: "14px", lineHeight: 1.75 }}>{item.a}</p>
      </div>
    </div>
  );
}