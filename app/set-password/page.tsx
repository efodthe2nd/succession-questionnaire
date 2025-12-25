'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function SetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Password requirements
  const minLength = 8;
  const hasMinLength = password.length >= minLength;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const allRequirementsMet = hasMinLength && hasUppercase && hasLowercase && hasNumber && passwordsMatch;

  // Check for valid session on mount
  useEffect(() => {
    const checkSession = async () => {
      // First, check if there are tokens in the URL hash that need to be processed
      const hash = window.location.hash;

      if (hash && hash.includes('access_token')) {
        console.log('[SetPassword] Hash detected, manually extracting tokens...');

        // Parse the hash to extract tokens
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        console.log('[SetPassword] Tokens extracted:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken
        });

        if (!accessToken) {
          console.log('[SetPassword] No access_token in hash, redirecting...');
          router.push('/');
          setCheckingSession(false);
          return;
        }

        if (!refreshToken) {
          console.log('[SetPassword] ERROR: refresh_token missing from hash! Cannot establish session.');
          console.log('[SetPassword] This may be a test link or invalid recovery link.');
          // Can't call setSession without refresh_token
          router.push('/');
          setCheckingSession(false);
          return;
        }

        // Manually set the session since @supabase/ssr doesn't auto-process hash
        console.log('[SetPassword] Calling setSession with tokens...');
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        console.log('[SetPassword] setSession result:', {
          hasSession: !!data.session,
          error: error?.message
        });

        if (data.session) {
          // Clear the hash from URL
          window.history.replaceState(null, '', '/set-password');
          setHasValidSession(true);
          setCheckingSession(false);
          return;
        } else {
          console.log('[SetPassword] setSession failed:', error);
          // Token might be invalid/expired
          router.push('/');
          setCheckingSession(false);
          return;
        }
      }

      // No hash - just check for existing session
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setHasValidSession(true);
      } else {
        // No valid session - redirect to home
        router.push('/');
      }
      setCheckingSession(false);
    };

    checkSession();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password requirements
    if (!allRequirementsMet) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      // Success - show message and redirect to questionnaire
      setSuccess(true);

      // Redirect to questionnaire after a short delay (keep them signed in)
      setTimeout(() => {
        router.push('/questionnaire');
      }, 2000);
    } catch {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  // Loading state while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/bg-succession.png')" }}
        />
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 animate-pulse">
            <span className="text-white">Succession </span>
            <span className="text-[#B5A692]">Story</span>
          </h1>
          <p className="text-white/70 text-lg mb-8">Verifying your link...</p>
          <div className="flex justify-center">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-transparent border-t-[#B5A692] rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No valid session
  if (!hasValidSession) {
    return null; // Will redirect
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/bg-succession.png')" }}
        />
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="relative z-10 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            <span className="text-white">Password </span>
            <span className="text-[#B5A692]">Set!</span>
          </h1>
          <p className="text-white/70 text-lg mb-8">Taking you to your questionnaire...</p>
          <div className="flex justify-center">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-transparent border-t-[#B5A692] rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/bg-succession.png')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60" />

      {/* Logo - Fixed top left */}
      <div className="fixed top-8 left-8 z-20">
        <p className="text-white text-sm tracking-wide font-medium">Succession Story</p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 leading-tight">
          <span className="text-white">Set Your </span>
          <span className="text-[#B5A692]">Password</span>
        </h1>

        {/* Description */}
        <p className="text-white/70 text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
          Create a secure password to access your account
        </p>

        {/* Form Card */}
        <div className="bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-sm rounded-2xl p-8 pt-6 max-w-md mx-auto border border-white/10">
          <p className="text-white/60 text-xs tracking-widest uppercase mb-6">
            Succession Story
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-white text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* New Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3.5 bg-transparent border border-white/30 text-white rounded-lg placeholder-white/50 focus:outline-none focus:border-[#B5A692] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3.5 bg-transparent border border-white/30 text-white rounded-lg placeholder-white/50 focus:outline-none focus:border-[#B5A692] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="text-left space-y-1.5 py-2">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Password Requirements</p>
              <RequirementItem met={hasMinLength} text="At least 8 characters" />
              <RequirementItem met={hasUppercase} text="One uppercase letter" />
              <RequirementItem met={hasLowercase} text="One lowercase letter" />
              <RequirementItem met={hasNumber} text="One number" />
              <RequirementItem met={passwordsMatch} text="Passwords match" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !allRequirementsMet}
              className="w-full py-3.5 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Setting Password...' : 'Set Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer links */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-8 text-white text-sm z-20">
        <a href="/terms" className="hover:text-[#B5A692] transition-colors">Terms</a>
        <a href="/privacy" className="hover:text-[#B5A692] transition-colors">Privacy</a>
      </div>
    </div>
  );
}

// Requirement check item component
function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className={`text-sm ${met ? 'text-green-500' : 'text-white/50'}`}>{text}</span>
    </div>
  );
}
