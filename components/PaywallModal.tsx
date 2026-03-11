"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId?: string;
}

export default function PaywallModal({
  isOpen,
  onClose,
  submissionId,
}: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (userEmail) params.set("email", userEmail);
    window.location.href = `/succession-story-v2/checkout?${params.toString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl">
        <div className="w-full h-1 bg-[#B5A692]" />

        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#4a4a4a] hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <p className="text-[#B5A692] text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Your story is ready
          </p>

          <h2
            className="text-white text-3xl leading-tight mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            One step to unlock your letter.
          </h2>

          <p className="text-[#8a7f78] text-base leading-relaxed mb-8">
            You just did something most people never do — you sat down and said
            what matters. Your answers are saved. We&apos;ll turn them into a
            finished letter, written in your voice, ready to share with your
            family.
          </p>

          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold">
                Succession Story Letter
              </p>
              <p
                className="text-[#B5A692] text-xl font-bold"
                style={{ fontFamily: "Georgia, serif" }}
              >
                $97
              </p>
            </div>
            <ul className="space-y-2">
              {[
                "Professionally written legacy letter",
                "Delivered to your inbox within 24 hours",
                "One-time payment — no subscription",
                "100% satisfaction guarantee",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[#706860] text-sm"
                >
                  <span className="text-[#B5A692] shrink-0 mt-0.5">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-[#B5A692] hover:bg-[#a59682] disabled:opacity-50 disabled:cursor-not-allowed text-[#1a1a1a] font-bold text-lg rounded-xl transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-[#1a1a1a]/30 border-t-[#1a1a1a] rounded-full animate-spin" />
                Loading checkout...
              </span>
            ) : (
              "Get My Letter — $97 →"
            )}
          </button>

          <p className="text-[#4a4a4a] text-xs text-center mt-4">
            Your answers are saved. You can come back any time.
          </p>
        </div>
      </div>
    </div>
  );
}
