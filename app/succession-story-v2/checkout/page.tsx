"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const fetchClientSecret = useCallback(async () => {
    const response = await fetch("/api/create-checkout-session-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.clientSecret;
  }, [email]);

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}

function CheckoutLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-2 border-[#B5A692]/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-[#B5A692] rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#f9f6f1] flex flex-col">
      <div className="w-full h-1 bg-[#B5A692]" />

      {/* Header */}
      <header className="w-full py-4 px-6 bg-[#f9f6f1] border-b border-[#e8e4de] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-[#1a1a1a] text-sm font-medium tracking-wide">
            Succession <span className="text-[#B5A692]">Story</span>
          </Link>
          <div className="flex items-center gap-2 text-[#8a7f78] text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-10 md:py-16 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* LEFT — Order Summary */}
          <div className="order-2 md:order-1">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#e8e4de]">
              <p className="text-[#B5A692] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Your Order
              </p>
              <h2 className="text-[#1a1a1a] text-2xl mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                Succession Story System
              </h2>

              <div className="border-b border-[#e8e4de] pb-5 mb-5">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[#1a1a1a] font-medium">Complete Legacy Letter Package</p>
                  <p className="text-[#1a1a1a] font-semibold">$97</p>
                </div>
                <p className="text-[#8a7f78] text-sm">One-time payment</p>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  'Your legacy letter, written in your voice',
                  'Handwritten font upgrade ($47 value)',
                  '"Words That Last" Reflection Guide ($47 value)',
                  'Family Letter Templates ($97 value)',
                  'Secure Cloud Backup ($27 value)',
                  'BONUS: "The Conversation Starter" Guide ($37 value)',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-[#4a4a4a] text-sm">
                    <span className="text-[#B5A692] shrink-0 mt-0.5">✦</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="border-t border-[#e8e4de] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8a7f78]">Total Value</span>
                  <span className="text-[#b0a89e] line-through">$552</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#1a1a1a] font-semibold">Your Price Today</span>
                  <span className="text-[#B5A692] text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>$97</span>
                </div>
              </div>

              {/* Guarantee */}
              <div className="mt-6 bg-[#f9f6f1] border border-[#e8e4de] rounded-xl p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-[#B5A692] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-[#1a1a1a] font-semibold text-sm mb-1">30-Day Money-Back Guarantee</p>
                  <p className="text-[#8a7f78] text-xs leading-relaxed">
                    If you don&apos;t feel a genuine sense of peace and completion, email us for a full refund.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Stripe Embedded Checkout */}
          <div className="order-1 md:order-2">
            <div className="bg-white rounded-2xl border border-[#e8e4de] overflow-hidden">
              <div className="bg-[#1a1a1a] px-6 py-5">
                <p className="text-[#B5A692] text-xs font-bold tracking-[0.2em] uppercase mb-1">
                  Final Step
                </p>
                <h2 className="text-white text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                  Complete your order
                </h2>
              </div>
              <div className="p-2">
                <Suspense fallback={<CheckoutLoading />}>
                  <CheckoutContent />
                </Suspense>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-[#e8e4de] py-6 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-1">
          <p className="text-[#8a7f78] text-sm">Your payment is secured with 256-bit SSL encryption.</p>
          <p className="text-[#b0a89e] text-xs">© 2026 Succession Story. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}