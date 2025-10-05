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



// "use client"

// import { useEffect, useState } from "react"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   ShoppingBag,
//   Users,
// } from "lucide-react"
// import {
//   databases,
//   DATABASE_ID,
//   ORDERS_COLLECTION_ID,
//   USERS_COLLECTION_ID,
// } from "@/lib/appwrite"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
//   import { Query } from "appwrite" // <-- make sure to import
//   import { useRouter } from "next/navigation"


// interface Stats {
//   totalRevenue: number
//   totalOrders: number
//   totalUsers: number
//   pendingOrders: number
//   revenueChange: number
//   ordersChange: number

//   dailyRevenue: number
//   weeklyRevenue: number
//   monthlyRevenue: number
//   totalCash: number
//   totalOnline: number
//   totalMixed: number
//   dailyPaymentTotal: number
//   weeklyPaymentTotal: number
//   monthlyPaymentTotal: number
//   href?: string
// }

// export function StatsCards() {
//   const router = useRouter()
//   const [stats, setStats] = useState<Stats | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [showRevenueDetails, setShowRevenueDetails] = useState(false)
//   const [orders, setOrders] = useState<any[]>([])  



// useEffect(() => {
//   const fetchStats = async () => {
//     try {
//       // 🔹 Fetch ALL orders (increase limit)
//       const ordersRes = await databases.listDocuments(
//         DATABASE_ID,
//         ORDERS_COLLECTION_ID,
//         [Query.limit(1000)] // fetch up to 1000 docs
//       )
//       const orders = ordersRes.documents
//       setOrders(orders)

//       const getTotal = (o: any) => Number(o.totalAmount || 0)
//       const sumOrders = (arr: any[]) => arr.reduce((s, o) => s + getTotal(o), 0)

//       // Totals
//       const totalRevenue = sumOrders(orders)
//       const totalOrders = orders.length
//       const pendingOrders = orders.filter((o: any) => o.status === "pending").length

//       // Users
//       let totalUsers = 0
//       try {
//         const usersRes = await databases.listDocuments(
//           DATABASE_ID,
//           USERS_COLLECTION_ID,
//           [Query.limit(1000)]
//         )
//         totalUsers = usersRes.total
//       } catch {
//         totalUsers = new Set(orders.map((o: any) => o.userId)).size
//       }

//       // Date helpers
//       const today = new Date()
//       const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
//       const startOfWeek = new Date(today)
//       startOfWeek.setDate(today.getDate() - today.getDay())
//       const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

//       // 🔹 Normalize date conversion
//       const parseDate = (d: string) => new Date(d)

//       const todayOrders = orders.filter((o: any) => parseDate(o.$createdAt) >= startOfToday)
//       const weekOrders = orders.filter((o: any) => parseDate(o.$createdAt) >= startOfWeek)
//       const monthOrders = orders.filter((o: any) => parseDate(o.$createdAt) >= startOfMonth)

//       const dailyRevenue = sumOrders(todayOrders)
//       const weeklyRevenue = sumOrders(weekOrders)
//       const monthlyRevenue = sumOrders(monthOrders)

//       // Payment Method breakdown
//       const totalCash = sumOrders(orders.filter((o: any) => o.paymentMethod === "cash"))
//       const totalOnline = sumOrders(orders.filter((o: any) => o.paymentMethod === "online"))
//       const totalMixed = sumOrders(orders.filter((o: any) => o.paymentMethod === "mixed"))

//       // Payment Period breakdown
//       const dailyPaymentTotal = sumOrders(orders.filter((o: any) => o.paymentPeriod === "daily"))
//       const weeklyPaymentTotal = sumOrders(orders.filter((o: any) => o.paymentPeriod === "weekly"))
//       const monthlyPaymentTotal = sumOrders(orders.filter((o: any) => o.paymentPeriod === "monthly"))

