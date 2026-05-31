'use client';

import { ReactNode } from 'react';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center px-6 py-16"
      style={{ background: '#0A0A0A' }}
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        aria-hidden="true"
        className="fixed pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(79,250,176,0.06) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
        }}
      />
      <div className="relative z-10 w-full max-w-[400px] flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
