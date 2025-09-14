// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
// import { Eye, Search, Download, Calendar } from "lucide-react"
// import { databases, DATABASE_ID, ORDERS_COLLECTION_ID } from "@/lib/appwrite"
// import { Query } from "appwrite"
// import { useAuth } from "@/hooks/use-auth"
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"
// import { useToast } from "@/hooks/use-toast"

// export interface Order {
//   $id: string
//   userId: string
//   userName: string
//   userPhone: string
//   userDesignation: string
//   items: string[]
//   paymentMethod: "cash" | "online"
//   paymentPeriod: string
//   totalAmount: number
//   $createdAt: string
// }

// export function OrderManagement() {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(true)
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [viewMode, setViewMode] = useState<"today" | "all" | "range">("today")
//   const [fromDate, setFromDate] = useState("")
//   const [toDate, setToDate] = useState("")
//   const { user } = useAuth()
//   const { toast } = useToast()

//   useEffect(() => {
//     if (user) loadOrders()
//   }, [user])

//   useEffect(() => {
//     filterOrders()
//   }, [orders, searchTerm, viewMode, fromDate, toDate])

//   const loadOrders = async () => {
//     if (!user) return
//     setLoading(true)
//     try {
//       const res = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID)
//       const sorted = res.documents.sort(
//         (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
//       )
//       setOrders(sorted as Order[])
//     } catch (error) {
//       console.error("Failed to fetch orders:", error)
//       toast({ title: "Error", description: "Failed to load orders", variant: "destructive" })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filterOrders = () => {
//     let filtered = orders

//     if (viewMode === "today") {
//       const today = new Date().toDateString()
//       filtered = filtered.filter(order => new Date(order.$createdAt).toDateString() === today)
//     }

//     if (viewMode === "range" && fromDate && toDate) {
//       const from = new Date(fromDate)
//       const to = new Date(toDate)
//       filtered = filtered.filter(order => {
//         const orderDate = new Date(order.$createdAt)
//         return orderDate >= from && orderDate <= to
//       })
//     }

//     if (searchTerm) {
//       filtered = filtered.filter(
//         order =>
//           order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           order.userPhone.includes(searchTerm) ||
//           order.$id.includes(searchTerm)
//       )
//     }

//     setFilteredOrders(filtered)
//   }

//   const exportToPDF = () => {
//     const doc = new jsPDF()
//     doc.text("Orders Report", 14, 15)
//     autoTable(doc, {
//       head: [["Order ID", "Customer", "Designation", "Items", "Amount", "Payment", "Period", "Date"]],
//       body: filteredOrders.map(order => [
//         order.$id.slice(-6),
//         `${order.userName}\n${order.userPhone}`,
//         order.userDesignation,
//         order.items.join(", "),
//         `₹${order.totalAmount}`,
//         order.paymentMethod,
//         order.paymentPeriod,
//         new Date(order.$createdAt).toLocaleString("en-IN"),
//       ]),
//     })
//     doc.save("orders-report.pdf")
//   }

//   const getPaymentMethodColor = (method: "cash" | "online") =>
//     method === "cash" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Order Management</h1>
//           <p className="text-muted-foreground">View and manage all customer orders</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant={viewMode === "today" ? "default" : "outline"} onClick={() => setViewMode("today")}>
//             Today’s Orders
//           </Button>
//           <Button variant={viewMode === "all" ? "default" : "outline"} onClick={() => setViewMode("all")}>
//             All Orders
//           </Button>
//           {/* <Button variant={viewMode === "range" ? "default" : "outline"} onClick={() => setViewMode("range")}>
//             Date Range
//           </Button> */}
//           <Button variant="outline" onClick={exportToPDF}>
//             <Download className="h-4 w-4 mr-1" /> Export PDF
//           </Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-3">
//         {/* Search */}
//         <div className="relative w-64">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search orders..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-8"
//           />
//         </div>

//         {/* Date Range */}
        
          
       
//       </div>

//       {/* Orders Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>
//             {viewMode === "today"
//               ? "Today’s Orders"
//               : viewMode === "range"
//               ? "Orders by Date Range"
//               : "All Orders"}{" "}
//             ({filteredOrders.length})
//           </CardTitle>
//           <CardDescription>
//             {viewMode === "today"
//               ? "Orders placed today"
//               : viewMode === "range"
//               ? "Orders within selected date range"
//               : "All orders in the system"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="text-center py-8">Loading orders...</div>
//           ) : filteredOrders.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Order ID</TableHead>
//                   <TableHead>Customer</TableHead>
//                   <TableHead>Designation</TableHead>
//                   <TableHead>Items</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Payment</TableHead>
//                   <TableHead>Period</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredOrders.map((order) => (
//                   <TableRow key={order.$id}>
//                     <TableCell className="font-mono text-sm">#{order.$id.slice(-6)}</TableCell>
//                     <TableCell>
//                       <div className="font-medium">{order.userName}</div>
//                       <div className="text-sm text-muted-foreground">{order.userPhone}</div>
//                     </TableCell>
//                     <TableCell>{order.userDesignation}</TableCell>
//                     <TableCell className="text-sm">
//                       <ul className="list-disc pl-4">
//                         {order.items.map((item, idx) => (
//                           <li key={idx}>{item}</li>
//                         ))}
//                       </ul>
//                     </TableCell>
//                     <TableCell className="font-semibold">₹{order.totalAmount}</TableCell>
//                     <TableCell>
//                       <Badge className={getPaymentMethodColor(order.paymentMethod)}>
//                         {order.paymentMethod}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>{order.paymentPeriod}</TableCell>
//                     <TableCell className="text-sm">
//                       {new Date(order.$createdAt).toLocaleString("en-IN")}
//                     </TableCell>
//                     <TableCell>
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-[600px]">
//                           <h2 className="text-lg font-bold mb-4">Order Details</h2>
//                           <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
//                             {JSON.stringify(selectedOrder, null, 2)}
//                           </pre>
//                         </DialogContent>
//                       </Dialog>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="text-center py-8 text-muted-foreground">No orders found</div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Search, Download, Calendar } from "lucide-react"
import { databases, DATABASE_ID, ORDERS_COLLECTION_ID } from "@/lib/appwrite"
import { Query } from "appwrite"
import { useAuth } from "@/hooks/use-auth"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useToast } from "@/hooks/use-toast"