//       setStats({
//         totalRevenue,
//         totalOrders,
//         totalUsers,
//         pendingOrders,
//         revenueChange: 0, // keep same logic if needed
//         ordersChange: 0,
//         dailyRevenue,
//         weeklyRevenue,
//         monthlyRevenue,
//         totalCash,
//         totalOnline,
//         totalMixed,
//         dailyPaymentTotal,
//         weeklyPaymentTotal,
//         monthlyPaymentTotal,
//       })
//     } catch (err) {
//       console.error("Failed to fetch stats:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   fetchStats()
// }, [])

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
//       onClick: () => setShowRevenueDetails(true),
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
//     {
//       title: "Payment",
//       value: stats.totalOrders.toString(),
//       description: "Payment methods used",
//       icon: Users,
//       change: 0,
//       changeText: "active users",
//       onClick: () => window.location.href = "/payment",
//     },
//   ]

//   return (
//     <>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {cards.map((card) => (
//           <Card
//             key={card.title}
//             onClick={card.onClick}
//             className={card.onClick ? "cursor-pointer hover:shadow-lg" : ""}
           
            
//           >
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
//               <card.icon className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{card.value}</div>
//               <p className="text-xs text-muted-foreground">
//                 {card.change !== 0 && (
//                   <span
//                     className={`inline-flex items-center ${
//                       card.change > 0 ? "text-green-600" : "text-red-600"
//                     }`}
//                   >
//                     {card.change > 0 ? (
//                       <TrendingUp className="h-3 w-3 mr-1" />
//                     ) : (
//                       <TrendingDown className="h-3 w-3 mr-1" />
//                     )}
//                     {Math.abs(card.change)}%
//                   </span>
//                 )}{" "}
//                 {card.changeText}
//               </p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Revenue Breakdown Modal */}
//      <Dialog open={showRevenueDetails} onOpenChange={setShowRevenueDetails}>
//   <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
//     <DialogHeader>
//       <DialogTitle className="text-xl font-bold">Revenue Breakdown</DialogTitle>
//     </DialogHeader>

//     <div className="space-y-6">

//       {/* Revenue by Date */}
//       <div>
//         <h3 className="font-semibold text-lg mb-2">By Date</h3>
//         <div className="grid grid-cols-3 gap-4 text-center">
//           <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
//             <p className="text-sm text-muted-foreground">Today</p>
//             <p className="text-lg font-bold">₹{stats.dailyRevenue}</p>
//           </div>
//           <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
//             <p className="text-sm text-muted-foreground">This Week</p>
//             <p className="text-lg font-bold">₹{stats.weeklyRevenue}</p>
//           </div>
//           <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
//             <p className="text-sm text-muted-foreground">This Month</p>
//             <p className="text-lg font-bold">₹{stats.monthlyRevenue}</p>
//           </div>
//         </div>
//       </div>

//       {/* Revenue by Payment Method */}
//       <div>
//         <h3 className="font-semibold text-lg mb-2">By Payment Method</h3>
//         <div className="grid grid-cols-3 gap-4 text-center">
//           <div className="p-3 bg-green-50 rounded-lg shadow-sm">
//             <p className="text-sm text-muted-foreground">Cash</p>
//             <p className="text-lg font-bold">₹{stats.totalCash}</p>
//           </div>
//           <div className="p-3 bg-blue-50 rounded-lg shadow-sm">
//             <p className="text-sm text-muted-foreground">Online</p>
//             <p className="text-lg font-bold">₹{stats.totalOnline}</p>
//           </div>
//           <div className="p-3 bg-yellow-50 rounded-lg shadow-sm">
//             <p className="text-sm text-muted-foreground">Mixed</p>
//             <p className="text-lg font-bold">₹{stats.totalMixed}</p>
//           </div>
//         </div>
//       </div>

