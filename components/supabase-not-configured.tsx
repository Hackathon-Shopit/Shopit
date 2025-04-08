import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function SupabaseNotConfigured() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Supabase Not Configured</AlertTitle>
        <AlertDescription>
          The Supabase environment variables are missing. Please make sure you have set:
          <ul className="list-disc pl-5 mt-2">
            <li>NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>You can set these variables in your .env.local file or in your deployment environment.</p>
        <p className="mt-2">
          If you're using Vercel, you can set these in your project settings under Environment Variables.
        </p>
      </div>
    </div>
  )
}
