"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Auto-play video when it comes into view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVideoPlaying) {
          video.play().catch(() => {
            // Autoplay was prevented, user will need to click
          });
        }
      });
    }, observerOptions);

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [isVideoPlaying]);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 font-sans">
      {/* Header */}
      <header className="w-full py-4 px-4 md:px-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Link
            href="/succession-story-v2"
            className="text-xl font-serif font-semibold text-gray-900"
          >
            Succession Story
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4">
            Welcome to the Succession Story Family!
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your order is confirmed. Check your email for login details to start
            creating your legacy letter.
          </p>
        </div>

        {/* What Happens Next Video Section */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl md:text-3xl text-gray-900 text-center mb-6">
            What Happens Next?
          </h2>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-gray-900">
            <video
              ref={videoRef}
              loop
              playsInline
              controls
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            >
              <source src="/video_bottom.mp4" type="video/mp4" />
            </video>
            {!isVideoPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30"
                onClick={handlePlayClick}
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                  <svg
                    className="w-10 h-10 text-purple-600 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Founder Card Section */}
        <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Founder Image */}
            <div className="relative aspect-square md:aspect-auto">
              <Image
                src="/founder.jpg"
                alt="Romy Frazier, Esq. - Founder"
                fill
                className="object-cover"
              />
            </div>

            {/* Founder Note */}
            <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
              <h3 className="font-serif text-2xl md:text-3xl text-gray-900 mb-4">
                A Note from the Founder
              </h3>
              <p className="text-gray-600 leading-relaxed italic mb-6">
                &quot;Thank you for trusting us with something so meaningful. As a
                succession attorney, I&apos;ve seen firsthand how legal documents
                alone can leave families with questions and doubts. Your
                Succession Story will fill that gap — giving your loved ones the
                clarity and connection they deserve.
              </p>
              <p className="text-gray-600 leading-relaxed italic mb-6">
                I&apos;m honored to help you create something that will be treasured
                for generations.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold text-gray-900">Romy Frazier, Esq.</p>
                  <p className="text-sm text-gray-500">
                    Founder, Succession Story
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mt-12 bg-purple-50 rounded-2xl p-6 md:p-8">
          <h3 className="font-serif text-xl md:text-2xl text-gray-900 mb-6 text-center">
            Your Next Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Check Your Email</h4>
              <p className="text-sm text-gray-600">
                Look for your login credentials (check spam too!)
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Log In</h4>
              <p className="text-sm text-gray-600">
                Access your Succession Story dashboard
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Start Writing</h4>
              <p className="text-sm text-gray-600">
                Complete the guided questionnaire
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              Go to Login
            </Link>
          </div>
        </section>

        {/* Support Section */}
        <section className="mt-12 text-center">
          <p className="text-gray-600">
            Questions? We&apos;re here to help.
          </p>
          <a
            href="mailto:support@successionstory.com"
            className="text-purple-600 font-semibold hover:underline"
          >
            support@successionstory.com
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white/70 py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-xl font-serif text-white mb-4">Succession Story</h3>
          <p className="text-sm text-white/50 max-w-2xl mx-auto italic">
            Succession Story does not provide legal advice, does not create or
            modify any estate plan, and does not affect or override any will,
            trust, or other legal documents.
          </p>
          <p className="text-xs text-white/40 mt-4">
            © 2026 Succession Story. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
