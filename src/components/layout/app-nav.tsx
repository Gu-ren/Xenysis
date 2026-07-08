'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, LogOut } from 'lucide-react'
import { useAuth } from '@/services/auth/use-auth'
import { signOut } from '@/services/auth'

export function AppNav() {
  const { user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/login')
  }

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-[57px] border-b"
      style={{
        background: 'rgba(10,10,10,0.92)',
        borderColor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 select-none">
        <Image
          src="/logo.svg"
          alt="Xenysis"
          width={22}
          height={22}
          priority
        />
        <span
          className="text-[14px] font-semibold tracking-[-0.02em]"
          style={{ color: '#F5F5F5' }}
        >
          Xenysis
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* New Project */}
        <Link
          href="/founder-session"
          className="flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[12px] font-medium font-mono transition-colors duration-150"
          style={{
            background: '#4FFAB0',
            color: '#0A0A0A',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#44E5A9'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#4FFAB0'
          }}
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          New Project
        </Link>

        {/* User email */}
        {user?.email && (
          <span
            className="hidden sm:block text-[12px] font-mono max-w-[160px] truncate"
            style={{ color: '#888888' }}
          >
            {user.email}
          </span>
        )}

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-[12px] font-mono transition-colors duration-150"
          style={{
            color: '#888888',
            background: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#F5F5F5'
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#888888'
            e.currentTarget.style.background = 'transparent'
          }}
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
