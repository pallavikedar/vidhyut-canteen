// "use client"

// import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
// import { authService, type User, type RegisterData } from "@/lib/auth"
// import { useToast } from "@/hooks/use-toast"

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   login: (email: string, password: string) => Promise<void>
//   register: (userData: RegisterData) => Promise<void>
//   logout: () => Promise<void>
//   isAuthenticated: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const { toast } = useToast()

//   useEffect(() => {
//     checkAuth()
//   }, [])

//  const checkAuth = async () => {
//   setLoading(true)
//   try {
//     const authenticated = await authService.isAuthenticated()
//     if (authenticated) {
//       const currentUser = await authService.getCurrentUser()
//       setUser(currentUser)
//     } else {
//       setUser(null)
//     }
//   } catch (error) {
//     console.error("Auth check failed:", error)
//     setUser(null)
//   } finally {
//     setLoading(false)
//   }
// }


//   const login = async (email: string, password: string) => {
//     try {
//       setLoading(true)
//       const user = await authService.login(email, password)
//       setUser(user)
//       toast({
//         title: "Login Successful",
//         description: `Welcome back, ${user.name}!`,
//       })
//     } catch (error: any) {
//       toast({
//         title: "Login Failed",
//         description: error.message || "Invalid credentials",
//         variant: "destructive",
//       })
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const register = async (userData: RegisterData) => {
//     try {
//       setLoading(true)
//       const user = await authService.register(userData)
//       setUser(user)
//       toast({
//         title: "Registration Successful",
//         description: `Welcome to Vidyut Canteen, ${user.name}!`,
//       })
//     } catch (error: any) {
//       toast({
//         title: "Registration Failed",
//         description: error.message || "Failed to create account",
//         variant: "destructive",
//       })
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const logout = async () => {
//     try {
//       await authService.logout()
//       setUser(null)
//       toast({
//         title: "Logged Out",
//         description: "You have been successfully logged out",
//       })
//     } catch (error: any) {
//       toast({
//         title: "Logout Failed",
//         description: error.message || "Failed to logout",
//         variant: "destructive",
//       })
//     }
//   }

//   const value = {
//     user,
//     loading,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }



"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { authService, type User, type RegisterData } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  checkAuth: () => Promise<boolean>   // 👈 added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async (): Promise<boolean> => {
    setLoading(true)
    try {
      const authenticated = await authService.isAuthenticated()
      if (authenticated) {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
        return true
      } else {
        setUser(null)
        return false
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const user = await authService.login(email, password)
      setUser(user)

      // 👇 after login, redirect back if needed
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/"
      localStorage.removeItem("redirectAfterLogin")

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      })

      window.location.href = redirectPath // 👈 force redirect
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true)
      const user = await authService.register(userData)
      setUser(user)
      toast({
        title: "Registration Successful",
        description: `Welcome to Vidyut Canteen, ${user.name}!`,
      })
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "Failed to logout",
        variant: "destructive",
      })
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    checkAuth,   // 👈 added
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
