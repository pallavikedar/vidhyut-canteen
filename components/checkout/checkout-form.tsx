"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Wallet, CreditCard, Clock, Calendar, Loader2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

import {
  databases,
  ORDERS_COLLECTION_ID,
  DATABASE_ID,
  ID,
  Permission,
  Role,
} from "@/lib/appwrite"

export function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState<string[]>([])
  const [paymentPeriod, setPaymentPeriod] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const { items, totalAmount, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // ✅ Loader until cart & user ready
  useEffect(() => {
    if (user !== undefined && items !== undefined) {
      const timer = setTimeout(() => setPageLoading(false), 500)
      return () => clearTimeout(timer)
    }
  }, [user, items])

  // ✅ Toggle checkbox handler
  const handleCheckboxChange = (list: string[], value: string, setFn: (val: string[]) => void) => {
    if (list.includes(value)) {
      setFn(list.filter((v) => v !== value))
    } else {
      setFn([...list, value])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || items.length === 0) {
      toast({
        title: !user ? "Authentication Error" : "Cart Empty",
        description: !user
          ? "Please log in to place an order"
          : "Add items before placing order",
        variant: "destructive",
      })
      return
    }

    if (paymentMethod.length === 0 && paymentPeriod.length === 0) {
      toast({
        title: "Select Payment Method or Period",
        description: "Choose at least one option to continue",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const itemsAsStrings = items.map(
        (item) => `${item.name} (${item.selectedSize}, ${item.quantity})`,
      )

      const orderData = {
        userId: user.$id,
        userName: user.name || "N/A",
        userPhone: user.phone || "N/A",
        userDesignation: user.designation || "N/A",
        items: itemsAsStrings,
        paymentMethod: paymentMethod.join(", ") || "N/A",
        paymentPeriod: paymentPeriod.join(", ") || "N/A",
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
        ],
      )

      clearCart()
      toast({
        title: "Order Placed!",
        description: `Order #${order.$id.slice(-6)} saved successfully.`,
      })
      setPaymentMethod([])
      setPaymentPeriod([])
      router.push("/orders")
    } catch (error: any) {
      console.error("Order submission error:", error)
      toast({
        title: "Order Failed",
        description: `Failed to place order: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // ✅ Page loader
  if (pageLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm text-gray-600">Loading checkout...</span>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <Button size="sm" onClick={() => router.push("/menu")}>
          Browse Menu
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Inline loader while placing order */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-4 flex items-center gap-2 shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Placing your order...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Order Summary */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="py-3">
            <CardTitle className="text-lg">Order Summary</CardTitle>
            <CardDescription className="text-sm">
              Review your items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {items.map((item) => (
              <div
                key={`${item.$id}-${item.selectedSize}`}
                className="flex justify-between"
              >
                <span>
                  {item.name} ({item.selectedSize}) × {item.quantity}
                </span>
                <span>
                  ₹
                  {(item.selectedSize === "half"
                    ? item.halfPrice
                    : item.fullPrice) * item.quantity}
                </span>
              </div>
            ))}
            <hr className="my-2 border-gray-300" />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <div className="space-y-4">
          {/* Payment Method */}
          <Card className="shadow-md border border-gray-200">
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Payment Method</CardTitle>
              <CardDescription className="text-sm">
                Select your payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer"
                onClick={() => handleCheckboxChange(paymentMethod, "cash", setPaymentMethod)}
              >
                <Checkbox
                  checked={paymentMethod.includes("cash")}
                  onCheckedChange={() => handleCheckboxChange(paymentMethod, "cash", setPaymentMethod)}
                   className="border-primary"
                />
                <Label className="flex-1 cursor-pointer flex items-center gap-2 text-sm">
                  <Wallet className="w-4 h-4 text-gray-600" /> Cash
                </Label>
              </div>
              <div
                className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer"
                onClick={() => handleCheckboxChange(paymentMethod, "online", setPaymentMethod)}
              >
                <Checkbox
                  checked={paymentMethod.includes("online")}
                  onCheckedChange={() => handleCheckboxChange(paymentMethod, "online", setPaymentMethod)}
                  className="border-primary"
                />
                <Label className="flex-1 cursor-pointer flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-gray-600" /> Online
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Payment Period */}
          <Card className="shadow-md border border-gray-200">
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Payment Period</CardTitle>
              <CardDescription className="text-sm">
                Select your payment periods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer"
                onClick={() => handleCheckboxChange(paymentPeriod, "daily", setPaymentPeriod)}
              >
                <Checkbox
                  checked={paymentPeriod.includes("daily")}
                  onCheckedChange={() => handleCheckboxChange(paymentPeriod, "daily", setPaymentPeriod)}
                   className="border-primary"
                />
                <Label className="flex-1 cursor-pointer flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-600" /> Daily
                </Label>
              </div>
              <div
                className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer"
                onClick={() => handleCheckboxChange(paymentPeriod, "weekly", setPaymentPeriod)}
              >
                <Checkbox
                  checked={paymentPeriod.includes("weekly")}
                  onCheckedChange={() => handleCheckboxChange(paymentPeriod, "weekly", setPaymentPeriod)}
                   className="border-primary"
                />
                <Label className="flex-1 cursor-pointer flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-600" /> Weekly
                </Label>
              </div>
              <div
                className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer"
                onClick={() => handleCheckboxChange(paymentPeriod, "monthly", setPaymentPeriod)}
              >
                <Checkbox
                  checked={paymentPeriod.includes("monthly")}
                  onCheckedChange={() => handleCheckboxChange(paymentPeriod, "monthly", setPaymentPeriod)}
                   className="border-primary"
                />
                <Label className="flex-1 cursor-pointer flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-600" /> Monthly
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Place Order Button */}
      <div className="sticky bottom-0 left-0 right-0 bg-white p-3 border-t mt-4">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={paymentMethod.length === 0 && paymentPeriod.length === 0}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
          ) : (
            `Place Order - ₹${totalAmount}`
          )}
        </Button>
      </div>
    </div>
  )
}

