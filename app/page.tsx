"use client"

import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Clock, Users, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import MenuPage from "./menu/page"

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

 useEffect(() => {
  if (isAuthenticated) {
    if (user?.isAdmin) {
      router.push("/admin")
    } else {
      router.push("/menu") // change this!
    }
  }
}, [isAuthenticated, user, router])


  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
     

      <main >
        {/* Hero Section */}
        {/* <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Welcome to <span className="text-primary"> विद्युत कॅन्टीन</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Experience the future of canteen ordering with our modern management system. Quick, convenient, and
            delicious meals at your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

       */}

        {/* CTA Section */}

        <MenuPage/>
      </main>
    </div>
  )
}


// "use client"

// import { Navbar } from "@/components/layout/navbar"
// import MenuPage from "./menu/page"

// export default function HomePage() {
  
//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <MenuPage />
//       </main>
//     </div>
//   )
// }
