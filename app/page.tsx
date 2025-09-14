"use client"

import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Clock, Users, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.isAdmin) {
        router.push("/admin")
      } else {
        router.push("/menu")
      }
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Welcome to <span className="text-primary">Vidyut Canteen</span>
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

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <ChefHat className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Fresh & Delicious</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Freshly prepared meals with authentic flavors and quality ingredients</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Quick Service</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Fast ordering system with real-time order tracking and notifications</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>For Everyone</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Serving students, faculty, and staff with personalized experiences</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Star className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Quality Service</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Committed to excellence in food quality and customer satisfaction</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-card rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-card-foreground mb-4">Ready to Order?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join hundreds of satisfied customers who enjoy our convenient ordering system. Register now and start
            exploring our delicious menu options.
          </p>
          <Link href="/register">
            <Button size="lg">Create Your Account</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
