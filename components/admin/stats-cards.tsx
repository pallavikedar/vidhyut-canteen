// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Clock } from "lucide-react"
// import { databases, DATABASE_ID, ORDERS_COLLECTION_ID, USERS_COLLECTION_ID, Query } from "@/lib/appwrite"

// interface Stats {
//   totalRevenue: number
//   totalOrders: number
//   totalUsers: number
//   pendingOrders: number
//   revenueChange: number
//   ordersChange: number
// }

// export function StatsCards() {
//   const [stats, setStats] = useState<Stats | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         // 1️⃣ Fetch orders
//         const ordersRes = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID)

//         const orders = ordersRes.documents

//         const totalRevenue = orders.reduce((sum, o: any) => sum + (o.totalAmount || 0), 0)
//         const totalOrders = orders.length
//         const pendingOrders = orders.filter((o: any) => o.status === "pending").length

//         // 2️⃣ Fetch users (if you have users collection)
//         let totalUsers = 0
//         try {
//           const usersRes = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID)
//           totalUsers = usersRes.total
//         } catch {
//           // fallback: unique userIds from orders
//           totalUsers = new Set(orders.map((o: any) => o.userId)).size
//         }

//         // 3️⃣ Compare revenue/orders change (this month vs last month)
//         const now = new Date()
//         const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
//         const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
//         const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

//         const thisMonthOrders = orders.filter(
//           (o: any) => new Date(o.$createdAt) >= startOfThisMonth
//         )
//         const lastMonthOrders = orders.filter(
//           (o: any) =>
//             new Date(o.$createdAt) >= startOfLastMonth &&
//             new Date(o.$createdAt) <= endOfLastMonth
//         )

//         const thisMonthRevenue = thisMonthOrders.reduce((sum, o: any) => sum + (o.totalAmount || 0), 0)
//         const lastMonthRevenue = lastMonthOrders.reduce((sum, o: any) => sum + (o.totalAmount || 0), 0)

//         const revenueChange =
//           lastMonthRevenue > 0
//             ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
//             : 0
//         const ordersChange =
//           lastMonthOrders.length > 0
//             ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
//             : 0

//         setStats({
//           totalRevenue,
//           totalOrders,
//           totalUsers,
//           pendingOrders,
//           revenueChange: Math.round(revenueChange),
//           ordersChange: Math.round(ordersChange),
//         })
//       } catch (err) {
//         console.error("Failed to fetch stats:", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStats()
//   }, [])

//   if (loading) {
//     return <p className="text-center py-10">Loading stats...</p>
//   }

//   if (!stats) {
//     return <p className="text-center py-10 text-red-500">Failed to load stats</p>
//   }

//   const cards = [
//     {
//       title: "Total Revenue",
//       value: `₹${stats.totalRevenue.toLocaleString()}`,
//       description: "Total earnings",
//       icon: DollarSign,
//       change: stats.revenueChange,
//       changeText: "from last month",
//     },
//     {
//       title: "Total Orders",
//       value: stats.totalOrders.toString(),
//       description: "Orders placed",
//       icon: ShoppingBag,
//       change: stats.ordersChange,
//       changeText: "from last month",
//     },
//     {
//       title: "Total Users",
//       value: stats.totalUsers.toString(),
//       description: "Registered users",
//       icon: Users,
//       change: 0,
//       changeText: "active users",
//     },
    
