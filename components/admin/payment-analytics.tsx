"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, CreditCard, Wallet, TrendingUp, Calendar } from "lucide-react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { databases, ORDERS_COLLECTION_ID, DATABASE_ID, Query } from "@/lib/appwrite"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Order type definition
export interface Order {
  $id: string
  userName: string
  totalAmount: number
  paymentMethod: "cash" | "online"
  paymentPeriod: "daily" | "weekly" | "monthly"
  $createdAt: string
  status: "delivered" | "cancelled" | "pending"
}

// Service to fetch orders
export const orderService = {
  async getAllOrders() {
    try {
      const response = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
        Query.orderDesc("$createdAt"),
      ])
      return response.documents as Order[]
    } catch (error) {
      console.error("Error fetching orders:", error)
      return []
    }
  },
}

export function PaymentAnalytics() {
  const [orders, setOrders] = useState<Order[]>([])
  const [period, setPeriod] = useState<"all" | "daily" | "weekly" | "monthly">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      const data = await orderService.getAllOrders()
      setOrders(data)
      setLoading(false)
    }
    loadOrders()
  }, [])

  // Counts
  const dailyPlanCount = orders.filter((o) => o.paymentPeriod === "daily").length
  const weeklyPlanCount = orders.filter((o) => o.paymentPeriod === "weekly").length
  const monthlyPlanCount = orders.filter((o) => o.paymentPeriod === "monthly").length

  const dailyRevenue = orders
    .filter((o) => o.paymentPeriod === "daily")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const weeklyRevenue = orders
    .filter((o) => o.paymentPeriod === "weekly")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const monthlyRevenue = orders
    .filter((o) => o.paymentPeriod === "monthly")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0)

  // Filtered orders
  const filteredOrders =
    period === "all"
      ? orders
      : period === "daily"
      ? orders.filter((o) => o.paymentPeriod === "daily")
      : period === "weekly"
      ? orders.filter((o) => o.paymentPeriod === "weekly")
      : orders.filter((o) => o.paymentPeriod === "monthly")

  const getPaymentMethodColor = (method: "cash" | "online" | string) => {
    return method === "cash" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  // Summary totals
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const totalOrders = orders.length
  const cashPayments = orders.filter((o) => o.paymentMethod === "cash").length
  const onlinePayments = orders.filter((o) => o.paymentMethod === "online").length

  // Chart data
  const chartData = {
    labels: ["Daily", "Weekly", "Monthly"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [dailyRevenue, weeklyRevenue, monthlyRevenue],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Orders",
        data: [dailyPlanCount, weeklyPlanCount, monthlyPlanCount],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Top Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString("en-IN")}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Cash Payments</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cashPayments}</div>
            <p className="text-xs text-muted-foreground">
              {totalOrders > 0 ? Math.round((cashPayments / totalOrders) * 100) : 0}% of orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Online Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlinePayments}</div>
            <p className="text-xs text-muted-foreground">
              {totalOrders > 0 ? Math.round((onlinePayments / totalOrders) * 100) : 0}% of orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Period Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer ${period === "all" ? "ring-2 ring-blue-500 shadow-md" : "hover:shadow"}`}
          onClick={() => setPeriod("all")}
        >
          <CardHeader className="pb-2">
            <CardTitle>All Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer ${period === "daily" ? "ring-2 ring-blue-500 shadow-md" : "hover:shadow"}`}
          onClick={() => setPeriod("daily")}
        >
          <CardHeader className="pb-2">
            <CardTitle>Daily Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyPlanCount}</div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer ${period === "weekly" ? "ring-2 ring-blue-500 shadow-md" : "hover:shadow"}`}
          onClick={() => setPeriod("weekly")}
        >
          <CardHeader className="pb-2">
            <CardTitle>Weekly Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyPlanCount}</div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer ${period === "monthly" ? "ring-2 ring-blue-500 shadow-md" : "hover:shadow"}`}
          onClick={() => setPeriod("monthly")}
        >
          <CardHeader className="pb-2">
            <CardTitle>Monthly Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyPlanCount}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Payment Details - {period.charAt(0).toUpperCase() + period.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No orders for this period</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.$id}>
                    <TableCell className="font-mono text-sm">#{order.$id.slice(-6)}</TableCell>
                    <TableCell>{order.userName || "Unknown"}</TableCell>
                    <TableCell className="font-semibold">₹{order.totalAmount.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge className={getPaymentMethodColor(order.paymentMethod)}>{order.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.paymentPeriod}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(order.$createdAt)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Analytics Overview</CardTitle>
          <CardDescription>Comparative view of revenue and orders by plan</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading chart...</div>
          ) : (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Revenue & Orders by Plan" },
                },
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Orders Table */}
      
    </div>
  )
}
