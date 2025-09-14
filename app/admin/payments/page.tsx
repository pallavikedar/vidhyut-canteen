"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { PaymentAnalytics } from "@/components/admin/payment-analytics"

export default function AdminPaymentsPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="flex">
          <AdminSidebar className="w-64 min-h-[calc(100vh-4rem)]" />

          <main className="flex-1 p-6">
            <PaymentAnalytics />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