//       {/* Revenue by Payment Period */}
//       <div>
//         <h3 className="font-semibold text-lg mb-2">By Payment Period</h3>
//         <div className="grid grid-cols-3 gap-4 text-center">
//           <div className="p-3 bg-purple-50 rounded-lg shadow-sm">
//             <p className="text-sm text-muted-foreground">Daily</p>
//             <p className="text-lg font-bold">₹{stats.dailyPaymentTotal}</p>
//           </div>
//           <div className="p-3 bg-orange-50 rounded-lg shadow-sm">
//             <p className="text-sm text-muted-foreground">Weekly</p>
//             <p className="text-lg font-bold">₹{stats.weeklyPaymentTotal}</p>
//           </div>
//           <div className="p-3 bg-pink-50 rounded-lg shadow-sm">
//             <p className="text-sm text-muted-foreground">Monthly</p>
//             <p className="text-lg font-bold">₹{stats.monthlyPaymentTotal}</p>
//           </div>
//         </div>
//       </div>

//       {/* Item-wise Breakdown */}
//       <div>
//         <h3 className="font-semibold text-lg mb-2">Items Ordered</h3>
//         <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 text-left text-sm font-semibold">Item</th>
//               <th className="p-2 text-center text-sm font-semibold">Quantity</th>
//               <th className="p-2 text-right text-sm font-semibold">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(
//               orders.reduce((acc: any, order: any) => {
//                 order.items.forEach((item: string) => {
//                   // Extract "Tea (half, 1)" → itemName: Tea (half), qty: 1
//                   const match = item.match(/^(.*)\((.*),\s*(\d+)\)$/)
//                   let itemName = item
//                   let qty = 1
//                   if (match) {
//                     itemName = match[1].trim()
//                     qty = parseInt(match[3])
//                   }
//                   if (!acc[itemName]) acc[itemName] = { qty: 0, total: 0 }
//                   acc[itemName].qty += qty
//                   acc[itemName].total += order.totalAmount / order.items.length // split amount equally per item
//                 })
//                 return acc
//               }, {})
//             ).map(([name, data]: any, idx) => (
//               <tr key={idx} className="border-t">
//                 <td className="p-2 text-sm">{name}</td>
//                 <td className="p-2 text-center text-sm">{data.qty}</td>
//                 <td className="p-2 text-right text-sm font-bold">₹{data.total.toFixed(2)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//     </div>
//   </DialogContent>
// </Dialog>

//     </>
//   )
// }


























// "use client"

// import { useEffect, useState } from "react"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   ShoppingBag,
//   Users,
// } from "lucide-react"
// import {
//   databases,
//   DATABASE_ID,
//   ORDERS_COLLECTION_ID,
//   USERS_COLLECTION_ID,
//   ORDER_ITEMS_COLLECTION_ID,
// } from "@/lib/appwrite"
// import { Query } from "appwrite"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"

// interface Stats {
//   totalRevenue: number
//   totalOrders: number
//   totalUsers: number
//   pendingOrders: number
//   revenueChange: number
//   ordersChange: number
//   dailyRevenue: number
//   weeklyRevenue: number
//   monthlyRevenue: number
//   totalCash: number
//   totalOnline: number
//   totalMixed: number
//   dailyPaymentTotal: number
//   weeklyPaymentTotal: number
//   monthlyPaymentTotal: number
// }

// export function StatsCards(){
//   const [stats, setStats] = useState<Stats | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [showRevenueDetails, setShowRevenueDetails] = useState(false)

//   const [orders, setOrders] = useState<any[]>([])
//   const [users, setUsers] = useState<any[]>([])
//   const [orderItems, setOrderItems] = useState<any[]>([])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Orders
//         const ordersRes = await databases.listDocuments(
//           DATABASE_ID,
//           ORDERS_COLLECTION_ID,
//           [Query.limit(1000)]
//         )
//         const orders = ordersRes.documents
//         setOrders(orders)

//         // Users
//         const usersRes = await databases.listDocuments(
//           DATABASE_ID,
//           USERS_COLLECTION_ID,
//           [Query.limit(1000)]
//         )
//         setUsers(usersRes.documents)

