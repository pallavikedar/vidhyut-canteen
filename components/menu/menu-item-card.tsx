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

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [selectedSize, setSelectedSize] = useState<"half" | "full">("full")
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const currentPrice = selectedSize === "half" ? item.halfPrice : item.fullPrice

  const handleAddToCart = () => {
    addToCart(item, selectedSize, quantity)
    setQuantity(1) // Reset quantity after adding
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-balance">{item.name}</CardTitle>
            <CardDescription className="mt-1 text-pretty">{item.description}</CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {item.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Price Display */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Half: ₹{item.halfPrice} | Full: ₹{item.fullPrice}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <Label htmlFor={`size-${item.$id}`}>Size</Label>
            <Select value={selectedSize} onValueChange={(value: "half" | "full") => setSelectedSize(value)}>
              <SelectTrigger id={`size-${item.$id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="half">Half - ₹{item.halfPrice}</SelectItem>
                <SelectItem value="full">Full - ₹{item.fullPrice}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={decrementQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-20 text-center"
              />
              <Button variant="outline" size="sm" onClick={incrementQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Total Price */}
          <div className="text-lg font-semibold text-primary">Total: ₹{currentPrice * quantity}</div>
        </div>

        {/* Add to Cart Button */}
        <Button onClick={handleAddToCart} className="w-full mt-4" disabled={!item.isAvailable}>
          {item.isAvailable ? "Add to Cart" : "Not Available"}
        </Button>
      </CardContent>
    </Card>
  )
}
