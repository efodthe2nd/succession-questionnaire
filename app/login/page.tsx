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
      router.push('/questionnaire');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background image - uses a dark overlay on pen/paper image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: "url('/bg-succession.png')",
        }}
      />
      
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black opacity-60" />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Small logo text at top left */}
        <div className="absolute top-8 left-8">
          {/* <p className="text-white text-sm tracking-wide">Succession Story</p> */}
        </div>

        {/* Main Title */}
        <h1 className="text-white text-5xl md:text-6xl font-heading font-bold mb-2 leading-tight">
          Succession Story
        </h1>
        
        {/* Subtitle - Questionnaire in tan color */}
        <h2 className="text-[#B5A692] text-4xl md:text-5xl font-heading font-bold mb-6">
          Questionnaire
        </h2>
        
        {/* Description */}
        <p className="text-white text-base md:text-lg mb-12 max-w-md mx-auto leading-relaxed">
          A short guide to help you express your values, intentions, and legacy.
        </p>

        {!showForm ? (
          /* Start Button - inverted style */
          <button
            onClick={() => setShowForm(true)}
            className="bg-transparent border-2 border-white text-white px-12 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300"
          >
            Start
          </button>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5 mt-8 animate-fadeIn">
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-transparent border-2 border-white text-white rounded-full placeholder-gray-400 focus:outline-none focus:border-[#B5A692] transition-colors"
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-transparent border-2 border-white text-white rounded-full placeholder-gray-400 focus:outline-none focus:border-[#B5A692] transition-colors"
              required
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            <button
              type="button"
              className="text-white text-sm underline hover:text-[#B5A692] transition-colors mt-3"
            >
              Forgot Password?
            </button>
          </form>
        )}

        {/* Footer links */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-8 text-white text-xs">
          <a href="#" className="hover:text-[#B5A692] transition-colors">Succession Story</a>
          <a href="#" className="hover:text-[#B5A692] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#B5A692] transition-colors">Policy</a>
          <a href="#" className="hover:text-[#B5A692] transition-colors">Privacy</a>
        </div>

        {/* Settings icon bottom right */}
        <div className="fixed bottom-8 right-8">
          <button className="text-white hover:text-[#B5A692] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}