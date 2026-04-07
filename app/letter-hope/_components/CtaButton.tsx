"use client";
// import { trackEvent } from "./trackEvent";

export default function CtaButton({
  label = "Write My Letter — $167",
  trackId = "cta",
}: {
  label?: string;
  trackId?: string;
}) {
  const handleClick = () => {
    // trackEvent("cta_click", { location: trackId });
    // if (typeof window !== "undefined" && (window as any).fbq) {
    //   (window as any).fbq("track", "InitiateCheckout");
    // }
    window.location.href = "/succession-story-v2/checkout";
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: "100%", padding: "17px", background: "#1a1a1a", color: "#B5A692",
        fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 600, fontSize: "16px",
        border: "none", borderRadius: "10px", cursor: "pointer", letterSpacing: "0.02em",
        transition: "background 0.2s, color 0.2s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#B5A692"; (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1a1a1a"; (e.currentTarget as HTMLButtonElement).style.color = "#B5A692"; }}
    >
      {label}
    </button>
  );
}