"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { MenuItem } from "@/lib/menu"
import { useCart } from "@/hooks/use-cart"
import { Plus, Minus } from "lucide-react"

interface MenuItemCardProps {
  item: MenuItem
}

// export function MenuItemCard({ item }: MenuItemCardProps) {
//   const [selectedSize, setSelectedSize] = useState<"half" | "full">("full")
//   const [quantity, setQuantity] = useState(1)
//   const { addToCart } = useCart()

//   const currentPrice = selectedSize === "half" ? item.halfPrice : item.fullPrice

//   const handleAddToCart = () => {
//     addToCart(item, selectedSize, quantity)
//     setQuantity(1) // Reset quantity after adding
//   }

//   const incrementQuantity = () => {
//     setQuantity((prev) => prev + 1)
//   }

//   const decrementQuantity = () => {
//     setQuantity((prev) => Math.max(1, prev - 1))
//   }

//   return (
//     <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
//       <CardHeader className="pb-3">
//         <div className="flex justify-between items-start">
//           <div className="flex-1">
//             <CardTitle className="text-lg text-balance">{item.name}</CardTitle>
//             <CardDescription className="mt-1 text-pretty">{item.description}</CardDescription>
//           </div>
//           <Badge variant="secondary" className="ml-2 shrink-0">
//             {item.category}
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent className="flex-1 flex flex-col justify-between">
//         <div className="space-y-4">
//           {/* Price Display */}
//           <div className="flex justify-between items-center">
//             <div className="text-sm text-muted-foreground">
//               Half: ₹{item.halfPrice} | Full: ₹{item.fullPrice}
//             </div>
//           </div>

//           {/* Size Selection */}
//           <div className="space-y-2">
//             <Label htmlFor={`size-${item.$id}`}>Size</Label>
//             <Select value={selectedSize} onValueChange={(value: "half" | "full") => setSelectedSize(value)}>
//               <SelectTrigger id={`size-${item.$id}`}>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="half">Half - ₹{item.halfPrice}</SelectItem>
//                 <SelectItem value="full">Full - ₹{item.fullPrice}</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Quantity Selection */}
//           <div className="space-y-2">
//             <Label>Quantity</Label>
//             <div className="flex items-center space-x-2">
//               <Button variant="outline" size="sm" onClick={decrementQuantity} disabled={quantity <= 1}>
//                 <Minus className="h-4 w-4" />
//               </Button>
//               <Input
//                 type="number"
//                 min="1"
//                 value={quantity}
//                 onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
//                 className="w-20 text-center"
//               />
//               <Button variant="outline" size="sm" onClick={incrementQuantity}>
//                 <Plus className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Total Price */}
//           <div className="text-lg font-semibold text-primary">Total: ₹{currentPrice * quantity}</div>
//         </div>

//         {/* Add to Cart Button */}
//         <Button onClick={handleAddToCart} className="w-full mt-4" disabled={!item.isAvailable}>
//           {item.isAvailable ? "Add to Cart" : "Not Available"}
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }


// ...existing imports...

// export function MenuItemCard({ item }: MenuItemCardProps) {
//   const [selectedSize, setSelectedSize] = useState<"half" | "full">("full")
//   const [quantity, setQuantity] = useState(1)
//   const { addToCart } = useCart()

//   const currentPrice = selectedSize === "half" ? item.halfPrice : item.fullPrice

//   const handleAddToCart = () => {
//     addToCart(item, selectedSize, quantity)
//     setQuantity(1)
//   }

//   const incrementQuantity = () => setQuantity((prev) => prev + 1)
//   const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

//   return (
//     <Card className="h-full flex flex-col hover:shadow-lg transition-shadow max-w-xs w-72 mx-auto p-2">
//       <CardHeader className="pb-2 px-2">
//         <div className="flex justify-between items-start">
//           <div className="flex-1">
//             <CardTitle className="text-base font-semibold">{item.name}</CardTitle>
//             <CardDescription className="mt-0.5 text-xs">{item.description}</CardDescription>
//           </div>
//           <Badge variant="secondary" className="ml-2 shrink-0 text-xs px-2 py-0.5">
//             {item.category}
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent className="flex-1 flex flex-col justify-between px-2 ">
//         <div className="space-y-2">
//           {/* Price Display */}
//           <div className="flex justify-between items-center">
//             <div className="text-xs text-muted-foreground">
//               Half: ₹{item.halfPrice} | Full: ₹{item.fullPrice}
//             </div>
//           </div>

