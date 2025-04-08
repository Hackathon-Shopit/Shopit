// Helper to check if environment variables are set
export function getEnvVariable(key: string): string {
  const value = process.env[key]
  if (!value) {
    // In development, warn about missing env vars
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Missing environment variable: ${key}`)
    }
    return ""
  }
  return value
}

// Get Supabase environment variables
export const SUPABASE_URL = getEnvVariable("NEXT_PUBLIC_SUPABASE_URL")
export const SUPABASE_ANON_KEY = getEnvVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY")

// Check if Supabase is configured
export const isSupabaseConfigured = SUPABASE_URL !== "" && SUPABASE_ANON_KEY !== ""
