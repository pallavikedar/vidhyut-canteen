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
            

            <MenuGrid />
          </main>
        </div>
      </CartProvider>
    </ProtectedRoute>
  )
}
