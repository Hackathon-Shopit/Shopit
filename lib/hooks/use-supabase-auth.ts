"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import type { User } from "@supabase/supabase-js"

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { supabase, isConfigured } = useSupabase()

  useEffect(() => {
    // Only try to get session if Supabase is configured
    if (supabase && isConfigured) {
      // Get initial session
      const getInitialSession = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)
        setLoading(false)
      }

      getInitialSession()

      // Set up auth state change listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    } else {
      // If Supabase is not configured, set loading to false
      setLoading(false)
    }
  }, [supabase, isConfigured])

  // These functions will only work if Supabase is configured
  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: "Supabase is not configured" } }
    }
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string, userData: any) => {
    if (!supabase) {
      return { error: { message: "Supabase is not configured" } }
    }
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: userData },
    })
  }

  const signOut = async () => {
    if (!supabase) {
      return { error: { message: "Supabase is not configured" } }
    }
    return await supabase.auth.signOut()
  }

  const resetPassword = async (email: string, redirectTo: string) => {
    if (!supabase) {
      return { error: { message: "Supabase is not configured" } }
    }
    return await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isConfigured,
  }
}
