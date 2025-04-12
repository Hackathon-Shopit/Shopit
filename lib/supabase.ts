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

// Store a single instance of the Supabase client
let supabaseInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

/**
 * Creates a Supabase client with retry logic for handling rate limits
 * Implements singleton pattern to prevent multiple instances
 */
export const createClient = () => {
  // Return existing instance if already created
  if (supabaseInstance) return supabaseInstance
  
  // Only create a new instance if one doesn't exist
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
  
  // Store the instance for future use
  supabaseInstance = supabase
  return supabase
}

// Reset function for testing purposes
export const resetSupabaseClient = () => {
  supabaseInstance = null
}
