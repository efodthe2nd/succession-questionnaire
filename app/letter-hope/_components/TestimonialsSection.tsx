import Image from "next/image";
import { fbPosts } from "./data";

const reactionIcons = [
  { label: "Like", path: "M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" },
  { label: "Comment", path: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
  { label: "Share", path: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" },
];

function PostHeader({ name, time, avatar }: { name: string; time: string; avatar: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
          <Image src={avatar} alt={name} width={40} height={40} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#1a1a1a", fontSize: "14px", fontWeight: 700, marginBottom: "1px" }}>{name}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "12px" }}>{time}</p>
            <svg width="12" height="12" fill="#8a7f78" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <svg width="18" height="18" fill="#8a7f78" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
        <svg width="16" height="16" fill="none" stroke="#8a7f78" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
      </div>
    </div>
  );
}

function ReactionBar({ likes }: { likes?: string }) {
  return (
    <div style={{ borderTop: "1px solid #f0ebe4", paddingTop: "10px", display: "flex", gap: "20px" }}>
      {reactionIcons.map(({ label, path }) => {
        const isLike = label === "Like";
        const showCount = isLike && likes;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="16" height="16" fill="none" stroke="#8a7f78" strokeWidth="1.6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={path} />
            </svg>
            <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#8a7f78", fontSize: "13px" }}>
              {showCount ? likes : label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function TestimonialsSection() {
  const [first, ...rest] = fbPosts;

  return (
    <div className="fade-2" style={{ marginBottom: "32px" }}>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#B5A692", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "16px", textAlign: "center" }}>
        From families who found letters, and those who didn&apos;t
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* Post 1 — with image */}
        <div style={{ background: "#fff", border: "1px solid #e8e4de", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "14px 16px 12px" }}>
            <PostHeader name={first.name} time={first.time} avatar={first.avatar} />
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#1a1a1a", fontSize: "14px", lineHeight: 1.65 }}>{first.text}</p>
          </div>
          <Image src={first.imageUrl!} alt="handwritten letter" width={560} height={220} style={{ width: "100%", height: "220px", objectFit: "cover", filter: "blur(2px)", display: "block" }} />
          <div style={{ padding: "10px 16px" }}>
            <ReactionBar likes={first.likes} />
          </div>
        </div>

        {/* Posts 2–4 */}
        {rest.map((post, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e8e4de", borderRadius: "12px", padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <PostHeader name={post.name} time={post.time} avatar={post.avatar} />
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#1a1a1a", fontSize: "14px", lineHeight: 1.65, marginBottom: "12px" }}>{post.text}</p>
            <ReactionBar likes={post.likes} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: "12px", padding: "22px 24px", background: "#1a1a1a", borderRadius: "14px" }}>
        <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#f0ece6", fontSize: "19px", lineHeight: 1.65, fontStyle: "italic" }}>
          The letter they&apos;ll search for after you&apos;re gone.{" "}
          <span style={{ color: "#B5A692" }}>You can write it today.</span>
        </p>
      </div>
    </div>
  );
}