'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { AuthShell } from '../components/auth-shell';
import { AuthCard } from '../components/auth-card';
import { AuthHeader } from '../components/auth-header';
import { AuthFooter } from '../components/auth-footer';
import { VerifyForm } from './components/verify-form';

export function VerifyPage() {
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
          <Suspense>
            <VerifyForm />
          </Suspense>
        </AuthCard>
        <AuthFooter />
      </motion.div>
    </AuthShell>
  );
}
