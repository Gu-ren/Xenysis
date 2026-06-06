'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CommandCenterLoading } from '@/components/transitions/command-center-loading';
import { supabase } from '@/services/auth/client';
import { fetchStartups } from '@/modules/projects/services/startups';

const STEPS = [
  { label: 'Verifying Google credentials', durationMs: 520 },
  { label: 'Establishing session', durationMs: 460 },
  { label: 'Loading your workspace', durationMs: 380 },
];

export function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exchanged = useRef(false);
  const destinationRef = useRef<string | null>(null);
  const animationDoneRef = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode double-invocation consuming the one-time OAuth code
    if (exchanged.current) return;
    exchanged.current = true;

    const code = searchParams.get('code');

    async function finish() {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            redirect('/login');
            return;
          }
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          redirect('/login');
          return;
        }
      }

      const startups = await fetchStartups().catch(() => []);
      const dest = startups.length === 0 ? '/founder-session?fresh=true' : '/dashboard';
      redirect(dest);
    }

    function redirect(dest: string) {
      destinationRef.current = dest;
      // If the loading animation already finished, navigate immediately
      if (animationDoneRef.current) router.replace(dest);
    }

    finish();
  }, [router, searchParams]);

  const handleAnimationComplete = () => {
    animationDoneRef.current = true;
    // If the exchange already resolved, navigate immediately
    if (destinationRef.current) router.replace(destinationRef.current);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0A0A0A' }}
    >
      <div className="w-full max-w-sm">
        <CommandCenterLoading
          title="Signing you in"
          subtitle="Connecting your Google account…"
          steps={STEPS}
          onComplete={handleAnimationComplete}
        />
      </div>
    </div>
  );
}
