import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// This is the recommended way to create a Supabase client in client components
export const createClient = () => {
  return createClientComponentClient<Database>()
}

// No more global supabase instance!

// This approach ensures we only create the client on the client side
// and only create it once

// For server-side rendering
// const createServerSupabaseClient = () => {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
//   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
//   return createClient(supabaseUrl, supabaseAnonKey)
// }

// // For client-side rendering
// let browserSupabase: ReturnType<typeof createClient> | null = null

// const createBrowserSupabaseClient = () => {
//   if (browserSupabase) return browserSupabase

//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
//   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
//   browserSupabase = createClient(supabaseUrl, supabaseAnonKey)
//   return browserSupabase
// }

// export const getSupabase = () => {
//   if (typeof window === "undefined") {
//     // Server-side
//     return createServerSupabaseClient()
//   }
//   // Client-side
//   return createBrowserSupabaseClient()
// }

// For backward compatibility
// export const supabase = getSupabase()
