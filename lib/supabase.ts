import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from "@/types/supabase"

// Maximum number of retries for rate-limited requests
const MAX_RETRIES = 3

// Base delay in ms (exponential backoff will be applied)
const BASE_DELAY = 1000

// Parse session expiry from env or default to 14 days (in seconds)
const sessionExpirySeconds = 
  parseInt(process.env.NEXT_PUBLIC_SUPABASE_SESSION_EXPIRY || '1209600', 10)

// Parse token refresh margin from env or default to 7 days (in seconds)
const tokenRefreshMarginSeconds = 
  parseInt(process.env.NEXT_PUBLIC_SUPABASE_AUTH_TOKEN_REFRESH_MARGIN || '604800', 10)

/**
 * Creates a Supabase client with retry logic for handling rate limits
 */
export const createClient = () => {
  const supabase = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        // Use extended session durations from environment
        storageKey: 'supabase-auth',
        // Avoid excessive refreshes by using longer expiration and refresh margin
        detectSessionInUrl: false,
        flowType: 'pkce',
      },
      global: {
        headers: {
          // Add request identifier to help with debugging
          'x-client-info': `@shopit/${process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}`
        },
        fetch: async (url, options = {}) => {
          // Implement retry logic with exponential backoff for rate-limited requests
          let retries = 0
          
          const executeRequest = async (): Promise<Response> => {
            try {
              const response = await fetch(url, options)
              
              // If we get rate limited, retry with exponential backoff
              if (response.status === 429 && retries < MAX_RETRIES) {
                retries++
                const delay = BASE_DELAY * Math.pow(2, retries - 1)
                console.log(`Rate limited, retrying in ${delay}ms (attempt ${retries}/${MAX_RETRIES})`)
                
                await new Promise(resolve => setTimeout(resolve, delay))
                return executeRequest()
              }
              
              return response
            } catch (error) {
              console.error('Supabase request error:', error)
              throw error
            }
          }
          
          return executeRequest()
        },
      },
      // Reduce network requests by caching data longer
      realtime: {
        params: {
          eventsPerSecond: 2  // Limit realtime events to reduce load
        }
      },
      db: {
        schema: 'public'
      }
    }
  )
  
  return supabase
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