//         // Order Items (for payments)
//         const itemsRes = await databases.listDocuments(
//           DATABASE_ID,
//           ORDER_ITEMS_COLLECTION_ID,
//           [Query.limit(1000)]
//         )
//         setOrderItems(itemsRes.documents)

//         const getTotal = (o: any) => Number(o.totalAmount || 0)
//         const sumOrders = (arr: any[]) => arr.reduce((s, o) => s + getTotal(o), 0)

//         const totalRevenue = sumOrders(orders)
//         const totalOrders = orders.length
//         const pendingOrders = orders.filter((o: any) => o.status === "pending").length
//         const totalUsers = usersRes.total

//         const today = new Date()
//         const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
//         const startOfWeek = new Date(today)
//         startOfWeek.setDate(today.getDate() - today.getDay())
//         const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

//         const parseDate = (d: string) => new Date(d)

//         const todayOrders = orders.filter((o: any) => parseDate(o.$createdAt) >= startOfToday)
//         const weekOrders = orders.filter((o: any) => parseDate(o.$createdAt) >= startOfWeek)
//         const monthOrders = orders.filter((o: any) => parseDate(o.$createdAt) >= startOfMonth)

//         const dailyRevenue = sumOrders(todayOrders)
//         const weeklyRevenue = sumOrders(weekOrders)
//         const monthlyRevenue = sumOrders(monthOrders)

//         const totalCash = sumOrders(orders.filter((o: any) => o.paymentMethod === "cash"))
//         const totalOnline = sumOrders(orders.filter((o: any) => o.paymentMethod === "online"))
//         const totalMixed = sumOrders(orders.filter((o: any) => o.paymentMethod === "mixed"))

//         const dailyPaymentTotal = sumOrders(orders.filter((o: any) => o.paymentPeriod === "daily"))
//         const weeklyPaymentTotal = sumOrders(orders.filter((o: any) => o.paymentPeriod === "weekly"))
//         const monthlyPaymentTotal = sumOrders(orders.filter((o: any) => o.paymentPeriod === "monthly"))

//         setStats({
//           totalRevenue,
//           totalOrders,
//           totalUsers,
//           pendingOrders,
//           revenueChange: 0,
//           ordersChange: 0,
//           dailyRevenue,
//           weeklyRevenue,
//           monthlyRevenue,
//           totalCash,
//           totalOnline,
//           totalMixed,
//           dailyPaymentTotal,
//           weeklyPaymentTotal,
//           monthlyPaymentTotal,
//         })
//       } catch (err) {
//         console.error("Failed to fetch stats:", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   if (loading) {
//     return <p className="text-center py-10">Loading stats...</p>
//   }

//   if (!stats) {
//     return <p className="text-center py-10 text-red-500">Failed to load stats</p>
//   }

//   // Split orderItems into Paid / Unpaid
//   const paidOrders = orderItems.filter((o: any) => Number(o.balanceAmount) === 0)
//   const unpaidOrders = orderItems.filter((o: any) => Number(o.balanceAmount) > 0)