//   ]

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       {cards.map((card) => (
//         <Card key={card.title}>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
//             <card.icon className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{card.value}</div>
//             <p className="text-xs text-muted-foreground">
//               {card.change !== 0 && (
//                 <span
//                   className={`inline-flex items-center ${
//                     card.change > 0 ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {card.change > 0 ? (
//                     <TrendingUp className="h-3 w-3 mr-1" />
//                   ) : (
//                     <TrendingDown className="h-3 w-3 mr-1" />
//                   )}
//                   {Math.abs(card.change)}%
//                 </span>
//               )}{" "}
//               {card.changeText}
//             </p>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
} from "lucide-react"
import {
  databases,
  DATABASE_ID,
  ORDERS_COLLECTION_ID,
  USERS_COLLECTION_ID,
} from "@/lib/appwrite"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  pendingOrders: number
  revenueChange: number
  ordersChange: number

  dailyRevenue: number
  weeklyRevenue: number
  monthlyRevenue: number
  totalCash: number
  totalOnline: number
  totalMixed: number
  dailyPaymentTotal: number
  weeklyPaymentTotal: number
  monthlyPaymentTotal: number
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRevenueDetails, setShowRevenueDetails] = useState(false)
  const [orders, setOrders] = useState<any[]>([])   

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersRes = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID)
        const orders = ordersRes.documents
        setOrders(orders)

        // Helper functions
        const getTotal = (o: any) => Number(o.totalAmount || 0)
        const sumOrders = (arr: any[]) => arr.reduce((s, o) => s + getTotal(o), 0)
       
        // 1️⃣ Totals
        const totalRevenue = sumOrders(orders)
        const totalOrders = orders.length
        const pendingOrders = orders.filter((o: any) => o.status === "pending").length

        // 2️⃣ Users
        let totalUsers = 0
        try {
          const usersRes = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID)
          totalUsers = usersRes.total
        } catch {
          totalUsers = new Set(orders.map((o: any) => o.userId)).size
        }

        // 3️⃣ Revenue change (this month vs last month)
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

        const thisMonthRevenue = sumOrders(thisMonthOrders)
        const lastMonthRevenue = sumOrders(lastMonthOrders)

        const revenueChange =
          lastMonthRevenue > 0
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0
        const ordersChange =
          lastMonthOrders.length > 0
            ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
            : 0

        // 4️⃣ Revenue breakdowns by DATE
        const today = new Date()
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        const todayOrders = orders.filter((o: any) => new Date(o.$createdAt) >= startOfToday)
        const weekOrders = orders.filter((o: any) => new Date(o.$createdAt) >= startOfWeek)
        const monthOrders = orders.filter((o: any) => new Date(o.$createdAt) >= startOfMonth)

        const dailyRevenue = sumOrders(todayOrders)
        const weeklyRevenue = sumOrders(weekOrders)
        const monthlyRevenue = sumOrders(monthOrders)

        // 5️⃣ Payment Method breakdown
        const totalCash = sumOrders(orders.filter((o: any) => o.paymentMethod === "cash"))
        const totalOnline = sumOrders(orders.filter((o: any) => o.paymentMethod === "online"))
        const totalMixed = sumOrders(orders.filter((o: any) => o.paymentMethod === "mixed"))

        // 6️⃣ Payment Period breakdown
        const dailyPaymentTotal = sumOrders(orders.filter((o: any) => o.paymentPeriod === "daily"))
        const weeklyPaymentTotal = sumOrders(orders.filter((o: any) => o.paymentPeriod === "weekly"))
        const monthlyPaymentTotal = sumOrders(orders.filter((o: any) => o.paymentPeriod === "monthly"))

        setStats({
          totalRevenue,
          totalOrders,
          totalUsers,
          pendingOrders,
          revenueChange: Math.round(revenueChange),
          ordersChange: Math.round(ordersChange),
          dailyRevenue,
          weeklyRevenue,
          monthlyRevenue,
          totalCash,
          totalOnline,
          totalMixed,
          dailyPaymentTotal,
          weeklyPaymentTotal,
          monthlyPaymentTotal,
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
      onClick: () => setShowRevenueDetails(true),
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
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            onClick={card.onClick}
            className={card.onClick ? "cursor-pointer hover:shadow-lg" : ""}
          >
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

      {/* Revenue Breakdown Modal */}
     <Dialog open={showRevenueDetails} onOpenChange={setShowRevenueDetails}>
  <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold">Revenue Breakdown</DialogTitle>
    </DialogHeader>

    <div className="space-y-6">

      {/* Revenue by Date */}
      <div>
        <h3 className="font-semibold text-lg mb-2">By Date</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-lg font-bold">₹{stats.dailyRevenue}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-lg font-bold">₹{stats.weeklyRevenue}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-lg font-bold">₹{stats.monthlyRevenue}</p>
          </div>
        </div>
      </div>

      {/* Revenue by Payment Method */}
      <div>
        <h3 className="font-semibold text-lg mb-2">By Payment Method</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Cash</p>
            <p className="text-lg font-bold">₹{stats.totalCash}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Online</p>
            <p className="text-lg font-bold">₹{stats.totalOnline}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Mixed</p>
            <p className="text-lg font-bold">₹{stats.totalMixed}</p>
          </div>
        </div>
      </div>

      {/* Revenue by Payment Period */}
      <div>
        <h3 className="font-semibold text-lg mb-2">By Payment Period</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-purple-50 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Daily</p>
            <p className="text-lg font-bold">₹{stats.dailyPaymentTotal}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Weekly</p>
            <p className="text-lg font-bold">₹{stats.weeklyPaymentTotal}</p>
          </div>
          <div className="p-3 bg-pink-50 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Monthly</p>
            <p className="text-lg font-bold">₹{stats.monthlyPaymentTotal}</p>
          </div>
        </div>
      </div>

      {/* Item-wise Breakdown */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Items Ordered</h3>
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left text-sm font-semibold">Item</th>
              <th className="p-2 text-center text-sm font-semibold">Quantity</th>
              <th className="p-2 text-right text-sm font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              orders.reduce((acc: any, order: any) => {
                order.items.forEach((item: string) => {
                  // Extract "Tea (half, 1)" → itemName: Tea (half), qty: 1
                  const match = item.match(/^(.*)\((.*),\s*(\d+)\)$/)
                  let itemName = item
                  let qty = 1
                  if (match) {
                    itemName = match[1].trim()
                    qty = parseInt(match[3])
                  }
                  if (!acc[itemName]) acc[itemName] = { qty: 0, total: 0 }
                  acc[itemName].qty += qty
                  acc[itemName].total += order.totalAmount / order.items.length // split amount equally per item
                })
                return acc
              }, {})
            ).map(([name, data]: any, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2 text-sm">{name}</td>
                <td className="p-2 text-center text-sm">{data.qty}</td>
                <td className="p-2 text-right text-sm font-bold">₹{data.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </DialogContent>
</Dialog>

    </>
  )
}
