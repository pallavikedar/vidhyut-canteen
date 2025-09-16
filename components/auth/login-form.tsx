// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useAuth } from "@/hooks/use-auth"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Loader2, Mail, Lock ,EyeOff,Eye} from "lucide-react"
// import Link from "next/link"

// export function LoginForm() {
//   const [phone, setPhone] = useState("")
//   const [password, setPassword] = useState("")
//   const { login, loading } = useAuth()
//   const [showPassword, setShowPassword] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       await login(phone, password)
//     } catch (error) {
//       // Error is handled by the auth hook
//     }
//   }

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader className="text-center">
//         <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
//         <CardDescription>Sign in to your  विद्युत कॅन्टीन account</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="phone">Phone Number</Label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 id="phone"
//                 type="text"
//                 placeholder="Enter your phone number"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="pl-10"
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 id="password"
//                  type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="pl-10"
//                 required
//               />
//                <button
//         type="button"
//         onClick={() => setShowPassword((prev) => !prev)}
//         className="absolute right-3 top-2.5 text-muted-foreground focus:outline-none"
//         tabIndex={-1}
//       >
//         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//       </button>
//             </div>
//           </div>

//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Signing In...
//               </>
//             ) : (
//               "Sign In"
//             )}
//           </Button>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-sm text-muted-foreground">
//             Don't have an account?{" "}
//             <Link href="/register" className="text-primary hover:underline font-medium">
//               Register here
//             </Link>
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock, EyeOff, Eye } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const [identifier, setIdentifier] = useState("") // email for admin or phone for user
  const [password, setPassword] = useState("")
  const { login, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(identifier, password)
    } catch (error) {
      // Error is handled by the auth hook
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
        <CardDescription>Sign in to your विद्युत भवन कॅन्टीन/मेस account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identifier Field: Email or Phone */}
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or Phone</Label>
            <div className="relative">
              <Input
                id="identifier"
                type="text"
                placeholder="Enter your email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="pl-3 pr-3"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-3 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-muted-foreground focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