//   const cards = [
//     {
//       title: "Total Revenue",
//       value: `₹${stats.totalRevenue.toLocaleString()}`,
//       description: "Total earnings",
//       icon: DollarSign,
//       change: stats.revenueChange,
//       changeText: "from last month",
//       onClick: () => setShowRevenueDetails(true),
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
//     <>
//       {/* Top Stats */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
//         {cards.map((card) => (
//           <Card
//             key={card.title}
//             onClick={card.onClick}
//             className={card.onClick ? "cursor-pointer hover:shadow-lg" : ""}
//           >
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
//               <card.icon className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{card.value}</div>
//               <p className="text-xs text-muted-foreground">
//                 {card.change !== 0 && (
//                   <span
//                     className={`inline-flex items-center ${
//                       card.change > 0 ? "text-green-600" : "text-red-600"
//                     }`}
//                   >
//                     {card.change > 0 ? (
//                       <TrendingUp className="h-3 w-3 mr-1" />
//                     ) : (
//                       <TrendingDown className="h-3 w-3 mr-1" />
//                     )}
//                     {Math.abs(card.change)}%
//                   </span>
//                 )}{" "}
//                 {card.changeText}
//               </p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Users Section */}
//       <div className="mb-8">
//         <h2 className="text-xl font-bold mb-3">👥 Users</h2>
//         <Card>
//           <CardContent>
//             {users.length === 0 ? (
//               <p className="text-gray-500">No users found</p>
//             ) : (
//               <ul className="divide-y divide-gray-200">
//                 {users.map((u) => (
//                   <li key={u.$id} className="py-2 flex justify-between">
//                     <span>{u.name || u.userName} ({u.phone || u.userPhone})</span>
//                     <span className="text-sm text-gray-500">ID: {u.$id.slice(-6)}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Payments Section */}
//       <div>
//         <h2 className="text-xl font-bold mb-3">💰 Payments</h2>
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Paid */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-green-600">Paid Orders</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {paidOrders.length === 0 ? (
//                 <p className="text-gray-500">No paid orders</p>
//               ) : (
//                 <ul className="divide-y divide-gray-200">
//                   {paidOrders.map((o) => (
//                     <li key={o.$id} className="py-2 flex justify-between">
//                       <span>{o.userName} ({o.userPhone})</span>
//                       <span className="text-sm text-green-600">₹{o.totalAmount}</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </CardContent>
//           </Card>

//           {/* Unpaid */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-red-600">Unpaid Orders</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {unpaidOrders.length === 0 ? (
//                 <p className="text-gray-500">No unpaid orders</p>
//               ) : (
//                 <ul className="divide-y divide-gray-200">
//                   {unpaidOrders.map((o) => (
//                     <li key={o.$id} className="py-2 flex justify-between">
//                       <span>{o.userName} ({o.userPhone})</span>
//                       <span className="text-sm text-red-600">
//                         Pending ₹{o.balanceAmount}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Revenue Breakdown Modal */}
//       <Dialog open={showRevenueDetails} onOpenChange={setShowRevenueDetails}>
//         <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-bold">Revenue Breakdown</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-6">
//             <div>
//               <h3 className="font-semibold text-lg mb-2">By Date</h3>
//               <div className="grid grid-cols-3 gap-4 text-center">
//                 <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
//                   <p className="text-sm text-muted-foreground">Today</p>
//                   <p className="text-lg font-bold">₹{stats.dailyRevenue}</p>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
//                   <p className="text-sm text-muted-foreground">This Week</p>
//                   <p className="text-lg font-bold">₹{stats.weeklyRevenue}</p>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
//                   <p className="text-sm text-muted-foreground">This Month</p>
//                   <p className="text-lg font-bold">₹{stats.monthlyRevenue}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
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
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import {
  databases,
  DATABASE_ID,
  ORDERS_COLLECTION_ID,
  USERS_COLLECTION_ID,
  ORDER_ITEMS_COLLECTION_ID,
} from "@/lib/appwrite"
import { Query } from "appwrite"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  href?: string
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRevenueDetails, setShowRevenueDetails] = useState(false)

  const [orders, setOrders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [orderItems, setOrderItems] = useState<any[]>([])

  const [showPaymentsModal, setShowPaymentsModal] = useState(false)
  const [showPaid, setShowPaid] = useState<string>("")
  const [showUnpaid, setShowUnpaid] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "unpaid">("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await databases.listDocuments(
          DATABASE_ID,
          ORDERS_COLLECTION_ID,
          [Query.limit(1000)]
        )
        setOrders(ordersRes.documents)

        const usersRes = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.limit(1000)]
        )
        setUsers(usersRes.documents)

        const itemsRes = await databases.listDocuments(
          DATABASE_ID,
          ORDER_ITEMS_COLLECTION_ID,
          [Query.limit(1000)]
        )
        setOrderItems(itemsRes.documents)

        const getTotal = (o: any) => Number(o.totalAmount || 0)
        const sumOrders = (arr: any[]) => arr.reduce((s, o) => s + getTotal(o), 0)

        const totalRevenue = sumOrders(ordersRes.documents)
        const totalOrders = ordersRes.documents.length
        const totalUsers = usersRes.total

        const today = new Date()
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        const parseDate = (d: string) => new Date(d)
       const todayOrders = ordersRes.documents.filter((o: any) => parseDate(o.$createdAt) >= startOfToday)
