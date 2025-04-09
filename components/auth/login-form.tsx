"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

// Maximum retries for login attempts when hitting rate limits
const MAX_LOGIN_RETRIES = 2
const BASE_RETRY_DELAY = 1000 // ms

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Check for the registered parameter in the URL
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Registration successful! Please sign in with your new account.")
    }
  }, [searchParams])

  // Countdown timer for rate limit recovery
  useEffect(() => {
    if (rateLimitCountdown === null || rateLimitCountdown <= 0) return;
    
    const timer = setTimeout(() => {
      setRateLimitCountdown(prev => prev !== null ? prev - 1 : null);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [rateLimitCountdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rateLimitCountdown !== null && rateLimitCountdown > 0) {
      setError(`Please wait ${rateLimitCountdown} seconds before trying again.`);
      return;
    }
    
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    let retryCount = 0;
    
    const attemptLogin = async (): Promise<boolean> => {
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!signInError) {
          return true; // Success
        }
        
        // Handle rate limiting errors
        if (signInError.status === 429 || 
            signInError.message?.includes("rate limit") || 
            signInError.message?.includes("over_request_rate_limit")) {
          
          if (retryCount < MAX_LOGIN_RETRIES) {
            retryCount++;
            const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount - 1);
            console.log(`Rate limited, retrying login in ${delay}ms (attempt ${retryCount}/${MAX_LOGIN_RETRIES})`);
            
            // Show user we're waiting before retry
            setError(`Rate limit reached. Retrying in ${Math.round(delay/1000)} seconds... (attempt ${retryCount}/${MAX_LOGIN_RETRIES})`);
            
            await new Promise(resolve => setTimeout(resolve, delay));
            return attemptLogin(); // Recursive retry
          } else {
            // We've exhausted retries, tell user to wait
            const waitTime = 30; // 30 seconds is a reasonable wait time
            setRateLimitCountdown(waitTime);
            throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds before trying again.`);
          }
        }
        
        throw signInError;
      } catch (error: any) {
        throw error;
      }
    };

    try {
      const success = await attemptLogin();
      if (success) {
        router.push("/")
        router.refresh()
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error messages
      if (error.message?.includes("rate limit") || error.message?.includes("wait")) {
        setError(error.message);
      } else if (error.message?.includes("Invalid login")) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else {
        setError(error.message || "An error occurred during login");
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your email and password to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || (rateLimitCountdown !== null && rateLimitCountdown > 0)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/reset-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || (rateLimitCountdown !== null && rateLimitCountdown > 0)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || (rateLimitCountdown !== null && rateLimitCountdown > 0)}
          >
            {loading ? "Signing in..." : rateLimitCountdown !== null && rateLimitCountdown > 0 
              ? `Please wait ${rateLimitCountdown}s...` 
              : "Sign In"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
