"use client"

import { RegisterForm } from "@/components/auth/register-form"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.isAdmin) {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }
  }, [isAuthenticated, loading, user, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Vidyut Canteen</h1>
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
