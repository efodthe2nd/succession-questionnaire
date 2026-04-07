import React from "react";

export default function StatsBar() {
  return (
    <div className="fade-4" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", marginBottom: "40px", padding: "20px", background: "#fff", border: "1px solid #e8e4de", borderRadius: "14px" }}>
      {[["2,800+", "families served"], ["One sitting", "start to finish"], ["100%", "private"]].map(([num, label], i) => (
        <React.Fragment key={label}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1a1a", fontWeight: 600, fontSize: "20px", lineHeight: 1 }}>{num}</p>
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "11px", marginTop: "4px", letterSpacing: "0.04em" }}>{label}</p>
          </div>
          {i < 2 && <div style={{ width: "1px", height: "24px", background: "#d4c8bb" }} />}
        </React.Fragment>
      ))}
    </div>
  );
}