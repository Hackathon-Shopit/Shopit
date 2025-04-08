"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface UserContextType {
  user: User | null
  loading: boolean
  favorites: string[]
  addFavorite: (storeId: string) => void
  removeFavorite: (storeId: string) => void
  isFavorite: (storeId: string) => boolean
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
  language: string
  setLanguage: (language: string) => void
  userProfile: {
    name: string
    email: string
    location: string
  }
  updateUserProfile: (profile: Partial<UserContextType["userProfile"]>) => void
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [language, setLanguage] = useState<string>("en")
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    location: "",
  })
  const router = useRouter()
  const supabase = createClient()

  // Check for session on mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)

        if (session?.user) {
          // Initialize user profile with email from auth
          setUserProfile((prev) => ({
            ...prev,
            email: session.user.email || "",
            name: session.user.user_metadata.full_name || "",
          }))

          // Load user preferences from database or localStorage
          loadUserPreferences(session.user.id)
        }
      } catch (error) {
        console.error("Error getting user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)

      if (session?.user) {
        // Initialize user profile with email from auth
        setUserProfile((prev) => ({
          ...prev,
          email: session.user.email || "",
          name: session.user.user_metadata.full_name || "",
        }))

        // Load user preferences
        loadUserPreferences(session.user.id)
      } else {
        // If user is logged out, redirect to login page
        router.push("/auth/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  // Load user preferences from localStorage (would be from Supabase in production)
  const loadUserPreferences = (userId: string) => {
    if (typeof window !== "undefined") {
      const savedFavorites = localStorage.getItem(`favorites-${userId}`)
      const savedTheme = localStorage.getItem(`theme-${userId}`)
      const savedLanguage = localStorage.getItem(`language-${userId}`)
      const savedUserProfile = localStorage.getItem(`userProfile-${userId}`)

      if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
      if (savedTheme) setTheme(JSON.parse(savedTheme))
      if (savedLanguage) setLanguage(JSON.parse(savedLanguage))
      if (savedUserProfile) setUserProfile((prev) => ({ ...prev, ...JSON.parse(savedUserProfile) }))
    }
  }

  // Save data to localStorage when it changes (would save to Supabase in production)
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      localStorage.setItem(`favorites-${user.id}`, JSON.stringify(favorites))
      localStorage.setItem(`theme-${user.id}`, JSON.stringify(theme))
      localStorage.setItem(`language-${user.id}`, JSON.stringify(language))
      localStorage.setItem(`userProfile-${user.id}`, JSON.stringify(userProfile))
    }
  }, [favorites, theme, language, userProfile, user])

  const addFavorite = (storeId: string) => {
    setFavorites((prev) => [...prev, storeId])
  }

  const removeFavorite = (storeId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== storeId))
  }

  const isFavorite = (storeId: string) => {
    return favorites.includes(storeId)
  }

  const updateUserProfile = (profile: Partial<UserContextType["userProfile"]>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }))
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        theme,
        setTheme,
        language,
        setLanguage,
        userProfile,
        updateUserProfile,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
