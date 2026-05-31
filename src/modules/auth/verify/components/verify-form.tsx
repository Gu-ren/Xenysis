'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { OtpInput, ResendTimer } from '../../components/otp-input';

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const isFilled = digits.every((d) => d !== '');

  const handleResend = useCallback(() => {
    setDigits(['', '', '', '', '', '']);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFilled) return;
    router.push(source === 'signup' ? '/founder-session' : '/dashboard');
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="w-10 h-10 rounded-[6px] flex items-center justify-center mb-8"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <ShieldCheck className="w-5 h-5" strokeWidth={1.5} style={{ color: '#4FFAB0' }} />
      </motion.div>

      <div className="text-center mb-8 w-full">
        <h1 className="text-[28px] font-semibold tracking-[-0.04em] leading-[1.1] mb-2.5 text-foreground">
          Check your inbox.
        </h1>
        <p className="text-[13px] leading-relaxed text-muted">
          We sent a 6-digit code to your email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        <OtpInput value={digits} onChange={setDigits} />

        <motion.button
          type="submit"
          disabled={!isFilled}
          whileHover={isFilled ? { scale: 1.005 } : {}}
          whileTap={isFilled ? { scale: 0.995 } : {}}
          className="w-full rounded-[6px] py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 group transition-colors duration-150 disabled:cursor-not-allowed"
          style={{
            background: isFilled ? '#4FFAB0' : 'rgba(255,255,255,0.04)',
            color: isFilled ? '#080808' : '#888888',
          }}
        >
          <span>Verify and Continue</span>
          <ArrowRight
            className={`w-3.5 h-3.5 transition-transform duration-150 ${isFilled ? 'group-hover:translate-x-0.5' : ''}`}
          />
        </motion.button>

        <ResendTimer onResend={handleResend} />
      </form>
    </div>
  );
}