//           {/* Size Selection */}
//           <div>
//             <Label htmlFor={`size-${item.$id}`} className="text-xs">Size</Label>
//             <Select value={selectedSize} onValueChange={(value: "half" | "full") => setSelectedSize(value)}>
//               <SelectTrigger id={`size-${item.$id}`} className="h-8 text-xs">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="half" className="text-xs">Half - ₹{item.halfPrice}</SelectItem>
//                 <SelectItem value="full" className="text-xs">Full - ₹{item.fullPrice}</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Quantity Selection */}
//           <div>
//             <Label className="text-xs">Qty</Label>
//             <div className="flex items-center space-x-1">
//               <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1} className="h-7 w-7 p-0">
//                 <Minus className="h-4 w-4" />
//               </Button>
//               <Input
//                 type="number"
//                 min="1"
//                 value={quantity}
//                 onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
//                 className="w-12 h-7 text-center text-xs px-1"
//               />
//               <Button variant="outline" size="icon" onClick={incrementQuantity} className="h-7 w-7 p-0">
//                 <Plus className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Total Price */}
//           <div className="text-base font-semibold text-primary mt-1">₹{currentPrice * quantity}</div>
//         </div>

//         {/* Add to Cart Button */}
//         <Button
//           onClick={handleAddToCart}
//           className="w-full mt-3 h-8 text-sm"
//           disabled={!item.isAvailable}
//         >
//           {item.isAvailable ? "Add to Cart" : "Not Available"}
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [selectedSize, setSelectedSize] = useState<"half" | "full" | null>(null)
  const { addToCart, updateQuantity, items } = useCart()

  // Find if this item is already in cart with selected size
  const cartItem =
    selectedSize &&
    items.find(
      (cart) => cart.$id === item.$id && cart.selectedSize === selectedSize
    )

  const quantity = cartItem ? cartItem.quantity : 0

  const currentPrice =
    selectedSize === "half" ? item.halfPrice : selectedSize === "full" ? item.fullPrice : 0

  const handleAdd = () => {
    if (selectedSize) {
      addToCart(item, selectedSize, 1)
    }
  }

  const incrementQuantity = () => {
    if (selectedSize && cartItem) {
      updateQuantity(item.$id, selectedSize, quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (selectedSize && cartItem) {
      updateQuantity(item.$id, selectedSize, Math.max(0, quantity - 1))
    }
  }

  return (
    <Card className="w-full p-3 hover:shadow-sm transition-shadow " style={{background: "#fdf8f3ff" }}>
      <div className="flex items-center justify-between gap-4">
        {/* Item Name */}
        <div className="flex-1">
          <p className="text-md font-semibold">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.category}</p>
        </div>

        {/* Size Selection */}
        <div className="flex gap-3 text-xs">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name={`size-${item.$id}`}
              value="half"
              checked={selectedSize === "half"}
              onChange={() => setSelectedSize("half")}
            />
            Half ₹{item.halfPrice}
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name={`size-${item.$id}`}
              value="full"
              checked={selectedSize === "full"}
              onChange={() => setSelectedSize("full")}
            />
            Full ₹{item.fullPrice}
          </label>
        </div>

        {/* Quantity / Add+ Button */}
        
      </div>
      <div className=" flex items-center justify-center">
          {quantity > 0 ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 0}
                className="h-7 w-7 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                className="h-7 w-7 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAdd}
              className="h-7 text-xs px-3"
              disabled={!item.isAvailable || !selectedSize}
              style={{background: "#ff6a06ff"}}
            >
              Add +
            </Button>
          )}
        </div>
    </Card>
  )
}
