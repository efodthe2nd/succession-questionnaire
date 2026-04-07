"use client";
import { useState } from "react";
import Image from "next/image";

export default function YouTubeFacade({ videoId }: { videoId: string }) {
  const [clicked, setClicked] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (clicked) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title="Romy Frazier — Succession Story"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: "100%", aspectRatio: "16/9", border: "none", borderRadius: "16px", display: "block" }}
      />
    );
  }

  return (
    <div
      onClick={() => { setClicked(true); }}
      style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#1a1a1a", borderRadius: "16px", overflow: "hidden", cursor: "pointer" }}
    >
      <Image src={thumbnailUrl} alt="Play video" width={560} height={315} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg" style={{ width: "72px", height: "72px", filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.4))" }}>
          <path d="M66.5 7.7c-.8-2.9-2.9-5.1-5.8-5.9C55.8 0 34 0 34 0S12.2 0 7.3 1.8C4.4 2.6 2.3 4.8 1.5 7.7 0 12.7 0 24 0 24s0 11.3 1.5 16.3c.8 2.9 2.9 5.1 5.8 5.9C12.2 48 34 48 34 48s21.8 0 26.7-1.8c2.9-.8 5-3 5.8-5.9C68 35.3 68 24 68 24s0-11.3-1.5-16.3z" fill="#ff0000" />
          <path d="M45 24L27 14v20" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}