"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/products';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface SigninProps {
  mode?: 'signin' | 'signup';
  embedded?: boolean;
  nextPathOverride?: string;
}

const Signin: React.FC<SigninProps> = ({ mode = 'signin', embedded = false, nextPathOverride }) => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const nextPath = nextPathOverride || searchParams.get('next') || '/';

  const getSafeNextPath = (value: string) => (value.startsWith('/') ? value : '/');

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast.success(mode === 'signin' ? 'Welcome back to FAVEE!' : 'Welcome to FAVEE!');
        window.location.replace(getSafeNextPath(nextPath));
      }
    });
    return () => sub?.subscription.unsubscribe();
  }, [mode, nextPath]);

  const handleGoogleAuth = async () => {
    setLoading(true);

    // Safety reset — if nothing happens in 8 seconds, reset the button
    const safetyTimer = setTimeout(() => {
      setLoading(false);
      toast.error('Google sign-in timed out. Ensure the Google provider is enabled and the redirect URL https://favee.shop/auth/callback (and http://localhost:3000/auth/callback for local dev) is whitelisted in Supabase Authentication → URL Configuration.');
    }, 8000);

    try {
      const redirectBase = (process.env.NEXT_PUBLIC_SITE_URL) ? process.env.NEXT_PUBLIC_SITE_URL : window.location.origin;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectBase}/auth/callback?next=${encodeURIComponent(getSafeNextPath(nextPath))}`,
        },
      });

      if (error) {
        clearTimeout(safetyTimer);
        console.error('[Supabase OAuth Error]', error);
        toast.error(error.message || 'Google sign-in failed. Check Supabase dashboard settings.');
        setLoading(false);
        return;
      }

      if (data?.url) {
        clearTimeout(safetyTimer);
        window.location.href = data.url;
      } else {
        clearTimeout(safetyTimer);
        console.error('[Supabase] No URL returned from signInWithOAuth. Google provider may not be enabled.');
        toast.error('Google provider is not enabled. Go to Supabase Dashboard → Authentication → Providers → Enable Google.');
        setLoading(false);
      }
    } catch (err: any) {
      clearTimeout(safetyTimer);
      console.error('[Supabase OAuth Exception]', err);
      toast.error(err.message || 'An error occurred during authentication');
      setLoading(false);
    }
  };


  const content = (
    <div className="w-full max-w-xl bg-white/75 backdrop-blur-xl border border-fav-blush/45 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(122,31,42,0.05)] hover:shadow-[0_25px_60px_rgba(122,31,42,0.08)] transition-all duration-500 flex flex-col items-center z-10">
      {/* Brand Logo & Presentation */}
      <div className="flex flex-col items-center text-center mb-10 w-full">
        <div className="relative w-20 h-20 mb-5 p-2 bg-white rounded-2xl shadow-[0_8px_30px_rgba(122,31,42,0.04)] border border-fav-beige/50 hover:scale-105 transition-transform duration-300">
          <Image
            src="/logo.png"
            alt="FAVEE Logo"
            fill
            className="object-contain p-2"
            priority
          />
        </div>
        <h1 className="playfair text-3xl md:text-4xl text-fav-maroon mb-3 font-semibold tracking-tight">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-fav-warm-gray text-sm px-2 leading-relaxed">
          {mode === 'signin'
            ? 'Sign in to access your curated collections, shopping cart, and order history.'
            : 'Join the world of FAVEE for early access to curated trends, private collections, and custom sizing.'}
        </p>
      </div>

      {/* Primary Auth Action Button */}
      <button
        onClick={handleGoogleAuth}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white text-fav-charcoal hover:text-fav-maroon border border-fav-blush/80 hover:border-fav-gold px-6 py-4 rounded-2xl font-semibold shadow-sm hover:shadow-[0_8px_25px_rgba(199,138,43,0.12)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed group cursor-pointer"
      >
        {loading ? (
          <Loader2 className="animate-spin text-fav-gold text-xl" />
        ) : (
          <FcGoogle className="text-2xl transition-transform duration-300 group-hover:scale-110" />
        )}
        <span className="text-base font-medium">
          {loading
            ? 'Connecting to Google...'
            : mode === 'signin'
              ? 'Continue with Google'
              : 'Sign up with Google'}
        </span>
      </button>

      {/* Secure badge & Divider */}
      <div className="w-full mt-10 text-center">
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-fav-beige/60" />
          </div>
          <span className="relative px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-fav-warm-gray bg-[#faf8f5] rounded-full">
            Secure Auth by Supabase
          </span>
        </div>

        <p className="text-xs text-fav-warm-gray/70 leading-relaxed px-4 mb-8">
          Your credentials are encrypted. By signing in, you agree to FAVEE's{' '}
          <a href="/terms-of-service" className="text-fav-maroon hover:text-fav-gold font-medium underline underline-offset-2 transition-colors">Terms of Service</a> and{' '}
          <a href="/privacy-policy" className="text-fav-maroon hover:text-fav-gold font-medium underline underline-offset-2 transition-colors">Privacy Policy</a>.
        </p>

        {/* Toggle between Signin and Signup */}
        <div className="border-t border-fav-beige/40 pt-6">
          <p className="text-sm text-fav-charcoal font-medium">
            {mode === 'signin' ? "Don't have an account yet?" : "Already have an account?"}{' '}
            <a
              href={mode === 'signin' ? '/signup' : '/signin'}
              className="text-fav-maroon hover:text-fav-gold font-bold transition-colors underline decoration-2 underline-offset-4"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center bg-fav-off-white px-4 py-16 overflow-hidden">
      {/* Elegantly shifting ambient blurred background mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-fav-blush/30 blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-fav-gold/15 blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[35%] left-[55%] w-[35vw] h-[35vw] rounded-full bg-fav-maroon/5 blur-[110px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      {content}
    </div>
  );
};

export default Signin;
