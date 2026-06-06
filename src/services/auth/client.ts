'use client'

import { createClient } from '@supabase/supabase-js'

// Supabase renamed the anon key to NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in newer projects.
// Fall back to the legacy name so both old and new projects work.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set',
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
