'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function AuthHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-center gap-2.5 mb-10"
    >
      <Image className="rounded-lg" src="/logo.svg" alt="Xenysis" width={28} height={28} priority />
      <span className="text-[18px] font-semibold tracking-[-0.03em] text-foreground">
        Xenysis
      </span>
    </motion.div>
  );
}
