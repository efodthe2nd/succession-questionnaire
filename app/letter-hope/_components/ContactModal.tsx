"use client";
import { useState } from "react";

export default function ContactModal({ onClose }: { onClose: () => void }) {
  const [contactName, setContactName] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#f9f6f1", borderRadius: "20px 20px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: "600px", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}
      >
        <div style={{ width: "36px", height: "4px", background: "#d4c8bb", borderRadius: "2px", margin: "0 auto 24px" }} />
        {!sent ? (
          <>
            <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1a1a", fontSize: "22px", fontWeight: 500, marginBottom: "6px", lineHeight: 1.3 }}>Have a question?</p>
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "13px", marginBottom: "20px", lineHeight: 1.6 }}>Send us a message and we'll get back to you shortly.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" placeholder="Your name (optional)" value={contactName} onChange={(e) => setContactName(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #d4c8bb", background: "#fff", color: "#1a1a1a", borderRadius: "10px", fontSize: "15px", fontFamily: "var(--font-dm-sans), sans-serif", outline: "none" }} />
              <textarea placeholder="What would you like to know?" value={contactMsg} onChange={(e) => setContactMsg(e.target.value)} rows={4}
                style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #d4c8bb", background: "#fff", color: "#1a1a1a", borderRadius: "10px", fontSize: "15px", fontFamily: "var(--font-dm-sans), sans-serif", outline: "none", resize: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#fff", border: "1px solid #e8e4de", borderRadius: "10px" }}>
                <svg width="14" height="14" fill="none" stroke="#B5A692" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#5a5450", fontSize: "13px", flex: 1 }}>Or email us directly: <strong style={{ color: "#1a1a1a", userSelect: "all" }}>hello@successionstory.now</strong></p>
              </div>
              <button
                onClick={() => {
                  if (!contactMsg.trim()) return;
                  const subject = encodeURIComponent("Question about Succession Story");
                  const body = encodeURIComponent((contactName ? `Name: ${contactName}\n\n` : "") + `Message: ${contactMsg}`);
                  window.open(`https://mail.google.com/mail/?view=cm&to=hello@successionstory.now&su=${subject}&body=${body}`, "_blank");
                  setSent(true);
                }}
                disabled={!contactMsg.trim()}
                style={{ width: "100%", padding: "16px", background: contactMsg.trim() ? "#1a1a1a" : "#e8e4de", color: contactMsg.trim() ? "#B5A692" : "#b0a89e", fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 600, fontSize: "15px", border: "none", borderRadius: "10px", cursor: contactMsg.trim() ? "pointer" : "not-allowed", letterSpacing: "0.02em" }}
              >Send message</button>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif", color: "#b0a89e", fontSize: "13px", padding: "4px" }}>Cancel</button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="22" height="22" fill="none" stroke="#B5A692" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1a1a", fontSize: "22px", fontWeight: 500, marginBottom: "8px" }}>Message sent</p>
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>We'll get back to you shortly.</p>
            <button onClick={onClose} style={{ background: "#1a1a1a", color: "#B5A692", border: "none", padding: "14px 32px", borderRadius: "10px", cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 600, fontSize: "14px" }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}