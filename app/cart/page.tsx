// "use client"

// import { ProtectedRoute } from "@/components/auth/protected-route"
// import { Navbar } from "@/components/layout/navbar"
// import { CartProvider, useCart } from "@/hooks/use-cart"
// import { CartItemComponent } from "@/components/cart/cart-item"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { ShoppingCart, ArrowRight } from "lucide-react"
// import Link from "next/link"

// function CartContent() {
//   const { items, totalAmount, totalItems, clearCart } = useCart()

//   if (items.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//         <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
//         <p className="text-muted-foreground mb-6">Add some delicious items from our menu to get started!</p>
//         <Link href="/menu">
//           <Button>Browse Menu</Button>
//         </Link>
//       </div>
//     )
//   }

//   return (
//     <div className="grid lg:grid-cols-3 gap-8">
//       {/* Cart Items */}
//       <div className="lg:col-span-2 space-y-4">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Cart Items ({totalItems})</h2>
//           <Button
//             variant="outline"
//             onClick={clearCart}
//             className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
//           >
//             Clear Cart
//           </Button>
//         </div>

//         {items.map((item) => (
//           <CartItemComponent key={`${item.$id}-${item.selectedSize}`} item={item} />
//         ))}
//       </div>

//       {/* Order Summary */}
//       <div className="lg:col-span-1">
//         <Card className="sticky top-4">
//           <CardHeader>
//             <CardTitle>Order Summary</CardTitle>
//             <CardDescription>Review your order before checkout</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span>Subtotal ({totalItems} items)</span>
//                 <span>₹{totalAmount}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Service Charge</span>
//                 <span>₹0</span>
//               </div>
//               <div className="border-t pt-2">
//                 <div className="flex justify-between font-semibold text-lg">
//                   <span>Total</span>
//                   <span className="text-primary">₹{totalAmount}</span>
//                 </div>
//               </div>
//             </div>

//             <Link href="/checkout" className="block">
//               <Button className="w-full" size="lg">
//                 Proceed to Checkout
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </Link>

//             <Link href="/menu" className="block">
//               <Button variant="outline" className="w-full bg-transparent">
//                 Continue Shopping
//               </Button>
//             </Link>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default function CartPage() {
//   return (
//     <ProtectedRoute>
//       <CartProvider>
//         <div className="min-h-screen bg-background">
//           <Navbar />

//           <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <div className="mb-8">
//               <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
//               <p className="text-muted-foreground">Review and modify your order</p>
//             </div>

//             <CartContent />
//           </main>
//         </div>
//       </CartProvider>
//     </ProtectedRoute>
//   )
// }

"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { CartProvider, useCart } from "@/hooks/use-cart"
import { CartItemComponent } from "@/components/cart/cart-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export function CartContent() {
  const { items, totalAmount, totalItems, clearCart } = useCart()
  const [loading, setLoading] = useState(true)
  const { user  } = useAuth() // get logged-in user state
  const router = useRouter()


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground">Loading your cart...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10 px-3">
        
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
          Add some delicious items
        </h2>
    
        <Link href="/">
          <Button className="w-full sm:w-auto">Browse Menu</Button>
        </Link>
      </div>
    )
  }
  // const handlePlaceOrder = () => {
  //   if (!user ) {
  //     router.push("/login") // redirect to login if not logged in
  //   } else {
  //     router.push("/checkout") // otherwise go to checkout
  //   }
  // }
  const handlePlaceOrder = () => {
  if (!user) {
    localStorage.setItem("redirectAfterLogin", "/checkout")
    router.push("/login") // redirect to login if not logged in
  } else {
    router.push("/checkout") // otherwise go to checkout
  }
}
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4 pb-30 mt-10">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">
            Cart Items ({totalItems})
          </h2>
          <Button
            variant="outline"
            onClick={clearCart}
            className="w-full sm:w-auto text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
          >
            Clear items
          </Button>
        </div>
        
        {items.map((item) => (
          <CartItemComponent
            key={`${item.$id}-${item.selectedSize}`}
            item={item}
           
          />
        ))}
        
      </div>

      <div className="lg:col-span-1 fixed bottom-0 left-0 w-full z-50">
        <Card className="sticky top-4">
         
          <CardContent className="space-y-4 text-sm sm:text-base">
            <div className="space-y-2">
             
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-base sm:text-lg ">
                  <span>Total Order Amount </span>
                  <span>=</span>
                  <span className="text-primary">₹{totalAmount}/-</span>
                </div>
              </div>
            </div>

         
              <Button className="w-full mb-5 " size="sm"  onClick={handlePlaceOrder}>
               Placed Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            

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

          <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
            <div className="mb-6 text-center sm:text-left">
              <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-2">
                Shopping Cart
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Review and modify your order
              </p>
            </div>

            <CartContent />
          </main>
        </div>
      </CartProvider>
    </ProtectedRoute>
  )
}
