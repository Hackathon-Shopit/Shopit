"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugEnv() {
  const [showEnv, setShowEnv] = useState(false)

  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set (value hidden)" : "Not set",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "Set (value hidden)" : "Not set",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables Debug</CardTitle>
        <CardDescription>Check if your environment variables are properly set</CardDescription>
      </CardHeader>
      <CardContent>
        {showEnv ? (
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-mono">{key}</span>
                <span className={value === "Not set" ? "text-red-500" : "text-green-500"}>{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>Click the button below to check your environment variables.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => setShowEnv(!showEnv)}>
          {showEnv ? "Hide Environment Variables" : "Check Environment Variables"}
        </Button>
      </CardFooter>
    </Card>
  )
}
