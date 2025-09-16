// "use client"

// import type React from "react"

// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import type { CartItem } from "@/lib/menu"
// import { useCart } from "@/hooks/use-cart"
// import { Plus, Minus, Trash2 } from "lucide-react"

// interface CartItemProps {
//   item: CartItem
// }

// export function CartItemComponent({ item }: CartItemProps) {
//   const { updateQuantity, removeFromCart } = useCart()

//   const currentPrice = item.selectedSize === "half" ? item.halfPrice : item.fullPrice
//   const totalPrice = currentPrice * item.quantity

//   const incrementQuantity = () => {
//     updateQuantity(item.$id, item.selectedSize, item.quantity + 1)
//   }

//   const decrementQuantity = () => {
//     updateQuantity(item.$id, item.selectedSize, item.quantity - 1)
//   }

//   const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newQuantity = Number.parseInt(e.target.value) || 1
//     updateQuantity(item.$id, item.selectedSize, Math.max(1, newQuantity))
//   }

//   const handleRemove = () => {
//     removeFromCart(item.$id, item.selectedSize)
//   }

//   return (
//     <Card>
//       <CardContent className="p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex-1">
//             <h3 className="font-semibold text-lg">{item.name}</h3>
//             <p className="text-sm text-muted-foreground">
//               Size: {item.selectedSize} | ₹{currentPrice} each
//             </p>
//           </div>

//           <div className="flex items-center space-x-3">
//             {/* Quantity Controls */}
//             <div className="flex items-center space-x-2">
//               <Button variant="outline" size="sm" onClick={decrementQuantity} disabled={item.quantity <= 1}>
//                 <Minus className="h-4 w-4" />
//               </Button>
//               <Input
//                 type="number"
//                 min="1"
//                 value={item.quantity}
//                 onChange={handleQuantityChange}
//                 className="w-16 text-center"
//               />
//               <Button variant="outline" size="sm" onClick={incrementQuantity}>
//                 <Plus className="h-4 w-4" />
//               </Button>
//             </div>

//             {/* Total Price */}
//             <div className="text-lg font-semibold text-primary min-w-[80px] text-right">₹{totalPrice}</div>

//             {/* Remove Button */}
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleRemove}
//               className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
//             >
//               <Trash2 className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CartItem } from "@/lib/menu"
import { useCart } from "@/hooks/use-cart"
import { Plus, Minus, Trash2 } from "lucide-react"

interface CartItemProps {
  item: CartItem
}

export function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()

  const currentPrice =
    item.selectedSize === "half" ? item.halfPrice : item.fullPrice
  const totalPrice = currentPrice * item.quantity

  const incrementQuantity = () => {
    updateQuantity(item.$id, item.selectedSize, item.quantity + 1)
  }

  const decrementQuantity = () => {
    updateQuantity(item.$id, item.selectedSize, item.quantity - 1)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number.parseInt(e.target.value) || 1
    updateQuantity(item.$id, item.selectedSize, Math.max(1, newQuantity))
  }

  const handleRemove = () => {
    removeFromCart(item.$id, item.selectedSize)
  }

  return (
    <Card className="shadow-sm ">
      <CardContent className="">
        <div className="flex flex-row gap-2  justify-between items-center">
          {/* Top Row: Item Info */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-sm">{item.name}</h3>
              <p className="text-xs text-muted-foreground">
                {item.selectedSize} • ₹{currentPrice} each
              </p>
            </div>
          </div>

          {/* Middle Row: Quantity Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={decrementQuantity}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={handleQuantityChange}
              className="w-10 h-7 text-center text-xs"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={incrementQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Bottom Row: Price & Remove */}
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold text-primary">
              ₹{totalPrice}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRemove}
              className="h-7 w-7 text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
