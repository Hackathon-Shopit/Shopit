import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function OpenAINotConfigured() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>OpenAI API Not Configured</AlertTitle>
        <AlertDescription>
          The OpenAI API key is missing. Please make sure you have set:
          <ul className="list-disc pl-5 mt-2">
            <li>OPENAI_API_KEY</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>You can set this variable in your .env.local file or in your deployment environment.</p>
        <p className="mt-2">
          If you're using Vercel, you can set this in your project settings under Environment Variables.
        </p>
      </div>
    </div>
  )
}
