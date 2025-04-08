"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/env"

type SupabaseContext = {
  supabase: SupabaseClient | null
  isConfigured: boolean
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SupabaseContext>(() => {
    // Only create the client if the environment variables are set
    if (isSupabaseConfigured) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      return { supabase, isConfigured: true }
    }

    // Otherwise return null client
    return { supabase: null, isConfigured: false }
  })

  // Set up auth listener only if Supabase is configured
  useEffect(() => {
    if (state.supabase) {
      const {
        data: { subscription },
      } = state.supabase.auth.onAuthStateChange(() => {})

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [state.supabase])

  // Log warning if Supabase is not configured
  useEffect(() => {
    if (!state.isConfigured) {
      console.warn(
        "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
      )
    }
  }, [state.isConfigured])

  return <Context.Provider value={state}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
