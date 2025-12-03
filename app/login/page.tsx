'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function LoginPage() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setIsRedirecting(true);
      router.push('/questionnaire');
    }
  };

  // Full-screen branded loading overlay
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/bg-succession.png')",
          }}
        />
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-60" />

        {/* Loading Content */}
        <div className="relative z-10 text-center">
          {/* Animated logo */}
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 animate-pulse">
            <span className="text-white">Succession </span>
            <span className="text-[#B5A692]">Story</span>
          </h1>
          
          {/* Loading message */}
          <p className="text-white/70 text-lg mb-8">
            Preparing your legacy journey...
          </p>
          
          {/* Elegant loading spinner */}
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
        style={{
          backgroundImage: "url('/bg-succession.png')",
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60" />

      {/* Logo - Fixed top left */}
      <div className="fixed top-8 left-8 z-20">
        <p className="text-white text-sm tracking-wide font-medium">Succession Story</p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Main Title - "Succession" in white, "Story" in tan */}
        <h1 className="text-5xl md:text-6xl font-heading font-bold mb-2 leading-tight">
          <span className="text-white">Succession </span>
          <span className="text-[#B5A692]">Story</span>
        </h1>
        
        {/* Description */}
        <p className="text-white text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Level up your estate plan
        </p>

        {!showForm ? (
          /* Start Button - Outlined rounded pill */
          <button
            onClick={() => setShowForm(true)}
            className="px-16 py-3.5 bg-transparent border border-white text-white rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300"
          >
            Start
          </button>
        ) : (
          /* Form Card with dark gradient background */
          <div className="bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-sm rounded-2xl p-8 pt-6 max-w-md mx-auto animate-fadeIn border border-white/10">
            {/* Succession Story text inside card */}
            <p className="text-white/60 text-xs tracking-widest uppercase mb-6">
              Succession Story
            </p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-white text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}
              
              {/* Email Input */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-transparent border border-white/30 text-white rounded-lg placeholder-white/50 focus:outline-none focus:border-[#B5A692] transition-colors"
                  required
                />
              </div>
              
              {/* Password Input with lock icon and eye toggle */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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
              
              {/* Forgot Password - Right aligned */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-white/60 text-sm hover:text-[#B5A692] transition-colors"
                >
                  Forgot Password
                </button>
              </div>
              
              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 mt-2"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer links */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-8 text-white text-sm z-20">
        <a href="#" className="hover:text-[#B5A692] transition-colors">Succession Story</a>
        <a href="#" className="hover:text-[#B5A692] transition-colors">Terms</a>
        <a href="#" className="hover:text-[#B5A692] transition-colors">Policy</a>
        <a href="#" className="hover:text-[#B5A692] transition-colors">Privacy</a>
      </div>

      {/* Settings icon - Fixed bottom right */}
      <div className="fixed bottom-8 right-8 z-20">
        <button className="text-white hover:text-[#B5A692] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}