// "use client"

// import type React from "react"

// import { useAuth } from "@/hooks/use-auth"
// import { useRouter } from "next/navigation"
// import { useEffect } from "react"
// import { Loader2 } from "lucide-react"

// interface ProtectedRouteProps {
//   children: React.ReactNode
//   adminOnly?: boolean
// }

// export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
//   const { user, loading, isAuthenticated } = useAuth()
//   const router = useRouter()

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       router.push("/login")
//     }

//     if (!loading && isAuthenticated && adminOnly && !user?.isAdmin) {
//       router.push("/")
//     }
//   }, [loading, isAuthenticated, user, adminOnly, router])

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   if (!isAuthenticated) {
//     return null
//   }

//   if (adminOnly && !user?.isAdmin) {
//     return null
//   }

//   return <>{children}</>
// }


"use client"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
  requireAuth?: boolean   // <- use only for pages that always need login
}

export function ProtectedRoute({ children, adminOnly = false, requireAuth = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        // Always force login
        const redirectUrl = window.location.pathname
        router.push(`/login?redirect=${redirectUrl}`)
      } else if (adminOnly) {
        if (!isAuthenticated) {
          router.push("/login?redirect=/admin")
        } else if (!user?.isAdmin) {
          router.push("/") // normal users get blocked from admin
        }
      }
    }
  }, [loading, isAuthenticated, user, adminOnly, requireAuth, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if ((requireAuth && !isAuthenticated) || (adminOnly && (!isAuthenticated || !user?.isAdmin))) {
    return null
  }

  return <>{children}</>
}
