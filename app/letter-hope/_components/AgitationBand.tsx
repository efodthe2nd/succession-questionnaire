export default function AgitationBand() {
  return (
    <div className="fade-3 band-dark" style={{ borderRadius: "16px", marginBottom: "48px" }}>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#B5A692", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "14px" }}>
        The thing that keeps people up at night
      </p>
      <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#f0ece6", fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 500, lineHeight: 1.25, marginBottom: "18px" }}>
        You have things to say. <em style={{ color: "#B5A692" }}>You just haven't said them.</em>
      </p>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "rgba(240,236,230,0.75)", fontSize: "15px", lineHeight: 1.75, marginBottom: "14px" }}>
        Not the practical things. Not the will, the accounts, the passwords. Those are handled.
      </p>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "rgba(240,236,230,0.75)", fontSize: "15px", lineHeight: 1.75, marginBottom: "20px" }}>
        The other things. Your faith and what it carried you through. The story behind your miracle baby. What you actually see when you look at your child, not the version they see, the real version. The thing you hope your grandchildren will know about who you were before they knew you.
      </p>
      {[
        "They know you as a provider. Do they know you as a person?",
        "They know you love them. Do they know exactly what you see in them, specifically?",
        "They know what you built. Do they know why?",
        "Will your grandchildren know your name the way your children know it?",
      ].map((line, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
          <span style={{ color: "#B5A692", fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "16px", flexShrink: 0, marginTop: "2px" }}>—</span>
          <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "rgba(240,236,230,0.8)", fontSize: "14px", lineHeight: 1.6 }}>{line}</p>
        </div>
      ))}
    </div>
  );
}