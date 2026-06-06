// BACKEND: initialize Supabase client when auth is integrated.
// Required env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
//
// import { createClient } from "@supabase/supabase-js"
// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

export const supabase = null as unknown as never
