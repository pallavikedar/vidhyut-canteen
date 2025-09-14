// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"
// import { useCart } from "@/hooks/use-cart"
// import { useAuth } from "@/hooks/use-auth"
// import { orderService } from "@/lib/orders"
// import { CreditCard, Wallet, Calendar, Clock, Loader2 } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { useRouter } from "next/navigation"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// export function CheckoutForm() {
//   const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash")
//   const [paymentPeriod, setPaymentPeriod] = useState<"daily" | "weekly" | "monthly">("daily")
//   const [loading, setLoading] = useState(false)
//   const [orderPlaced, setOrderPlaced] = useState(false)
//   const [placedOrderId, setPlacedOrderId] = useState("")

//   const { items, totalAmount, clearCart } = useCart()
//   const { user } = useAuth()
//   const { toast } = useToast()
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!user || items.length === 0) return

//     setLoading(true)
//     try {
//       const order = await orderService.placeOrder(user.$id, user.name, user.phone, items, paymentMethod, paymentPeriod)

//       setPlacedOrderId(order.$id)
//       setOrderPlaced(true)
//       clearCart()

//       toast({
//         title: "Order Placed Successfully!",
//         description: `Your order #${order.$id.slice(-6)} has been placed.`,
//       })
//     } catch (error) {
//       toast({
//         title: "Order Failed",
//         description: "Failed to place order. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleOrderSuccess = () => {
//     setOrderPlaced(false)
//     router.push("/orders")
//   }

//   const getPeriodMultiplier = () => {
//     switch (paymentPeriod) {
//       case "weekly":
//         return 7
//       case "monthly":
//         return 30
//       default:
//         return 1
//     }
//   }

//   const getTotalWithPeriod = () => {
//     return totalAmount * getPeriodMultiplier()
//   }

//   if (items.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
//         <p className="text-muted-foreground mb-6">Add some items to your cart before checkout</p>
//         <Button onClick={() => router.push("/menu")}>Browse Menu</Button>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="grid lg:grid-cols-2 gap-8">
//         {/* Order Summary */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Order Summary</CardTitle>
//             <CardDescription>Review your items before placing the order</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {items.map((item) => (
//               <div key={`${item.$id}-${item.selectedSize}`} className="flex justify-between items-center">
//                 <div>
//                   <h4 className="font-medium">{item.name}</h4>
//                   <p className="text-sm text-muted-foreground">
//                     {item.selectedSize} × {item.quantity}
//                   </p>
//                 </div>
//                 <span className="font-semibold">
//                   ₹{(item.selectedSize === "half" ? item.halfPrice : item.fullPrice) * item.quantity}
//                 </span>
//               </div>
//             ))}

//             <Separator />

//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>₹{totalAmount}</span>
//               </div>
//               {paymentPeriod !== "daily" && (
//                 <div className="flex justify-between text-sm text-muted-foreground">
//                   <span>Period ({paymentPeriod})</span>
//                   <span>× {getPeriodMultiplier()} days</span>
//                 </div>
//               )}
//               <div className="flex justify-between font-semibold text-lg">
//                 <span>Total</span>
//                 <span className="text-primary">₹{getTotalWithPeriod()}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Payment Options */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Payment & Delivery</CardTitle>
//             <CardDescription>Choose your payment method and period</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Payment Method */}
//               <div className="space-y-3">
//                 <Label className="text-base font-semibold">Payment Method</Label>
//                 <RadioGroup value={paymentMethod} onValueChange={(value: "cash" | "online") => setPaymentMethod(value)}>
//                   <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
//                     <RadioGroupItem value="cash" id="cash" />
//                     <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
//                       <Wallet className="h-4 w-4" />
//                       <div>
//                         <div className="font-medium">Cash Payment</div>
//                         <div className="text-sm text-muted-foreground">Pay when you collect your order</div>
//                       </div>
//                     </Label>
//                     <Badge variant="secondary">Recommended</Badge>
//                   </div>

//                   <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
//                     <RadioGroupItem value="online" id="online" />
//                     <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer flex-1">
//                       <CreditCard className="h-4 w-4" />
//                       <div>
//                         <div className="font-medium">Online Payment</div>
//                         <div className="text-sm text-muted-foreground">Pay now using UPI/Card</div>
//                       </div>
//                     </Label>
//                     <Badge variant="outline">Coming Soon</Badge>
//                   </div>
//                 </RadioGroup>
//               </div>

