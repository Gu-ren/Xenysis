'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import Link from 'next/link';

export function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'verified' | 'error'>('loading');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');

    if (verified === '1') {
      setStatus('verified');
    } else if (error) {
      setStatus('error');
    } else {
      setStatus('verified');
    }
  }, [searchParams]);

  useEffect(() => {
    if (status !== 'verified') return;

    const intent = searchParams.get('intent') ?? '';
    const params = new URLSearchParams({ fresh: 'true' });
    if (intent) params.set('intent', intent);
    const destination = `/login?${params.toString()}`;

    const interval = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(interval);
          return 0;
        }
        return n - 1;
      });
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.push(destination);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimer);
    };
  }, [status, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0A0A' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-[12px] p-8 flex flex-col items-center text-center gap-6"
        style={{ background: '#171717', border: '1px solid #27272A' }}
      >
        {status === 'loading' && (
          <p className="text-[13px]" style={{ color: '#A1A1AA' }}>Confirming your email…</p>
        )}

        {status === 'verified' && (
          <>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(79,250,176,0.1)' }}
            >
              <CheckCircle className="w-6 h-6" style={{ color: '#4FFAB0' }} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-[20px] font-semibold tracking-tight text-foreground">
                Email verified
              </h1>
              <p className="text-[13px] leading-relaxed" style={{ color: '#A1A1AA' }}>
                You&apos;re all set. Sign in to continue — redirecting in {countdown}…
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)' }}
            >
              <X className="w-6 h-6" style={{ color: '#EF4444' }} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-[20px] font-semibold tracking-tight text-foreground">
                Confirmation failed
              </h1>
              <p className="text-[13px] leading-relaxed" style={{ color: '#A1A1AA' }}>
                This link may have expired.{' '}
                <Link href="/signup" className="underline" style={{ color: '#4FFAB0' }}>
                  Sign up again
                </Link>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
