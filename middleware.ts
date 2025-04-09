import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// Maximum number of retries for rate-limited requests in middleware
const MAX_RETRIES = 2

// Base delay in ms (exponential backoff will be applied)
const BASE_DELAY = 750 

// Cache session check results for 5 seconds to reduce API calls
const SESSION_CACHE_DURATION = 5000
const sessionCache = new Map<string, { session: any, timestamp: number }>()

/**
 * Executes a function with retry logic for handling rate limits
 */
async function executeWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  baseDelay: number = BASE_DELAY
): Promise<T> {
  let retries = 0
  
  const execute = async (): Promise<T> => {
    try {
      return await fn()
    } catch (error: any) {
      // Check if the error is related to rate limiting (429 status code)
      if ((error?.status === 429 || 
           error?.message?.includes("rate limit") || 
           error?.message?.includes("over_request_rate_limit")) && 
          retries < maxRetries) {
        retries++
        const delay = baseDelay * Math.pow(2, retries - 1)
        console.log(`Rate limited in middleware, retrying in ${delay}ms (attempt ${retries}/${maxRetries})`)
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay))
        return execute()
      }
      
      // Re-throw other errors or if we've exhausted retries
      throw error
    }
  }
  
  return execute()
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // Create a new middleware client for each request
    const supabase = createMiddlewareClient({ req, res })
    
    // Get the pathname from the URL
    const path = req.nextUrl.pathname
    
    // Define auth routes - these are the routes that don't require authentication
    const isAuthRoute = path === "/login" || path === "/register"
    
    // Skip session checks for static files and non-HTML requests
    const isStaticFile = path.match(/\.(css|js|svg|png|jpg|jpeg|gif|ico|json|woff|woff2|ttf|eot)$/i)
    const acceptHeader = req.headers.get('accept') || ''
    const prefersHTML = acceptHeader.includes('text/html')
    
    if (isStaticFile || !prefersHTML) {
      return res
    }

    // Generate a cache key based on cookies for session caching
    const cookieString = req.headers.get('cookie') || ''
    const cacheKey = `session_${cookieString}`
    
    // Check if we have a cached session and it's still valid
    const cachedData = sessionCache.get(cacheKey)
    const now = Date.now()
    
    let session = null
    
    if (cachedData && (now - cachedData.timestamp) < SESSION_CACHE_DURATION) {
      // Use cached session
      session = cachedData.session
    } else {
      // Refresh session if expired - with retry logic for rate limiting
      try {
        await executeWithRetry(() => supabase.auth.getSession(), 1, BASE_DELAY)
      } catch (error) {
        console.error("Failed to refresh session after retries:", error)
        // Continue without throwing - we'll handle auth state below
      }

      // Get session with retry logic - try only once to avoid rate limits
      const { data } = await executeWithRetry(
        async () => await supabase.auth.getSession(),
        1, // Only try once here to avoid hitting rate limits repeatedly
        BASE_DELAY
      )
      
      session = data.session
      
      // Cache the session result
      sessionCache.set(cacheKey, { session, timestamp: now })
    }

    // Define protected routes - these require authentication
    const isProtectedRoute = !isAuthRoute && path !== "/_next" && !path.startsWith("/_next/")

    // Check if the user is authenticated
    if (!session) {
      // If the user is not authenticated and trying to access a protected route
      if (isProtectedRoute) {
        // Redirect to login for all protected routes
        return NextResponse.redirect(new URL("/login", req.url))
      }
      // Allow access to auth routes
      return res
    }

    // If the user is authenticated and trying to access an auth route, redirect to home
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  } catch (error) {
    console.error("Error in middleware:", error)
    
    // On critical errors, allow the request to continue
    // The client-side auth check will redirect if needed
  }

  return res
}

// Update the matcher to exclude more static paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - public folder items (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}