//               {/* Payment Period */}
//               <div className="space-y-3">
//                 <Label className="text-base font-semibold">Payment Period</Label>
//                 <Select
//                   value={paymentPeriod}
//                   onValueChange={(value: "daily" | "weekly" | "monthly") => setPaymentPeriod(value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="daily">
//                       <div className="flex items-center gap-2">
//                         <Clock className="h-4 w-4" />
//                         <div>
//                           <div>Daily</div>
//                           <div className="text-xs text-muted-foreground">Pay for today only</div>
//                         </div>
//                       </div>
//                     </SelectItem>
//                     <SelectItem value="weekly">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         <div>
//                           <div>Weekly</div>
//                           <div className="text-xs text-muted-foreground">7 days subscription</div>
//                         </div>
//                       </div>
//                     </SelectItem>
//                     <SelectItem value="monthly">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         <div>
//                           <div>Monthly</div>
//                           <div className="text-xs text-muted-foreground">30 days subscription</div>
//                         </div>
//                       </div>
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>

//                 {paymentPeriod !== "daily" && (
//                   <div className="p-3 bg-muted rounded-lg">
//                     <p className="text-sm text-muted-foreground">
//                       You'll receive the same meal {paymentPeriod === "weekly" ? "for 7 days" : "for 30 days"}. Total
//                       amount: ₹{getTotalWithPeriod()}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Customer Info */}
//               <div className="space-y-3">
//                 <Label className="text-base font-semibold">Delivery Information</Label>
//                 <div className="p-3 bg-muted rounded-lg space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-sm">Name:</span>
//                     <span className="text-sm font-medium">{user?.name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm">Phone:</span>
//                     <span className="text-sm font-medium">{user?.phone}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm">Designation:</span>
//                     <span className="text-sm font-medium">{user?.designation}</span>
//                   </div>
//                 </div>
//               </div>

//               <Button type="submit" className="w-full" size="lg" disabled={loading || paymentMethod === "online"}>
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Placing Order...
//                   </>
//                 ) : (
//                   `Place Order - ₹${getTotalWithPeriod()}`
//                 )}
//               </Button>

//               {paymentMethod === "online" && (
//                 <p className="text-sm text-muted-foreground text-center">
//                   Online payment is coming soon. Please use cash payment for now.
//                 </p>
//               )}
//             </form>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Order Success Dialog */}
//       <Dialog open={orderPlaced} onOpenChange={setOrderPlaced}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-center text-green-600">Order Placed Successfully! 🎉</DialogTitle>
//             <DialogDescription className="text-center">
//               Your order #{placedOrderId.slice(-6)} has been placed successfully.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="text-center p-4 bg-green-50 rounded-lg">
//               <p className="text-sm text-green-800">
//                 You will receive a confirmation shortly. You can track your order status in the Orders section.
//               </p>
//             </div>
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={() => router.push("/menu")} className="flex-1 bg-transparent">
//                 Order More
//               </Button>
//               <Button onClick={handleOrderSuccess} className="flex-1">
//                 Track Order
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Wallet, CreditCard, Clock, Calendar, Loader2 } from "lucide-react"
// import { useCart } from "@/hooks/use-cart"
// import { useAuth } from "@/hooks/use-auth"
// import { useToast } from "@/hooks/use-toast"
// import { useRouter } from "next/navigation"
// import { orderService } from "@/lib/orders"

// export function CheckoutForm() {
//   const [paymentMethod, setPaymentMethod] = useState<"cash" | "online" | "">("")
//   const [paymentPeriod, setPaymentPeriod] = useState<"daily" | "weekly" | "monthly" | "">("")
//   const [loading, setLoading] = useState(false)

//   const { items, totalAmount, clearCart } = useCart()
//   const { user } = useAuth()
//   const { toast } = useToast()
//   const router = useRouter()
// const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!user || items.length === 0) {
//       toast({
//         title: "Cart Empty",
//         description: "Please add items to your cart before placing an order",
//         variant: "destructive",
//       })
//       return
//     }
//     if (!paymentMethod) {
//       toast({
//         title: "Select Payment Method",
//         description: "Please select a payment method",
//         variant: "destructive",
//       })
//       return
//     }

//     setLoading(true)

//     try {
//       // Generate order object
//       const order = {
//         id: Date.now().toString(),
//         user: {
//           id: user.$id,
//           name: user.name,
//           phone: user.phone,
//           designation: user.designation,
//         },
//         items,
//         paymentMethod,
//         paymentPeriod: paymentPeriod || "N/A",
//         totalAmount,
//         createdAt: new Date().toISOString(),
//       }

//       // Store orders in localStorage
//       const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
//       localStorage.setItem("orders", JSON.stringify([...existingOrders, order]))

//       // Clear cart
//       clearCart()

