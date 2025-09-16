"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { CartProvider } from "@/hooks/use-cart"
import { CheckoutForm } from "@/components/checkout/checkout-form"


export default function CheckoutPage({ params }: { params: { itemId: string } }) {
  return (
    <ProtectedRoute>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Navbar />

          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
              <p className="text-muted-foreground">Complete your order and choose payment options</p>
            </div>

            <CheckoutForm />
          </main>
        </div>
      </CartProvider>
    </ProtectedRoute>
  )
}
