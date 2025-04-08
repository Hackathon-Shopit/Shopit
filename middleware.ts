import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // Create a new middleware client for each request
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Get the pathname from the URL
    const path = req.nextUrl.pathname

    // Define auth routes - these are the routes that don't require authentication
    const isAuthRoute = path.startsWith("/auth")

    // Define dashboard routes - these require authentication
    const isDashboardRoute = path.startsWith("/dashboard")

    // Check if the user is authenticated
    if (!session) {
      // If the user is not authenticated and trying to access a protected route
      if (isDashboardRoute || path === "/") {
        // Redirect to login for all protected routes
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }
      // Allow access to auth routes
      return res
    }

    // If the user is authenticated and trying to access an auth route, redirect to dashboard
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // If the user is authenticated and accessing the root path, redirect to dashboard
    if (session && path === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  } catch (error) {
    console.error("Error in middleware:", error)
  }

  return res
}

// Update the matcher to match all routes except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}
