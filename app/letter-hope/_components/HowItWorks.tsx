export default function HowItWorks() {
  return (
    <div className="fade-4" style={{ marginBottom: "40px" }}>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#B5A692", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "16px", textAlign: "center" }}>
        How it works
      </p>
      <div style={{ background: "#fff", border: "1px solid #e8e4de", borderRadius: "14px", overflow: "hidden" }}>
        {[
          ["01", "We ask. You answer.", "Guided questions draw out your faith, your stories, your love — in your own words, at your own pace. Most answers are multiple choice. Some you can speak aloud."],
          ["02", "A person writes it for you.", "Not AI. Not a template. A real member of our team reads your answers and shapes them into a finished letter that sounds exactly like you."],
          ["03", "Read it. Then share it.", "You see the finished letter before anyone else. Share it now while you're here to witness what it means — or schedule it to deliver on a date you choose."],
        ].map(([num, title, desc], i) => (
          <div key={num} style={{ display: "flex", gap: "16px", padding: "18px 20px", borderBottom: i < 2 ? "1px solid #e8e4de" : "none" }}>
            <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#B5A692", fontSize: "18px", fontWeight: 500, flexShrink: 0, marginTop: "2px" }}>{num}</span>
            <div>
              <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#1a1a1a", fontSize: "14px", fontWeight: 600, marginBottom: "3px" }}>{title}</p>
              <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "13px", lineHeight: 1.6 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}