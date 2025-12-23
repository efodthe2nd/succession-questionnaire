'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    // Check URL hash for recovery tokens
    const handleHashChange = async () => {
      // Only process on client side
      if (typeof window === 'undefined') return;

      const hash = window.location.hash;

      // Check if this is a recovery flow
      if (hash && hash.includes('type=recovery')) {
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

  // This component doesn't render anything
  return null;
}
