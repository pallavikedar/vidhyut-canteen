"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { CartContent } from "@/app/cart/page"
import { Navbar } from "@/components/layout/navbar"
import { MenuGrid } from "@/components/menu/menu-grid"
import { CartProvider } from "@/hooks/use-cart"
import { useCart } from "@/hooks/use-cart"
// import { CartItem } from '@/components/cart/cart-item'

export default function MenuPage() {
   const { items } = useCart()
  return (
    <ProtectedRoute>
      <CartProvider>
        <div className="min-h-screen bg-background -mt-7">
          

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            

            <MenuGrid />
            <CartContent />
            
           

          </main>
        </div>
      </CartProvider>
    </ProtectedRoute>
  )
}
