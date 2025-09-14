"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { MenuGrid } from "@/components/menu/menu-grid"
import { CartProvider } from "@/hooks/use-cart"

export default function MenuPage() {
  return (
    <ProtectedRoute>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Navbar />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Menu</h1>
              <p className="text-muted-foreground">Choose from our delicious selection of freshly prepared meals</p>
            </div>

            <MenuGrid />
          </main>
        </div>
      </CartProvider>
    </ProtectedRoute>
  )
}
