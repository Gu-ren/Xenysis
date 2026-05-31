'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AuthInput } from '../../components/auth-input';
import { GoogleButton } from '../../components/google-button';

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent') ?? '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ source: 'signup' });
    if (intent) params.set('intent', intent);
    router.push(`/verify?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <AuthInput
        id="signup-email"
        label="Email"
        type="email"
        placeholder="you@startup.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-password"
          className="text-[10px] font-medium uppercase tracking-[0.14em] font-mono"
          style={{ color: '#888888' }}
        >
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          placeholder="Create a secure password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className="w-full rounded-[6px] px-3.5 py-2.5 text-[14px] focus:outline-none transition-colors duration-150"
          style={{
            background: 'rgba(255,255,255,0.04)',
            color: '#F5F5F5',
            border: '1px solid rgba(255,255,255,0.08)',
            caretColor: '#4FFAB0',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#4FFAB0'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className="w-full rounded-[6px] py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 group transition-colors duration-150 mt-0.5"
        style={{ background: '#4FFAB0', color: '#080808' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#44E5A9'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#4FFAB0'; }}
      >
        <span>Start Building</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
      </motion.button>

      <div className="flex items-center gap-3 my-0.5">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: '#888888' }}>
          or
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>

      <GoogleButton />

      <p className="text-center text-[12px] mt-1 text-muted">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium transition-colors"
          style={{ color: '#4FFAB0' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#44E5A9'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#4FFAB0'; }}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
