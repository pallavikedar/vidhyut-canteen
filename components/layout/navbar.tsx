"use client"

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
import { LogOut, Settings, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import logo from "@/public/logo.png"

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-40">

          {/* Left: Logo + App Name */}
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Image src={logo} alt="Logo"  className="rounded-md w-50 h-50 text-transparent  opacity-40" />
            </Link>
            <Link href="/" className="text-3xl font-bold text-primary hover:text-primary/80 transition ">
              विद्युत कॅन्टीन
            </Link>
          </div>

          {/* Right: Navigation Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart Button */}
                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-gray-100">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Cart</span>
                  </Button>
                </Link>

                {/* Admin Button */}
                {user?.isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-gray-100">
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </Button>
                  </Link>
                )}

                {/* User Dropdown */}
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
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
