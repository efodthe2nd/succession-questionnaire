"use client";

import { useCallback, useEffect, useState } from "react";
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

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isLoading, setIsLoading] = useState(true);

  const fetchClientSecret = useCallback(async () => {
    const response = await fetch("/api/create-checkout-session-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();

    if (data.error) {
      console.error("[Checkout] Error:", data.error);
      throw new Error(data.error);
    }

    setIsLoading(false);
    return data.clientSecret;
  }, [email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 font-sans">
      {/* Header */}
      <header className="w-full py-4 px-4 md:px-8 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/succession-story-v2"
            className="text-xl font-serif font-semibold text-gray-900"
          >
            Succession Story
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left side - Order Summary */}
          <div className="order-2 md:order-1">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-purple-100">
              <h2 className="font-serif text-2xl text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Succession Story System
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Complete legacy letter package
                    </p>
                  </div>
                  <span className="text-gray-900 font-semibold">$97</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Your legacy letter, written in your voice</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Handwritten font upgrade ($47 value)</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>&quot;Words That Last&quot; Reflection Guide ($47 value)</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Family Letter Templates ($97 value)</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Secure Cloud Backup ($27 value)</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>BONUS: &quot;The Conversation Starter&quot; Guide ($37 value)</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Total Value:</span>
                  <span className="text-gray-400 line-through">$552</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">
                    Your Price Today:
                  </span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                    $97
                  </span>
                </div>
              </div>

              {/* Guarantee */}
              <div className="mt-6 bg-purple-50 rounded-xl p-4 flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-purple-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    30-Day Money-Back Guarantee
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    If you don&apos;t feel a genuine sense of peace and completion,
                    email us for a full refund.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Stripe Checkout */}
          <div className="order-1 md:order-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4">
                <h2 className="text-white font-semibold text-lg">
                  Complete Your Order
                </h2>
                <p className="text-white/80 text-sm">
                  Enter your payment details below
                </p>
              </div>
              <div className="p-1">
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{ fetchClientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            Your payment is secured with 256-bit SSL encryption.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © 2026 Succession Story. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
