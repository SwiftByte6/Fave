"use client";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/products';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';

  const getSafeNextPath = (value: string) => (value.startsWith('/') ? value : '/');

  useEffect(() => {
    const redirectHome = () => {
      window.location.replace(getSafeNextPath(nextPath));
    };

    // 1. Immediately check if session is already parsed/established
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        redirectHome();
      }
    });

    // 2. Listen to state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || session) {
        redirectHome();
      }
    });

    // Fallback: If no event fires in 4 seconds, redirect to home
    const timeout = setTimeout(() => {
      redirectHome();
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [nextPath]);

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-fav-off-white">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-fav-gold" />
        <h2 className="text-xl font-semibold text-fav-maroon playfair">Completing secure sign in...</h2>
        <p className="text-sm text-fav-warm-gray">Please wait while we redirect you to your destination.</p>
      </div>
    </div>
  );
}