const weekOrders = ordersRes.documents.filter((o: any) => parseDate(o.$createdAt) >= startOfWeek)
const monthOrders = ordersRes.documents.filter((o: any) => parseDate(o.$createdAt) >= startOfMonth)

const dailyRevenue = sumOrders(todayOrders)
const weeklyRevenue = sumOrders(weekOrders)
const monthlyRevenue = sumOrders(monthOrders)

const totalCash = sumOrders(ordersRes.documents.filter((o: any) => o.paymentMethod === "cash"))
const totalOnline = sumOrders(ordersRes.documents.filter((o: any) => o.paymentMethod === "online"))
const totalMixed = sumOrders(ordersRes.documents.filter((o: any) => o.paymentMethod === "mixed"))

const dailyPaymentTotal = sumOrders(ordersRes.documents.filter((o: any) => o.paymentPeriod === "daily"))
const weeklyPaymentTotal = sumOrders(ordersRes.documents.filter((o: any) => o.paymentPeriod === "weekly"))
const monthlyPaymentTotal = sumOrders(ordersRes.documents.filter((o: any) => o.paymentPeriod === "monthly"))

        setStats({
          totalRevenue,
          totalOrders,
          totalUsers,
          pendingOrders: ordersRes.documents.filter((o: any) => o.status === "pending").length,
          revenueChange: 0,
          ordersChange: 0,
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
    fetchData()
  }, [])

  if (loading) return <p className="text-center py-10">Loading stats...</p>
  if (!stats) return <p className="text-center py-10 text-red-500">Failed to load stats</p>

  // Paid orders
  const paidOrders = orderItems
    .filter((oi: any) => Number(oi.balanceAmount) === 0)
    .map((oi) => {
      const order = orders.find((o) => o.$id === oi.orderId)
      return {
        ...oi,
        orderId: order?.$id,
        orderName: order?.items || "Unnamed Order",
        userName: order?.userName || "Unknown User",
        userPhone: order?.userPhone || "N/A",
        totalAmount: Number(oi.totalAmount || order?.totalAmount || 0),
        status: "paid",
      }
    })

  // Unpaid orders
  const unpaidOrders = orders
    .filter((o: any) => o.paymentMethod?.toLowerCase() === "n/a")
    .filter((o: any) => !orderItems.some((oi) => oi.orderId === o.$id))
    .map((o) => ({
      orderId: o.$id,
      orderName: o.items || "Unnamed Order",
      userName: o.userName || "Unknown User",
      userPhone: o.userPhone || "N/A",
      totalAmount: Number(o.totalAmount || 0),
      status: "unpaid",
    }))

  // Group by user
  const allPayments = [...paidOrders, ...unpaidOrders]
  const groupedByUser = allPayments.reduce((acc: any, curr) => {
    const key = `${curr.userName}-${curr.userPhone}`
    if (!acc[key]) acc[key] = { userName: curr.userName, userPhone: curr.userPhone, paid: [], unpaid: [] }
    if (curr.status === "paid") acc[key].paid.push(curr)
    else acc[key].unpaid.push(curr)
    return acc
  }, {})
  const groupedList = Object.values(groupedByUser).filter((user: any) => {
    if (!searchTerm) return true
    return user.userName.toLowerCase().includes(searchTerm.toLowerCase()) || user.userPhone.includes(searchTerm)
  })

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
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      description: "Registered users",
      icon: Users,
    },
    {
      title: "Payments",
      value: groupedList.length.toString(),
      description: "Users with payments",
      icon: Users,
      onClick: () => setShowPaymentsModal(true),
    },
  ]

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payments Modal */}
      <Dialog open={showPaymentsModal} onOpenChange={setShowPaymentsModal}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payments</DialogTitle>
          </DialogHeader>

          {/* Search + filter */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search by name or mobile"
              className="flex-1 border rounded px-3 py-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className={`px-3 py-1 rounded ${filterStatus === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setFilterStatus("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded ${filterStatus === "paid" ? "bg-green-500 text-white" : "bg-gray-200"}`}
              onClick={() => setFilterStatus("paid")}
            >
              Paid
            </button>
            <button
              className={`px-3 py-1 rounded ${filterStatus === "unpaid" ? "bg-red-500 text-white" : "bg-gray-200"}`}
              onClick={() => setFilterStatus("unpaid")}
            >
              Unpaid
            </button>
          </div>

          <div className="space-y-6">
            {groupedList.length === 0 && <p className="text-gray-500 text-center py-4">No users found</p>}

            {groupedList.map((user: any) => {
              // Apply filter
              const paid = filterStatus === "all" || filterStatus === "paid" ? user.paid : []
              const unpaid = filterStatus === "all" || filterStatus === "unpaid" ? user.unpaid : []

              if (paid.length + unpaid.length === 0) return null

              return (
                <div key={user.userPhone} className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-2">
                    👤 {user.userName} ({user.userPhone})
                  </h3>

                  {/* Paid Orders */}
                  {paid.length > 0 && (
                    <div className="bg-green-50 p-3 rounded-md mb-2">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() =>
                          setShowPaid((prev) => (prev === user.userPhone ? "" : user.userPhone))
                        }
                      >
                        <span className="font-semibold text-green-700">
                          Paid Orders ({paid.length}) — ₹
                          {paid.reduce((s, o) => s + Number(o.totalAmount), 0).toLocaleString()}
                        </span>
                        {showPaid === user.userPhone ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                      {showPaid === user.userPhone && (
                        <ul className="mt-2 divide-y divide-gray-200">
                          {paid.map((o: any) => (
                            <li key={o.orderId} className="py-2 flex justify-between text-sm">
                              <span>{o.orderName} (ID: {o.orderId.slice(-6)})</span>
                              <span className="text-green-600">₹{o.totalAmount.toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Unpaid Orders */}
                  {unpaid.length > 0 && (
                    <div className="bg-red-50 p-3 rounded-md">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() =>
                          setShowUnpaid((prev) => (prev === user.userPhone ? "" : user.userPhone))
                        }
                      >
                        <span className="font-semibold text-red-700">
                          Unpaid Orders ({unpaid.length}) — ₹
                          {unpaid.reduce((s, o) => s + Number(o.totalAmount), 0).toLocaleString()}
                        </span>
                        {showUnpaid === user.userPhone ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                      {showUnpaid === user.userPhone && (
                        <ul className="mt-2 divide-y divide-gray-200">
                          {unpaid.map((o: any) => (
                            <li key={o.orderId} className="py-2 flex justify-between text-sm">
                              <span>{o.orderName} (ID: {o.orderId.slice(-6)})</span>
                              <span className="text-red-600">Pending ₹{o.totalAmount.toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showRevenueDetails} onOpenChange={setShowRevenueDetails}>
   <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
     <DialogHeader>
       <DialogTitle className="text-xl font-bold">Revenue Breakdown</DialogTitle>
     </DialogHeader>

     <div className="space-y-6">

{/* //       Revenue by Date */}
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

{/* //       Revenue by Payment Method */}
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

{/* //       Revenue by Payment Period */}
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
