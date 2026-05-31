import { ReactNode } from 'react';

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="w-full rounded-2xl px-8 py-8"
      style={{
        background: '#171717',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {children}
    </div>
  );
}
