// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import type { Order } from "@/lib/orders"
// import { orderService } from "@/lib/orders"
// import { useAuth } from "@/hooks/use-auth"
// import { Clock, CheckCircle, Package, Truck, XCircle } from "lucide-react"

// export function OrderTracking() {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(true)
//   const { user } = useAuth()

//   useEffect(() => {
//     if (user) {
//       loadUserOrders()
//     }
//   }, [user])

//   const loadUserOrders = async () => {
//     if (!user) return

//     try {
//       const userOrders = await orderService.getUserOrders(user.$id)
//       setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
//     } catch (error) {
//       console.error("Failed to load user orders:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getStatusIcon = (status: Order["status"]) => {
//     switch (status) {
//       case "pending":
//         return <Clock className="h-4 w-4" />
//       case "confirmed":
//         return <CheckCircle className="h-4 w-4" />
//       case "preparing":
//         return <Package className="h-4 w-4" />
//       case "ready":
//         return <Truck className="h-4 w-4" />
//       case "delivered":
//         return <CheckCircle className="h-4 w-4" />
//       case "cancelled":
//         return <XCircle className="h-4 w-4" />
//       default:
//         return <Clock className="h-4 w-4" />
//     }
//   }

//   const getStatusColor = (status: Order["status"]) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200"
//       case "confirmed":
//         return "bg-blue-100 text-blue-800 border-blue-200"
//       case "preparing":
//         return "bg-orange-100 text-orange-800 border-orange-200"
//       case "ready":
//         return "bg-green-100 text-green-800 border-green-200"
//       case "delivered":
//         return "bg-gray-100 text-gray-800 border-gray-200"
//       case "cancelled":
//         return "bg-red-100 text-red-800 border-red-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   if (loading) {
//     return (
//       <div className="space-y-4">
//         {[...Array(3)].map((_, i) => (
//           <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
//         ))}
//       </div>
//     )
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//         <h3 className="text-xl font-semibold text-foreground mb-2">No Orders Yet</h3>
//         <p className="text-muted-foreground mb-6">You haven't placed any orders. Start exploring our menu!</p>
//         <Button>Browse Menu</Button>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       {orders.map((order) => (
//         <Card key={order.$id}>
//           <CardHeader>
//             <div className="flex justify-between items-start">
//               <div>
//                 <CardTitle className="flex items-center gap-2">
//                   {getStatusIcon(order.status)}
//                   Order #{order.$id.slice(-6)}
//                 </CardTitle>
//                 <CardDescription>{formatDate(order.createdAt)}</CardDescription>
//               </div>
//               <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {/* Order Items */}
//               <div>
//                 <h4 className="font-semibold mb-2">Items Ordered</h4>
//                 <div className="space-y-2">
//                   {order.items.map((item, index) => (
//                     <div key={index} className="flex justify-between items-center text-sm">
//                       <span>
//                         {item.name} ({item.selectedSize}) × {item.quantity}
//                       </span>
//                       <span className="font-medium">₹{item.totalPrice}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Order Summary */}
//               <div className="flex justify-between items-center pt-2 border-t">
//                 <div className="text-sm text-muted-foreground">
//                   Payment: {order.paymentMethod} ({order.paymentPeriod})
//                 </div>
//                 <div className="font-semibold text-lg text-primary">Total: ₹{order.totalAmount}</div>
//               </div>

//               {/* Order Status Progress */}
//               <div className="pt-2 border-t">
//                 <div className="flex items-center justify-between text-xs text-muted-foreground">
//                   <span className={order.status === "pending" ? "text-primary font-medium" : ""}>Pending</span>
//                   <span className={order.status === "confirmed" ? "text-primary font-medium" : ""}>Confirmed</span>
//                   <span className={order.status === "preparing" ? "text-primary font-medium" : ""}>Preparing</span>
//                   <span className={order.status === "ready" ? "text-primary font-medium" : ""}>Ready</span>
//                   <span className={order.status === "delivered" ? "text-primary font-medium" : ""}>Delivered</span>
//                 </div>
//                 <div className="w-full bg-muted rounded-full h-2 mt-2">
//                   <div
//                     className="bg-primary h-2 rounded-full transition-all duration-300"
//                     style={{
//                       width: `${
//                         order.status === "pending"
//                           ? "20%"
//                           : order.status === "confirmed"
//                             ? "40%"
//                             : order.status === "preparing"
//                               ? "60%"
//                               : order.status === "ready"
//                                 ? "80%"
//                                 : order.status === "delivered"
//                                   ? "100%"
//                                   : "0%"
//                       }`,
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { orderService, Order } from "@/lib/orders"
import { useAuth } from "@/hooks/use-auth"
import { Clock, CheckCircle, Package, Truck, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function OrderTracking() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      loadUserOrders()
    }
  }, [user])

  const loadUserOrders = async () => {
    if (!user) return

    setLoading(true)
    try {
      const userOrders = await orderService.getUserOrders(user.$id)
      setOrders(userOrders.sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()))
    } catch (error) {
      console.error("Failed to load user orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />
      case "confirmed": return <CheckCircle className="h-4 w-4" />
      case "preparing": return <Package className="h-4 w-4" />
      case "ready": return <Truck className="h-4 w-4" />
      case "delivered": return <CheckCircle className="h-4 w-4" />
      case "cancelled": return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200"
      case "preparing": return "bg-orange-100 text-orange-800 border-orange-200"
      case "ready": return "bg-green-100 text-green-800 border-green-200"
      case "delivered": return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No Orders Yet</h3>
        <p className="text-muted-foreground mb-6">You haven't placed any orders. Start exploring our menu!</p>
        <Button onClick={() => router.push("/menu")}>Browse Menu</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.$id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  Order #{order.$id.slice(-6)}
                </CardTitle>
                <CardDescription>{formatDate(order.$createdAt)}</CardDescription>
              </div>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            </div>
          </CardHeader>

          <CardContent>
            {/* Items */}
            <div className="space-y-2 mb-2">
              <h4 className="font-semibold text-sm">Items Ordered:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} ({item.selectedSize}) × {item.quantity}</span>
                  <span className="font-medium">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>

            {/* Payment & Total */}
            <div className="flex justify-between items-center pt-2 border-t mb-2">
              <div className="text-sm text-muted-foreground">
                Payment: {order.paymentMethod} ({order.paymentPeriod})
              </div>
              <div className="font-semibold text-lg text-primary">Total: ₹{order.totalAmount}</div>
            </div>

            {/* Status Progress Bar */}
            <div className="pt-2 border-t">
              <div className="flex justify-between text-xs text-muted-foreground">
                {["pending","confirmed","preparing","ready","delivered"].map((statusLabel) => (
                  <span key={statusLabel} className={order.status === statusLabel ? "text-primary font-medium" : ""}>{statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}</span>
                ))}
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: getProgressWidth(order.status) }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  function getProgressWidth(status: Order["status"]) {
    switch (status) {
      case "pending": return "20%"
      case "confirmed": return "40%"
      case "preparing": return "60%"
      case "ready": return "80%"
      case "delivered": return "100%"
      default: return "0%"
    }
  }
}
