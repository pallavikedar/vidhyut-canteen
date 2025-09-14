"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { MenuManagement } from "@/components/admin/menu-management"

export default function AdminMenuPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="flex">
          <AdminSidebar className="w-64 min-h-[calc(100vh-4rem)]" />

          <main className="flex-1 p-6">
            <MenuManagement />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
