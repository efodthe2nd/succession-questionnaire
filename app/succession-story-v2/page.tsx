"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const COUNTDOWN_TARGET = new Date("2026-02-28T23:59:59").getTime();

function useCountdown(targetTimestamp: number) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calculate = () => {
      const diff = targetTimestamp - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetTimestamp]);
  return timeLeft;
}

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200">
      <button onClick={onToggle} className="w-full py-5 px-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 text-base md:text-lg pr-4">{question}</span>
        <span className="text-purple-600 text-2xl flex-shrink-0">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="px-4 pb-5 text-gray-600 leading-relaxed">{answer}</div>}
    </div>
  );
}

function ValueItem({ title, description, value, isOpen, onToggle }: { title: string; description: string; value: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden bg-white">
      <button onClick={onToggle} className="w-full py-4 px-5 flex justify-between items-center text-left hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-purple-600 text-xl">{isOpen ? "−" : "+"}</span>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        <span className="text-purple-600 font-semibold">{value}</span>
      </button>
      {isOpen && <div className="px-5 pb-4 pl-12 text-gray-600 leading-relaxed">{description}</div>}
    </div>
  );
}

function LeadCaptureForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Save lead to Supabase before redirecting
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "succession-story-v2" }),
      });
    } catch (error) {
      console.error("Failed to save lead:", error);
    }
    window.location.href = `/succession-story-v2/checkout?email=${encodeURIComponent(email)}`;
  };
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-3">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address..." required className="w-full px-5 py-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-gray-800 text-base placeholder:text-gray-400" />
        <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg px-8 py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-purple-300/50 disabled:opacity-70">
          {isSubmitting ? "Please wait..." : "Get Instant Access — Just $97"}
        </button>
      </div>
      <p className="text-center text-sm text-gray-500 mt-3">🔒 Your information is secure. We never spam.</p>
    </form>
  );
}

function ExitIntentPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-intent-popup" }),
      });
    } catch (error) {
      console.error("Failed to save lead:", error);
    }
    window.location.href = `/succession-story-v2/checkout?email=${encodeURIComponent(email)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress bar */}
        <div className="relative h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-t-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-purple-700/30" />
          <span className="relative text-white font-semibold text-sm">Step 1 of 2</span>
        </div>

        <div className="p-6 md:p-8">
          {/* Headline */}
          <h2 className="font-serif text-2xl md:text-3xl text-gray-900 text-center mb-2">
            Wait! Before You Go...
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Get your legacy letter for just <span className="font-bold text-purple-600">$97</span> (82% off)
          </p>

          {/* Product mockup */}
          <div className="relative mb-6">
            <div className="flex items-center justify-center gap-4">
              <div className="relative w-32 md:w-40">
                <Image
                  src="/succession_letter.png"
                  alt="Succession Story"
                  width={160}
                  height={200}
                  className="w-full h-auto drop-shadow-lg"
                />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm md:text-base">Includes:</p>
                <ul className="text-xs md:text-sm text-gray-600 space-y-1 mt-2">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Your legacy letter
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Handwritten font
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Family templates
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Cloud backup
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="exit-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="exit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg py-4 rounded-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-70"
            >
              {isSubmitting ? "Please wait..." : "Yes! I Want My Legacy Letter →"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            🔒 Secure checkout. 30-day money-back guarantee.
          </p>

          <button
            onClick={onClose}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4 py-2"
          >
            No thanks, I&apos;ll leave my words unsaid
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative order-1 md:order-2">
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
        <video
          ref={videoRef}
          loop
          playsInline
          controls={isPlaying}
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        {!isPlaying && (
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
              <svg className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        )}
      </div>
      <p className="text-center text-sm text-gray-500 mt-3">▶ Watch: How It Works in 2 Minutes</p>
      {/* Top right mock - Legacy Letter */}
      <div className="absolute -top-4 -right-4 md:-right-8 w-24 md:w-32 h-auto transform rotate-6 shadow-lg rounded-lg overflow-hidden border-2 border-white hidden md:block">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 aspect-[3/4]">
          <div className="w-full h-1 bg-gray-300 rounded mb-2"></div>
          <div className="w-3/4 h-1 bg-gray-300 rounded mb-2"></div>
          <div className="w-full h-1 bg-gray-300 rounded mb-2"></div>
          <div className="w-2/3 h-1 bg-gray-300 rounded"></div>
          <p className="text-[8px] text-gray-400 mt-4 italic">Your Legacy Letter</p>
        </div>
      </div>
      {/* Bottom left mock - Succession Letter Image */}
      <div className="absolute -bottom-4 -left-4 md:-left-8 w-20 md:w-28 transform -rotate-6 shadow-lg rounded-lg overflow-hidden border-2 border-white hidden md:block">
        <Image
          src="/succession_letter.png"
          alt="Succession Letter PDF"
          width={112}
          height={150}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

export default function SuccessionStoryV2Page() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [openValue, setOpenValue] = useState<number | null>(0);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const timeLeft = useCountdown(COUNTDOWN_TARGET);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from the top of the viewport
      if (e.clientY <= 0 && !hasShownPopup) {
        setShowExitPopup(true);
        setHasShownPopup(true);
      }
    };

    // Also detect when user tries to close tab or navigate away (mobile-friendly)
    const handleBeforeUnload = () => {
      if (!hasShownPopup) {
        setShowExitPopup(true);
        setHasShownPopup(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    // Delay adding the listener to avoid triggering immediately
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000); // Wait 5 seconds before enabling exit intent

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShownPopup]);

  const scrollToForm = () => {
    const form = document.getElementById("lead-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      // Focus the email input after scrolling
      setTimeout(() => {
        const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
        if (emailInput) emailInput.focus();
      }, 500);
    }
  };

  const faqs = [
    { question: "Is this a legal document?", answer: "No. Succession Story is a personal letter to accompany your legal estate plan — not replace it. It has no legal effect. Think of it as the heart behind the paperwork." },
    { question: "I'm not a good writer. Can I really do this?", answer: "Absolutely. You don't write anything — we do. You just answer simple questions, choose from curated options, and share short reflections. Our system transforms your answers into a polished letter that sounds like you." },
    { question: "How long does it take?", answer: "Most people complete their Succession Story in 20-30 minutes. Some spend longer because they want to reflect more deeply. There's no rush — you can save your progress and return anytime." },
    { question: "What if I want to update it later?", answer: "Life changes. So can your letter. Your Secure Cloud Backup means you can access and update your Succession Story anytime." },
    { question: "Is my information private?", answer: "Completely. We use bank-level encryption. Your responses and your letter are never shared with anyone. This is your story — it stays yours." },
    { question: "I don't have children. Is this still for me?", answer: "Yes. Legacy isn't limited to parents. If you have a spouse, siblings, nieces, nephews, godchildren, close friends, or anyone whose life you've touched — they will treasure hearing from you." },
  ];

  const valueItems = [
    { title: "The Succession Story System", description: "Your complete legacy letter, written in your voice, ready in 30 minutes.", value: "Value: $297" },
    { title: "Handwritten Font Upgrade", description: "Your letter rendered in elegant handwriting, not cold typed text.", value: "Value: $47" },
    { title: '"Words That Last" Reflection Guide', description: "50 additional prompts to help you go deeper.", value: "Value: $47" },
    { title: "Family Letter Templates", description: "Separate templates for spouse, children, and grandchildren.", value: "Value: $97" },
    { title: "Secure Cloud Backup", description: "Your letter stored safely in our encrypted vault.", value: "Value: $27" },
    { title: 'BONUS: "The Conversation Starter" Guide', description: "How to tell your family you've written this letter.", value: "Value: $37" },
  ];

  const avatars = [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Exit Intent Popup */}
      <ExitIntentPopup isOpen={showExitPopup} onClose={() => setShowExitPopup(false)} />

      {/* Header */}
      <header className="w-full py-3 px-4 md:py-4 md:px-8 flex justify-between items-center bg-white border-b border-gray-100 sticky top-0 z-50">
        <Link href="/" className="text-lg md:text-xl font-serif font-semibold text-gray-900">Succession Story</Link>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-sm text-gray-600">Need Help?</span>
          <a href="mailto:support@successionstory.com" className="hidden md:inline text-purple-600 font-semibold text-sm hover:underline">Email Us</a>
          <span className="hidden md:inline text-gray-300">|</span>
          <a href="tel:+1234567890" className="text-gray-700 font-medium text-sm hover:text-purple-600">+1 (234) 567-890</a>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-[90vh]">
          <div className="absolute left-0 top-0 w-[500px] h-[600px] opacity-60 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.1) 40%, transparent 70%)" }} />
          <div className="absolute right-0 bottom-0 w-[400px] h-[500px] opacity-40 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%)" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-16 md:pt-12 md:pb-24">
            {/* Social Proof Bar */}
            <div className="flex flex-col items-center justify-center mb-10 md:mb-14">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-3">
                  {avatars.map((avatar, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-0.5 ml-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-purple-700 font-medium text-sm md:text-base">Trusted by <span className="font-bold">2,847+ Families</span> Who&apos;ve Secured Their Legacy</p>
            </div>

            {/* Main Hero Content */}
            <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
              <p className="text-purple-600 font-semibold text-sm md:text-base uppercase tracking-wider mb-4">For Parents & Grandparents Who Want to Be Remembered</p>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight text-gray-900 mb-6">
                Write The Letter Your Family Will <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Read For Generations</span>
                <br /><span className="text-2xl md:text-4xl lg:text-5xl">(In Just 30 Minutes)</span>
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Your will explains <em>what</em> happens to your assets. But who explains <em>why</em> you made those choices? Who tells your grandchildren the stories you never got to share?
              </p>
            </div>

            {/* Price Anchor Box */}
            <div className="flex justify-center mb-10">
              <div className="bg-white border-2 border-dashed border-purple-300 rounded-2xl px-8 py-6 shadow-lg max-w-lg text-center">
                <p className="text-gray-700 text-base md:text-lg mb-2">Estate attorneys charge <span className="font-bold">$500+</span> for legacy letters.<br />Get yours today for:</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-gray-400 line-through text-2xl">$197</span>
                  <span className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">$97</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">One-time payment • Lifetime access</p>
              </div>
            </div>

            {/* Two Column: Form + Mockup */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
              <div id="lead-form" className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-purple-100 order-2 md:order-1 scroll-mt-24">
                <h3 className="font-serif text-xl md:text-2xl text-gray-900 mb-2 text-center">Get Instant Access</h3>
                <p className="text-gray-600 text-sm mb-6 text-center">Complete your legacy letter today — we&apos;ll write it for you.</p>
                <LeadCaptureForm />
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <span>30-Day Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span>Bank-Level Security</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Done in 30 Min</span>
                  </div>
                </div>
              </div>

              <HeroVideo />
            </div>

            <div className="mt-16 text-center">
              <p className="text-gray-500 text-sm mb-4">Scroll to see what&apos;s included</p>
              <div className="animate-bounce">
                <svg className="w-6 h-6 mx-auto text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900">The Words We Mean to Say Often <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Remain Unsaid Forever</span></h2>
            <div className="mt-8 text-gray-600 text-base md:text-lg leading-relaxed space-y-6 text-left">
              <p>You&apos;ve done everything right. The will is signed. The trust is funded. Your attorney says you&apos;re covered.</p>
              <p><strong>But something still feels incomplete.</strong></p>
              <p>Because legal documents explain what happens to your assets. They don&apos;t explain <em>why</em> you made the choices you did.</p>
              <ul className="space-y-2 text-gray-500 italic pl-4">
                <li>&quot;Why did Mom leave the house to Sarah instead of splitting it?&quot;</li>
                <li>&quot;What did Dad really want us to do with the business?&quot;</li>
                <li>&quot;Did they know how much they meant to me?&quot;</li>
              </ul>
              <p className="font-semibold text-gray-800 pt-4">That silence leaves room for hurt, confusion, and assumptions — even in loving families.</p>
              <p className="text-purple-600 font-semibold">Don&apos;t let that be your legacy.</p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16 md:py-24 px-4 bg-purple-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900">Introducing The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Succession Story</span> System</h2>
            <p className="mt-4 text-gray-600 text-lg">The simple 3-step process that writes your legacy letter for you — in your voice, in under 30 minutes.</p>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Answer Thoughtful Questions", time: "10-15 minutes", desc: "Our guided prompts walk you through your values, your memories, and the intentions behind your decisions." },
                { step: "2", title: "We Write It For You", time: "instant", desc: "Our system transforms your answers into a beautifully written letter that sounds like you." },
                { step: "3", title: "Download Your Legacy", time: "forever", desc: "Receive a polished, print-ready PDF to store with your estate documents." },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-left">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">{item.step}</div>
                  <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                  <p className="text-purple-600 text-sm mt-1">({item.time})</p>
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 text-center mb-4">
              Families Are Finding Peace with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Succession Story</span>
            </h2>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "I thought I had everything in order. But after completing my Succession Story, my daughter called me in tears. She said she finally understood why I worked so many late nights when she was young — and that she forgave me. That conversation was worth more than any inheritance I could leave her.",
                  name: "Margaret T.",
                  detail: "67, Retired Business Owner",
                },
                {
                  quote: "My brothers and I fought for two years after Dad passed — all because we didn't understand why he left the business to just one of us. If he had written something like this, we would have known it wasn't favoritism. It was protection. I completed my Succession Story so my kids never have to guess.",
                  name: "Robert K.",
                  detail: "54, Business Owner with 3 Children",
                },
                {
                  quote: "I don't have children, but I have a niece and nephew I've helped raise. Succession Story helped me tell them things I've never been able to say out loud — how proud I am of them, what I hope they'll remember about our time together. It took me 25 minutes and I cried the whole time. In a good way.",
                  name: "Linda S.",
                  detail: '59, The "Favorite Aunt"',
                },
              ].map((testimonial, i) => (
                <div key={i} className="bg-purple-50 rounded-2xl p-6 flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic flex-grow">&quot;{testimonial.quote}&quot;</p>
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="py-16 md:py-24 px-4 bg-purple-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 text-center">Everything You Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Today</span></h2>
            <div className="mt-10">
              {valueItems.map((item, i) => (
                <ValueItem key={i} title={item.title} description={item.description} value={item.value} isOpen={openValue === i} onToggle={() => setOpenValue(openValue === i ? null : i)} />
              ))}
            </div>
            <div className="mt-8 bg-purple-50 rounded-xl p-6 text-center border-2 border-purple-200">
              <p className="text-gray-600">Total Value:</p>
              <p className="text-3xl font-bold text-gray-900">$552</p>
            </div>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-purple-600 to-pink-500">
          <div className="max-w-2xl mx-auto text-center text-white">
            <p className="text-purple-200 uppercase tracking-wider text-sm font-semibold">For a Limited Time</p>
            <div className="mt-4">
              <span className="text-white/60 line-through text-2xl">$197</span>
              <span className="text-6xl md:text-7xl font-bold ml-4">$97</span>
            </div>
            <p className="text-purple-200 mt-2">one-time payment</p>
            <p className="mt-6 text-white/90">That&apos;s 82% off the total value of $552</p>
            <button onClick={scrollToForm} className="mt-8 inline-block bg-white text-purple-600 font-semibold text-lg px-10 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-xl cursor-pointer">
              Create My Succession Story Now — $97
            </button>
          </div>
        </section>

        {/* Guarantee */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900">The &quot;Peace of Mind&quot; Guarantee</h2>
            <p className="mt-6 text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">If you don&apos;t feel a genuine sense of peace and completion — <strong>email us within 30 days for a full refund.</strong></p>
            <p className="mt-4 text-purple-600 font-semibold">We take on the risk so you don&apos;t have to.</p>
          </div>
        </section>

        {/* Urgency */}
        <section className="py-16 md:py-24 px-4 bg-purple-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900">Founder Pricing Ends <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">February 28, 2026</span></h2>
            <div className="mt-10 grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto">
              {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hours" },
                { value: timeLeft.minutes, label: "Minutes" },
                { value: timeLeft.seconds, label: "Seconds" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                  <p className="text-3xl md:text-4xl font-bold text-purple-600">{item.value.toString().padStart(2, "0")}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 inline-block">
              <p className="text-purple-800 font-semibold">73 of 100 Founding Member spots remaining</p>
            </div>
            <div className="mt-8">
              <button onClick={scrollToForm} className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-purple-200 cursor-pointer">Claim Your Founder Spot — $97</button>
            </div>
          </div>
        </section>

        {/* Founder's Note Section */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 text-center mb-12">
              A Note from <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Romy Frazier, Esq.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
              {/* Founder Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/founder.jpg"
                    alt="Romy Frazier, Esq."
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                  {/* Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-purple-600 text-white rounded-lg py-3 px-4 text-center">
                    <p className="font-bold text-lg">15+ Years</p>
                    <p className="text-sm text-purple-200">Succession Attorney</p>
                  </div>
                </div>
              </div>

              {/* Quote Content */}
              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200">
                <p className="text-gray-700 text-base md:text-lg leading-relaxed italic mb-6">
                  &quot;In 15 years as a succession attorney for high-net-worth families, I&apos;ve heard the same heartbreaking sentence hundreds of times:&quot;
                </p>
                <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 text-center my-6">
                  &quot;I wish I could ask them what they meant.&quot;
                </p>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    I&apos;ve heard it from children trying to understand a parent&apos;s decisions. From spouses seeking clarity. From entire families torn apart by assumptions that a single letter could have prevented.
                  </p>
                  <p>
                    A will explains distribution. A trust outlines structure. But neither can speak for the person who is gone.
                  </p>
                  <p>
                    I created Succession Story because I&apos;ve seen what happens when the &quot;why&quot; is never shared. And I&apos;ve seen how a simple letter — written while there&apos;s still time — can hold a family together for generations.
                  </p>
                  <p>
                    I&apos;m not just a lawyer. I&apos;m a daughter, a wife, and a mother. In each of these roles, I&apos;ve learned that wealth doesn&apos;t hold a family together.
                  </p>
                  <p className="font-semibold text-gray-800">
                    Clarity does. Connection does. The &quot;why&quot; does.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-purple-600 to-pink-500">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              Don&apos;t Wait Until It&apos;s Too Late
            </h2>
            <div className="space-y-4 text-white/90 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              <p>There are conversations we imagine we&apos;ll have someday.</p>
              <p>Messages we think we&apos;ll write when life slows down.</p>
              <p>Things we want our family to know — assuming there will always be time.</p>
              <p className="font-semibold text-white pt-4">But life doesn&apos;t follow our plans.</p>
              <p>The moments we intend to create slip quietly into the background. And the words we mean to say remain unsaid forever.</p>
            </div>
            <div className="mt-10 space-y-4">
              <p className="text-xl md:text-2xl font-semibold">You have 30 minutes right now.</p>
              <p className="text-purple-200">Your family deserves the clarity. You deserve the peace.</p>
            </div>
            <button onClick={scrollToForm} className="mt-8 inline-block bg-white text-purple-600 font-bold text-lg px-12 py-5 rounded-full hover:bg-gray-100 transition-colors shadow-xl cursor-pointer">
              Create My Succession Story Now
            </button>
            <p className="mt-4 text-purple-200 text-sm">30-day money-back guarantee. Complete your letter in 30 minutes or less.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 text-center">Questions You Might Be Asking</h2>
            <div className="mt-10 bg-gray-50 rounded-2xl overflow-hidden">
              {faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} isOpen={openFAQ === i} onToggle={() => setOpenFAQ(openFAQ === i ? null : i)} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <button onClick={scrollToForm} className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-purple-200 cursor-pointer">Start My Succession Story</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white/70 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8"><h3 className="text-xl font-serif text-white">Succession Story</h3></div>
          <div className="flex justify-center gap-6 mb-8 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
          <div className="text-center text-sm max-w-3xl mx-auto border-t border-white/10 pt-8">
            <p className="italic text-white/50">Succession Story does not provide legal advice, does not create or modify any estate plan, and does not affect or override any will, trust, or other legal documents.</p>
          </div>
          <div className="text-center mt-8 text-xs text-white/40"><p>© 2026 Succession Story. All rights reserved.</p></div>
        </div>
      </footer>
    </div>
  );
}