//       toast({
//         title: "Order Placed Successfully",
//         description: `Order #${order.id.slice(-6)} saved locally!`,
//       })

//       // Reset selections
//       setPaymentMethod("")
//       setPaymentPeriod("")
//       router.push("/orders")
//     } catch (error) {
//       console.error(error)
//       toast({
//         title: "Order Failed",
//         description: "Something went wrong while placing your order",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }


//   if (items.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-semibold">Your cart is empty</h2>
//         <Button onClick={() => router.push("/menu")}>Browse Menu</Button>
//       </div>
//     )
//   }

//   return (
//     <div className="grid lg:grid-cols-2 gap-6">
//       {/* Order Summary */}
//       <Card className="shadow-lg border border-gray-200">
//         <CardHeader>
//           <CardTitle>Order Summary</CardTitle>
//           <CardDescription>Review your items before placing the order</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           {items.map((item) => (
//             <div key={`${item.$id}-${item.selectedSize}`} className="flex justify-between py-1">
//               <span>{item.name} ({item.selectedSize}) × {item.quantity}</span>
//               <span>₹{(item.selectedSize === "half" ? item.halfPrice : item.fullPrice) * item.quantity}</span>
//             </div>
//           ))}
//           <hr className="my-2 border-gray-300" />
//           <div className="flex justify-between font-semibold text-lg">
//             <span>Total</span>
//             <span>₹{totalAmount}</span>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Payment Options */}
//       <div className="space-y-6">
//         {/* Payment Method */}
//         <Card className="shadow-lg border border-gray-200">
//           <CardHeader>
//             <CardTitle>Payment Method</CardTitle>
//             <CardDescription>Select your payment method</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as "cash" | "online")}>
//               <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
//                 <RadioGroupItem value="cash" id="cash" className="w-5 h-5 border-gray-400" />
//                 <Label htmlFor="cash" className="flex-1 cursor-pointer flex items-center gap-2">
//                   <Wallet className="w-5 h-5 text-gray-600" /> Cash Payment
//                 </Label>
//               </div>
//               <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
//                 <RadioGroupItem value="online" id="online" className="w-5 h-5 border-gray-400" />
//                 <Label htmlFor="online" className="flex-1 cursor-pointer flex items-center gap-2">
//                   <CreditCard className="w-5 h-5 text-gray-600" /> Online Payment
//                 </Label>
//               </div>
//             </RadioGroup>
//           </CardContent>
//         </Card>

//         {/* Payment Period */}
//         <Card className="shadow-lg border border-gray-200">
//           <CardHeader>
//             <CardTitle>Payment Period</CardTitle>
//             <CardDescription>Select how often you want to pay</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <RadioGroup value={paymentPeriod} onValueChange={(val) => setPaymentPeriod(val as "daily" | "weekly" | "monthly")}>
//               <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
//                 <RadioGroupItem value="daily" id="daily" className="w-5 h-5 border-gray-400" />
//                 <Label htmlFor="daily" className="flex-1 cursor-pointer flex items-center gap-2">
//                   <Clock className="w-5 h-5 text-gray-600" /> Daily
//                 </Label>
//               </div>
//               <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
//                 <RadioGroupItem value="weekly" id="weekly" className="w-5 h-5 border-gray-400" />
//                 <Label htmlFor="weekly" className="flex-1 cursor-pointer flex items-center gap-2">
//                   <Calendar className="w-5 h-5 text-gray-600" /> Weekly
//                 </Label>
//               </div>
//               <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
//                 <RadioGroupItem value="monthly" id="monthly" className="w-5 h-5 border-gray-400" />
//                 <Label htmlFor="monthly" className="flex-1 cursor-pointer flex items-center gap-2">
//                   <Calendar className="w-5 h-5 text-gray-600" /> Monthly
//                 </Label>
//               </div>
//             </RadioGroup>
//           </CardContent>

//           <Button
//   className="w-full mt-4"
//   onClick={handleSubmit}
//   disabled={
//     !paymentMethod || (paymentMethod === "online" && !paymentPeriod) || loading
//   }
// >
//   {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> : `Place Order - ₹${totalAmount}`}
// </Button>

//         </Card>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Wallet, CreditCard, Clock, Calendar, Loader2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { databases, ORDERS_COLLECTION_ID, DATABASE_ID, ID, Permission, Role } from "@/lib/appwrite"

