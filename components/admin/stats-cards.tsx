"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Clock } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalRevenue: number
    totalOrders: number
    totalUsers: number
    pendingOrders: number
    revenueChange: number
    ordersChange: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
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
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      description: "Awaiting processing",
      icon: Clock,
      change: 0,
      changeText: "need attention",
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
                <span className={`inline-flex items-center ${card.change > 0 ? "text-green-600" : "text-red-600"}`}>
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
