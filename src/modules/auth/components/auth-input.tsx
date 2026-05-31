'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
  autoComplete?: string;
}

export function AuthInput({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  showToggle,
  autoComplete,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const actualType = showToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-medium uppercase tracking-[0.14em] font-mono"
        style={{ color: '#888888' }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={actualType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
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
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: '#888888' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#F5F5F5'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#888888'; }}
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
