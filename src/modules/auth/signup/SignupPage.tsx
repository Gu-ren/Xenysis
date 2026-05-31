'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { AuthShell } from '../components/auth-shell';
import { AuthCard } from '../components/auth-card';
import { AuthHeader } from '../components/auth-header';
import { AuthFooter } from '../components/auth-footer';
import { SignupForm } from './components/signup-form';

export function SignupPage() {
  return (
    <AuthShell>
      <AuthHeader />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        <AuthCard>
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-semibold tracking-[-0.04em] leading-[1.1] mb-2.5 text-foreground">
              Your idea.
              <br />
              Our engine.
            </h1>
            <p className="text-[13px] leading-relaxed text-muted">
              Build your startup with an AI co-founder.
            </p>
          </div>
          <Suspense>
            <SignupForm />
          </Suspense>
        </AuthCard>
        <AuthFooter />
      </motion.div>
    </AuthShell>
  );
}
