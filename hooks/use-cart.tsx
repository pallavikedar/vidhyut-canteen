"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import type { CartItem, MenuItem } from "@/lib/menu"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/auth" // Your Appwrite authService
import { useAuth } from "@/hooks/use-auth"

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  addToCart: (item: MenuItem, size: "half" | "full", quantity?: number) => void
  removeFromCart: (itemId: string, size: "half" | "full") => void
  updateQuantity: (itemId: string, size: "half" | "full", quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const { toast } = useToast()

  // Load cart from localStorage when user is available
  // useEffect(() => {
  //   const loadCart = async () => {
  //     const user = await authService.getCurrentUser()
  //     if (user) {
  //       setUserId(user.$id)
  //       const savedCart = localStorage.getItem(`cart_${user.$id}`)
  //       if (savedCart) {
  //         try {
  //           setItems(JSON.parse(savedCart))
  //         } catch (error) {
  //           console.error("Failed to load cart:", error)
  //         }
  //       }
  //     }
  //   }
  //   loadCart()
  // }, [])

  // // Save cart whenever items change
  // useEffect(() => {
  //   if (userId) {
  //     localStorage.setItem(`cart_${userId}`, JSON.stringify(items))
  //   }
  // }, [items, userId])


  // State

// Load cart


const { user } = useAuth() // get user state from AuthProvider

useEffect(() => {
  const loadCart = async () => {
    // Guest cart key
    const guestCartKey = "cart_guest"

    if (user) {
      setUserId(user.$id)

      // Load existing user cart
      const savedCart = localStorage.getItem(`cart_${user.$id}`)
      let mergedCart: CartItem[] = savedCart ? JSON.parse(savedCart) : []

      // Merge guest cart
      const guestCart = localStorage.getItem(guestCartKey)
      if (guestCart) {
        try {
          const guestItems: CartItem[] = JSON.parse(guestCart)
          mergedCart = [...mergedCart, ...guestItems]
          localStorage.removeItem(guestCartKey) // clear guest cart
        } catch (err) {
          console.error("Failed to parse guest cart:", err)
        }
      }

      setItems(mergedCart)
      localStorage.setItem(`cart_${user.$id}`, JSON.stringify(mergedCart))
    } else {
      // Guest user: load guest cart
      const guestCart = localStorage.getItem(guestCartKey)
      if (guestCart) {
        try {
          setItems(JSON.parse(guestCart))
        } catch (err) {
          console.error("Failed to parse guest cart:", err)
        }
      }
    }
  }

  loadCart()
}, [user]) // 🔑 Add `user` as dependency so cart reloads after login


useEffect(() => {
  if (userId) {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(items))
  } else {
    localStorage.setItem("cart_guest", JSON.stringify(items))
  }
}, [items, userId])


  const addToCart = (item: MenuItem, size: "half" | "full", quantity = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.$id === item.$id && i.selectedSize === size)
      if (idx > -1) {
        const newItems = [...prev]
        newItems[idx].quantity += quantity
        return newItems
      }
      return [...prev, { ...item, selectedSize: size, quantity }]
    })
    toast({ title: "Added to Cart", description: `${item.name} (${size}) added` })
  }

  const removeFromCart = (itemId: string, size: "half" | "full") => {
    setItems(prev => prev.filter(i => !(i.$id === itemId && i.selectedSize === size)))
    toast({ title: "Removed from Cart", description: "Item removed from cart" })
  }

  const updateQuantity = (itemId: string, size: "half" | "full", quantity: number) => {
    if (quantity <= 0) return removeFromCart(itemId, size)
    setItems(prev => prev.map(i => (i.$id === itemId && i.selectedSize === size ? { ...i, quantity } : i)))
  }

  // Only clear cart after order placement
  const clearCart = () => {
    setItems([])
    if (userId) localStorage.removeItem(`cart_${userId}`)
    toast({ title: "Cart Cleared", description: "All items removed from cart" })
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalAmount = items.reduce(
    (sum, i) => sum + (i.selectedSize === "half" ? i.halfPrice : i.fullPrice) * i.quantity,
    0
  )

  return (
    <CartContext.Provider value={{ items, totalItems, totalAmount, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