export interface Order {
  $id: string
  userId: string
  userName: string
  userPhone: string
  userDesignation: string
  items: string[]
  paymentMethod: "cash" | "online"
  paymentPeriod: string
  totalAmount: string // Updated to string to match schema
  $createdAt: string
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"today" | "all" | "range">("today")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) loadOrders()
  }, [user])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, viewMode, fromDate, toDate])

  const loadOrders = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID)
      const sorted = res.documents.sort(
        (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      )
      setOrders(sorted as Order[])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast({ title: "Error", description: "Failed to load orders", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (viewMode === "today") {
      const today = new Date().toDateString()
      filtered = filtered.filter(order => new Date(order.$createdAt).toDateString() === today)
    }

    if (viewMode === "range" && fromDate && toDate) {
      const from = new Date(fromDate)
      const to = new Date(toDate)
      to.setHours(23, 59, 59, 999) // Include entire end date
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.$createdAt)
        return orderDate >= from && orderDate <= to
      })
    }

    if (searchTerm) {
      filtered = filtered.filter(
        order =>
          order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userPhone.includes(searchTerm) ||
          order.$id.includes(searchTerm)
      )
    }

    setFilteredOrders(filtered)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Add header
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("Order Summary Report", pageWidth / 2, 15, { align: "center" })

    // Add timestamp
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const timestamp = new Date().toLocaleString("en-IN")
    doc.text(`Generated on: ${timestamp}`, 14, 25)

    // Add table
    autoTable(doc, {
      startY: 35,
      head: [["Order ID", "Customer", "Designation", "Items", "Amount", "Payment", "Period", "Date"]],
      body: filteredOrders.map(order => [
        order.$id.slice(-6),
        `${order.userName}\n${order.userPhone}`,
        order.userDesignation,
        order.items.join(", "),
        `${order.totalAmount}`,
        order.paymentMethod,
        order.paymentPeriod,
        new Date(order.$createdAt).toLocaleString("en-IN"),
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185], // Blue header
        textColor: [255, 255, 255], // White text
        fontStyle: "bold",
      },
      columnStyles: {
        1: { fontStyle: "bold" }, // Customer (userName, userPhone)
        3: { fontStyle: "bold" }, // Items
        4: { fontStyle: "bold", fillColor: [240, 240, 240] }, // Amount (highlighted background)
        5: { fontStyle: "bold" }, // Payment
        6: { fontStyle: "bold" }, // Period
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Light gray for alternate rows
      },
      margin: { top: 35, bottom: 20 },
      didDrawPage: (data) => {
        // Add footer with page number
        doc.setFontSize(10)
        doc.text(
          `Page ${data.pageNumber} of ${doc.getNumberOfPages()}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        )
      },
    })

    doc.save("order-summary-report.pdf")
  }

  const getPaymentMethodColor = (method: "cash" | "online") =>
    method === "cash" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">View and manage all customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === "today" ? "default" : "outline"} onClick={() => setViewMode("today")}>
            Today’s Orders
          </Button>
          <Button variant={viewMode === "all" ? "default" : "outline"} onClick={() => setViewMode("all")}>
            All Orders
          </Button>
          <Button variant={viewMode === "range" ? "default" : "outline"} onClick={() => setViewMode("range")}>
            Date Range
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-1" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Date Range */}
        {viewMode === "range" && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="pl-8 w-48"
                placeholder="From Date"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="pl-8 w-48"
                placeholder="To Date"
              />
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {viewMode === "today"
              ? "Today’s Orders"
              : viewMode === "range"
              ? "Orders by Date Range"
              : "All Orders"}{" "}
            ({filteredOrders.length})
          </CardTitle>
          <CardDescription>
            {viewMode === "today"
              ? "Orders placed today"
              : viewMode === "range"
              ? "Orders within selected date range"
              : "All orders in the system"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Date</TableHead>
                  {/* <TableHead>Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.$id}>
                    <TableCell className="font-mono text-sm">#{order.$id.slice(-6)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.userName}</div>
                      <div className="text-sm text-muted-foreground">{order.userPhone}</div>
                    </TableCell>
                    <TableCell>{order.userDesignation}</TableCell>
                    <TableCell className="text-sm">
                      <ul className="list-disc pl-4">
                        {order.items.map((item, idx) => (
                          <div key={idx}><p style={{fontSize: '10px'}}>menu name (full/half,plate):</p><h1 style={{fontWeight: 'bold'}}>{item}</h1></div>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="font-semibold">₹{order.totalAmount}</TableCell>
                    <TableCell>
                      <Badge className={getPaymentMethodColor(order.paymentMethod)}>
                        {order.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.paymentPeriod}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.$createdAt).toLocaleString("en-IN")}
                    </TableCell>
                    {/* <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <h2 className="text-lg font-bold mb-4">Order Details</h2>
                          <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                            {JSON.stringify(selectedOrder, null, 2)}
                          </pre>
                        </DialogContent>
                      </Dialog>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No orders found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}