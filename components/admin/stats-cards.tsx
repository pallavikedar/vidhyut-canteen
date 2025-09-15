"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Clock } from "lucide-react"
import { databases, DATABASE_ID, ORDERS_COLLECTION_ID, USERS_COLLECTION_ID, Query } from "@/lib/appwrite"

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  pendingOrders: number
  revenueChange: number
  ordersChange: number
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1️⃣ Fetch orders
        const ordersRes = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID)

        const orders = ordersRes.documents

        const totalRevenue = orders.reduce((sum, o: any) => sum + (o.totalAmount || 0), 0)
        const totalOrders = orders.length
        const pendingOrders = orders.filter((o: any) => o.status === "pending").length

        // 2️⃣ Fetch users (if you have users collection)
        let totalUsers = 0
        try {
          const usersRes = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID)
          totalUsers = usersRes.total
        } catch {
          // fallback: unique userIds from orders
          totalUsers = new Set(orders.map((o: any) => o.userId)).size
        }

        // 3️⃣ Compare revenue/orders change (this month vs last month)
        const now = new Date()
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

        const thisMonthOrders = orders.filter(
          (o: any) => new Date(o.$createdAt) >= startOfThisMonth
        )
        const lastMonthOrders = orders.filter(
          (o: any) =>
            new Date(o.$createdAt) >= startOfLastMonth &&
            new Date(o.$createdAt) <= endOfLastMonth
        )

        const thisMonthRevenue = thisMonthOrders.reduce((sum, o: any) => sum + (o.totalAmount || 0), 0)
        const lastMonthRevenue = lastMonthOrders.reduce((sum, o: any) => sum + (o.totalAmount || 0), 0)

        const revenueChange =
          lastMonthRevenue > 0
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0
        const ordersChange =
          lastMonthOrders.length > 0
            ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
            : 0

        setStats({
          totalRevenue,
          totalOrders,
          totalUsers,
          pendingOrders,
          revenueChange: Math.round(revenueChange),
          ordersChange: Math.round(ordersChange),
        })
      } catch (err) {
        console.error("Failed to fetch stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <p className="text-center py-10">Loading stats...</p>
  }

  if (!stats) {
    return <p className="text-center py-10 text-red-500">Failed to load stats</p>
  }

  const cards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      description: "Total earnings",
      icon: DollarSign,
      change: stats.revenueChange,
      changeText: "from last month",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      description: "Orders placed",
      icon: ShoppingBag,
      change: stats.ordersChange,
      changeText: "from last month",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      description: "Registered users",
      icon: Users,
      change: 0,
      changeText: "active users",
    },
    
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.change !== 0 && (
                <span
                  className={`inline-flex items-center ${
                    card.change > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {card.change > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(card.change)}%
                </span>
              )}{" "}
              {card.changeText}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
