"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, ShoppingCart, User, Menu as MenuIcon, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import logo from "@/public/logo.png"
import { CartProvider, useCart } from "@/hooks/use-cart"



export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { items} = useCart()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <nav className="w-full bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-8">
        <div className="flex justify-evenly align-center items-center h-16 md:h-20">
          {/* Left: Logo + App Name */}
          <div className=" w-1/3 flex items-right justify-center space-x-3">
            
            <Link
              href="/"
              className="text-l sm:text-2xl md:text-3xl font-bold text-primary hover:text-primary/80 transition whitespace-nowrap"
            >
              विद्युत भवन
              <div className="  flex flex-row justify-between item-center">
              <div className="text-xs">कॅन्टीन/मेस</div>
              
              </div>

            </Link>
          </div>

          {/* Cart Button - Always visible for authenticated users */}
          {/* {isAuthenticated && !user?.isAdmin && (
            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 hover:bg-gray-100 "
              >
                <ShoppingCart className="h-10 w-10" />
                {items?.length > 0 && (
        <span className="absolute  flex items-center justify-center h-4 w-4 rounded-full bg-red-600 text-white text-xs font-bold">
          {items.length}
        </span>
      )}
                <span>Cart</span>
              </Button>
            </Link>
          )} */}

          {/* Right: Menu toggle and nav links */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded focus:outline-none"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-4">
              {user?.isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-gray-100">
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-10 w-10 rounded-full focus:outline-none border border-gray-200 hover:border-gray-300 transition">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-white">
                        {user ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-semibold leading-none">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-white rounded shadow-lg p-4 space-y-3">
            {isAuthenticated ? (
              <>
                {/* Cart button REMOVED from here to avoid duplication */}
                {user?.isAdmin && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full flex items-center space-x-1 hover:bg-gray-100">
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </Button>
                  </Link>
                )}
                <Link href="/profile" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full flex items-center space-x-1 hover:bg-gray-100">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center space-x-1 hover:bg-gray-100"
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full hover:bg-gray-100">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full bg-primary text-white hover:bg-primary/90">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}