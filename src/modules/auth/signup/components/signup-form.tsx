'use client';

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AuthInput } from '../../components/auth-input'
import { GoogleButton } from '../../components/google-button'
import { register, signInWithGoogle } from '@/services/auth'

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    signInWithGoogle();
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signUpError } = await register(email, password);

    if (signUpError) {
      if (signUpError.code === 'CONFLICT') {
        setError('already_exists');
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4 py-6 text-center"
        >
          <p className="text-[22px] font-semibold tracking-tight text-foreground">Check your inbox.</p>
          <p className="text-[13px] text-muted leading-relaxed">
            We sent a confirmation link to <span className="text-foreground">{email}</span>.
            <br />Click it to finish signing up.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-3.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <AuthInput
            id="signup-email"
            label="Email"
            type="email"
            placeholder="JohnDoe@gmail.com"
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
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-[6px] px-3.5 py-2.5 pr-10 text-[14px] focus:outline-none transition-colors duration-150"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: '#F5F5F5',
                  border: '1px solid rgba(255,255,255,0.08)',
                  caretColor: '#4FFAB0',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#4FFAB0'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
                style={{ color: '#888888' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#4FFAB0'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#888888'; }}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="flex items-start gap-2.5 rounded-[6px] px-3 py-2.5"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertCircle className="w-3.5 h-3.5 mt-px shrink-0" style={{ color: '#EF4444' }} />
              <p className="text-[12px] leading-snug" style={{ color: '#EF4444' }}>
                {error === 'already_exists' ? (
                  <>
                    This email is already registered.{' '}
                    <Link href="/login" className="underline font-medium" style={{ color: '#4FFAB0' }}>
                      Sign in instead
                    </Link>
                  </>
                ) : error}
              </p>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.005 } : {}}
            whileTap={!loading ? { scale: 0.995 } : {}}
            className="w-full rounded-[6px] py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 group transition-colors duration-150 mt-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: '#4FFAB0', color: '#080808' }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#44E5A9'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#4FFAB0'; }}
          >
            <span>{loading ? 'Creating account…' : 'Start Building'}</span>
            {!loading && <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />}
          </motion.button>

          <div className="flex items-center gap-3 my-0.5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: '#888888' }}>
              or
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <GoogleButton onClick={handleGoogleSignIn} loading={googleLoading} />

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
        </motion.form>
      )}
    </AnimatePresence>
  );
}
