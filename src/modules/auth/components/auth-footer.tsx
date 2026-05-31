'use client';

import { motion } from 'framer-motion';

export function AuthFooter() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      className="mt-8 text-[11px] leading-relaxed text-center font-mono"
      style={{ color: '#555555' }}
    >
      <span>By continuing, you agree to our </span>
      <a
        href="#"
        className="underline underline-offset-2 transition-colors"
        style={{ color: '#555555' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#4FFAB0'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#555555'; }}
      >
        Terms
      </a>
      <span> and </span>
      <a
        href="#"
        className="underline underline-offset-2 transition-colors"
        style={{ color: '#555555' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#4FFAB0'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#555555'; }}
      >
        Privacy Policy
      </a>
    </motion.p>
  );
}
