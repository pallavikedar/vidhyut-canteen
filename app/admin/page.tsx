"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { StatsCards } from "@/components/admin/stats-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { orderService } from "@/lib/orders"
import type { Order } from "@/lib/orders"

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 1, // At least the admin user
    pendingOrders: 0,
    revenueChange: 12.5,
    ordersChange: 8.2,
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const orders = await orderService.getAllOrders()
      const recentOrdersList = orders.slice(0, 5)
      setRecentOrders(recentOrdersList)

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
      const pendingOrders = orders.filter((order) => order.status === "pending").length

      setStats((prev) => ({
        ...prev,
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
      }))
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-orange-100 text-orange-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="flex">
          <AdminSidebar className="w-64 min-h-[calc(100vh-4rem)]" />

          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to Vidyut Canteen Admin Panel</p>
              </div>

              {/* Stats Cards */}
              <StatsCards stats={stats} />

              {/* Recent Orders */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest orders from customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentOrders.length > 0 ? (
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div key={order.$id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{order.userName}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.items.length} items • ₹{order.totalAmount}
                              </p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">No orders yet</div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      View All Orders
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      Manage Menu Items
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      Payment Reports
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      User Management
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
