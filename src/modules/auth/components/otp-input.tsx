'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

const RESEND_SECONDS = 42;

interface OtpInputProps {
  value: string[];
  onChange: (digits: string[]) => void;
}

export function OtpInput({ value, onChange }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      if (value[idx] !== '') {
        const next = [...value];
        next[idx] = '';
        onChange(next);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
        const next = [...value];
        next[idx - 1] = '';
        onChange(next);
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) return;
    if (raw.length > 1) {
      const next = [...value];
      let cursor = idx;
      for (let i = 0; i < raw.length && cursor < 6; i++, cursor++) {
        next[cursor] = raw[i];
      }
      onChange(next);
      inputRefs.current[Math.min(idx + raw.length, 5)]?.focus();
      return;
    }
    const next = [...value];
    next[idx] = raw;
    onChange(next);
    if (idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6 - idx);
    if (!text) return;
    const next = [...value];
    for (let i = 0; i < text.length; i++) next[idx + i] = text[i];
    onChange(next);
    inputRefs.current[Math.min(idx + text.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="6-digit verification code">
      {value.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { inputRefs.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={digit}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={(e) => handlePaste(e, idx)}
          aria-label={`Digit ${idx + 1}`}
          className="w-10 h-12 rounded-[6px] text-center text-[18px] font-semibold focus:outline-none transition-colors duration-150"
          style={{
            background: 'rgba(255,255,255,0.04)',
            color: '#F5F5F5',
            caretColor: '#4FFAB0',
            border: `1px solid ${digit ? '#4FFAB0' : 'rgba(255,255,255,0.08)'}`,
          }}
        />
      ))}
    </div>
  );
}

interface ResendTimerProps {
  onResend: () => void;
}

export function ResendTimer({ onResend }: ResendTimerProps) {
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const handleResend = useCallback(() => {
    setSeconds(RESEND_SECONDS);
    onResend();
  }, [onResend]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${mins}:${secs.toString().padStart(2, '0')}`;

  if (seconds > 0) {
    return (
      <p className="text-center text-[12px] tabular-nums font-mono" style={{ color: '#888888' }}>
        Resend in <span style={{ color: '#4FFAB0' }}>{display}</span>
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={handleResend}
      className="text-[12px] font-medium font-mono mx-auto block transition-opacity hover:opacity-75"
      style={{ color: '#4FFAB0' }}
    >
      Resend code
    </button>
  );
}