export function CheckoutForm() {
const [paymentMethod, setPaymentMethod] = useState<"cash" | "online" | "">("")
  const [paymentPeriod, setPaymentPeriod] = useState<"daily" | "weekly" | "monthly" | "">("")
  const [loading, setLoading] = useState(false)

  const { items, totalAmount, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || items.length === 0) {
      toast({
        title: !user ? "Authentication Error" : "Cart Empty",
        description: !user ? "Please log in to place an order" : "Add items before placing order",
        variant: "destructive",
      })
      return
    }

    if (!paymentMethod) {
      toast({ title: "Select Payment Method", description: "Choose cash or online", variant: "destructive" })
      return
    }

    if (paymentMethod === "online" && !paymentPeriod) {
      toast({ title: "Select Payment Period", description: "Choose daily, weekly, or monthly", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      // Transform items into an array of strings
      const itemsAsStrings = items.map(item => 
        `${item.name} (${item.selectedSize}, ${item.quantity})`
      )
      console.log("Submitting order:", { 
        userId: user.$id, 
        items: itemsAsStrings, 
        paymentMethod, 
        paymentPeriod 
      }) // Debug

      const orderData = {
        userId: user.$id,
        userName: user.name || "N/A",
        userPhone: user.phone || "N/A",
        userDesignation: user.designation || "N/A",
        items: itemsAsStrings, // Pass items as an array of strings
        paymentMethod,
        paymentPeriod: paymentPeriod || "N/A",
        totalAmount,
      }

      const order = await databases.createDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        ID.unique(),
        orderData,
        [
          Permission.read(Role.users()),
          Permission.write(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      )

      clearCart() // Clear cart only after successful order
      toast({ title: "Order Placed!", description: `Order #${order.$id.slice(-6)} saved successfully.` })
      setPaymentMethod("")
      setPaymentPeriod("")
      router.push("/orders")
    } catch (error: any) {
      console.error("Order submission error:", error, { code: error.code, message: error.message })
      toast({
        title: "Order Failed",
        description: `Failed to place order: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <Button onClick={() => router.push("/menu")}>Browse Menu</Button>
      </div>
    )
  }

 

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Order Summary */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Review your items before placing the order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((item) => (
            <div key={`${item.$id}-${item.selectedSize}`} className="flex justify-between py-1">
              <span>
                {item.name} ({item.selectedSize}) × {item.quantity}
              </span>
              <span>₹{(item.selectedSize === "half" ? item.halfPrice : item.fullPrice) * item.quantity}</span>
            </div>
          ))}
          <hr className="my-2 border-gray-300" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Options */}
      <div className="space-y-6">
        {/* Payment Method */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Select your payment method</CardDescription>
          </CardHeader>
         <CardContent className="space-y-3">
             <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as "cash" | "online")}>
               <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                 <RadioGroupItem value="cash" id="cash" className="w-5 h-5 border-gray-400" />
                 <Label htmlFor="cash" className="flex-1 cursor-pointer flex items-center gap-2">
                   <Wallet className="w-5 h-5 text-gray-600" /> Cash Payment
                 </Label>
              </div>
               <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                 <RadioGroupItem value="online" id="online" className="w-5 h-5 border-gray-400" />
                 <Label htmlFor="online" className="flex-1 cursor-pointer flex items-center gap-2">
                   <CreditCard className="w-5 h-5 text-gray-600" /> Online Payment
                 </Label>
               </div>
             </RadioGroup>
           </CardContent>
        </Card>

        {/* Payment Period */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle>Payment Period</CardTitle>
            <CardDescription>Select how often you want to pay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <RadioGroup
              value={paymentPeriod}
              onValueChange={(val) => setPaymentPeriod(val as "daily" | "weekly" | "monthly")}
              className="space-y-2"
            >
              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="daily" id="daily" className="w-5 h-5 border-gray-400" />
                <Label htmlFor="daily" className="flex-1 cursor-pointer flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" /> Daily
                </Label>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="weekly" id="weekly" className="w-5 h-5 border-gray-400" />
                <Label htmlFor="weekly" className="flex-1 cursor-pointer flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" /> Weekly
                </Label>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="monthly" id="monthly" className="w-5 h-5 border-gray-400" />
                <Label htmlFor="monthly" className="flex-1 cursor-pointer flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" /> Monthly
                </Label>
              </div>
            </RadioGroup>
            {paymentPeriod && paymentPeriod !== "daily" && (
              <p className="text-sm text-gray-500 mt-2">
                You'll receive the same meal {paymentPeriod === "weekly" ? "for 7 days" : "for 30 days"}.
              </p>
            )}
          </CardContent>

          <Button
            className="w-full mt-4"
            onClick={handleSubmit}
            disabled={!paymentMethod || (paymentMethod === "online" && !paymentPeriod) || loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
            ) : (
              `Place Order - ₹${totalAmount}`
            )}
          </Button>
        </Card>
      </div>
    </div>
  )
}