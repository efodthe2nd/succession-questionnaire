export default function VisionBand() {
  return (
    <div className="fade-4 band-dark" style={{ borderRadius: "16px", marginBottom: "48px" }}>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#B5A692", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "14px" }}>
        What happens when you write it
      </p>
      <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#f0ece6", fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 500, lineHeight: 1.3, marginBottom: "20px" }}>
        Twenty years from now.
      </p>
      {[
        "Your daughter is sitting across from her financial advisor. She's not depleting the estate, she's growing it. Because she has a map. Because you wrote down the philosophy. Live off income, never principal. Reinvest before you reward yourself. Your words. In her hands. Being taught to your grandchildren as if they were family law.",
        "Your grandchildren give because of identity, not obligation. Because you told them: this is who we are. This is what we do with the privilege of having more than we need.",
        "Fifty years from now, your great-grandchildren know your name. They tell the story the way you told it — with your faith in it, your sacrifice in it, your voice in it. Because you wrote it down.",
      ].map((para, i) => (
        <p key={i} style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "rgba(240,236,230,0.75)", fontSize: "14px", lineHeight: 1.8, marginBottom: "14px" }}>{para}</p>
      ))}
      <div className="vision-quote">
        <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#f0ece6", fontSize: "20px", fontStyle: "italic", lineHeight: 1.5 }}>
          "History is written by people who write things down."
        </p>
        <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "rgba(240,236,230,0.4)", fontSize: "12px", marginTop: "8px" }}>
          The story of who you are leaves with you — unless you write it first.
        </p>
      </div>
    </div>
  );
}