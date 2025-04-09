import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Shopit</h1>
        <p className="text-muted-foreground">Discover and manage local grocery stores</p>
      </div>
      <RegisterForm />
    </div>
  )
}
