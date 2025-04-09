import { LoginForm } from "@/components/auth/login-form"
import { DebugEnv } from "@/components/debug-env"

export default function LoginPage() {
  return (
    <div className="w-full max-w-md p-4 space-y-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Shopit</h1>
        <p className="text-muted-foreground">Discover and manage local grocery stores</p>
      </div>
      <LoginForm />

      {/* Only show in development */}
      {process.env.NODE_ENV !== "production" && <DebugEnv />}
    </div>
  )
}
