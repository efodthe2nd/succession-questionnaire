'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase';

/**
 * AuthCallbackHandler
 *
 * This component handles auth callbacks from Supabase magic links.
 * It detects when the app loads with recovery tokens in the URL hash
 * (e.g., #access_token=...&type=recovery) and redirects to /set-password.
 *
 * Place this component in the root layout to handle callbacks on any page.
 */
export default function AuthCallbackHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [error, setError] = useState<{ code: string; description: string } | null>(null);

  useEffect(() => {
    // Check URL hash for recovery tokens or errors
    const handleHashChange = async () => {
      // Only process on client side
      if (typeof window === 'undefined') return;

      const hash = window.location.hash;
      if (!hash) return;

      // Parse hash parameters
      const hashParams = new URLSearchParams(hash.substring(1));

      // Check for errors in the hash (e.g., expired link)
      const errorCode = hashParams.get('error_code');
      const errorDescription = hashParams.get('error_description');

      if (errorCode) {
        // Clear the hash from URL
        window.history.replaceState(null, '', pathname);

        // Show error state
        setError({
          code: errorCode,
          description: errorDescription?.replace(/\+/g, ' ') || 'An error occurred',
        });
        return;
      }

      // Check if this is a recovery flow
      if (hash.includes('type=recovery')) {
        // Supabase client will automatically process the hash and establish a session
        // We just need to wait for it and then redirect to set-password

        // Give Supabase a moment to process the tokens
        const { data: { session }, error } = await supabase.auth.getSession();

        if (session && !error) {
          // Clear the hash from the URL
          window.history.replaceState(null, '', pathname);

          // Redirect to set-password page
          router.push('/set-password');
        }
      }
    };

    // Run on mount
    handleHashChange();

    // Listen for auth state changes (backup in case hash processing is async)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Check if this is a PASSWORD_RECOVERY event
        if (event === 'PASSWORD_RECOVERY' && session) {
          // Clear hash and redirect to set-password
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', pathname);
          }
          router.push('/set-password');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  // Show error overlay if there's an auth error
  if (error) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/10 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-2xl font-heading font-bold text-white mb-2">
            Link Expired
          </h2>

          <p className="text-white/70 mb-6">
            {error.code === 'otp_expired'
              ? 'This password reset link has expired or has already been used.'
              : error.description}
          </p>

          <p className="text-white/50 text-sm mb-6">
            Please contact support at{' '}
            <a href="mailto:successionstory.now@gmail.com" className="text-[#B5A692] hover:underline">
              successionstory.now@gmail.com
            </a>{' '}
            to request a new link.
          </p>

          <button
            onClick={() => {
              setError(null);
              router.push('/');
            }}
            className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // This component doesn't render anything when there's no error
  return null;
}
