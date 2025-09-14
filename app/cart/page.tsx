"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { CartProvider, useCart } from "@/hooks/use-cart"
import { CartItemComponent } from "@/components/cart/cart-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"

function CartContent() {
  const { items, totalAmount, totalItems, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some delicious items from our menu to get started!</p>
        <Link href="/menu">
          <Button>Browse Menu</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Cart Items ({totalItems})</h2>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
          >
            Clear Cart
          </Button>
        </div>

        {items.map((item) => (
          <CartItemComponent key={`${item.$id}-${item.selectedSize}`} item={item} />
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your order before checkout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge</span>
                <span>₹0</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full" size="lg">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/menu" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Navbar />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
              <p className="text-muted-foreground">Review and modify your order</p>
            </div>

            <CartContent />
          </main>
        </div>
      </CartProvider>
    </ProtectedRoute>
  )
}


