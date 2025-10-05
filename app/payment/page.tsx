// "use client"

// import { useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { ChevronDown, ChevronUp } from "lucide-react"

// interface PaymentsBoxProps {
//   orders: any[]
//   orderItems: any[]
// }

// export default function PaymentPage({ orders, orderItems }: PaymentsBoxProps) {

//   const [showPaid, setShowPaid] = useState(false)
//   const [showUnpaid, setShowUnpaid] = useState(false)

//   // ✅ Paid orders (from orderItems where balanceAmount = 0)
//   const paidOrders = orderItems
//     .filter((oi: any) => Number(oi.balanceAmount) === 0)
//     .map((oi) => {
//       const ord = orders.find((o) => o.$id === oi.orderId)
//       return {
//         ...oi,
//         orderName: ord?.orderName || "Unnamed Order",
//         userName: oi.userName || ord?.userName,
//         userPhone: oi.userPhone || ord?.userPhone,
//         totalAmount: oi.totalAmount || ord?.totalAmount || 0,
//       }
//     })

//   // ✅ Unpaid orders (orders not in orderItems & paymentMethod = "n/a")
//   const unpaidOrders = orders
//     .filter((ord) => ord.paymentMethod === "n/a")
//     .filter((ord) => !orderItems.some((oi) => oi.orderId === ord.$id))
//     .map((ord) => ({
//       ...ord,
//       orderName: ord.orderName || "Unnamed Order",
//       userName: ord.userName,
//       userPhone: ord.userPhone,
//       totalAmount: ord.totalAmount || 0,
//     }))

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-3">💳 Payments</h2>
//       <Card>
//         <CardContent>
//           {/* Paid Orders */}
//           <div
//             className="cursor-pointer flex justify-between items-center py-3 border-b"
//             onClick={() => setShowPaid(!showPaid)}
//           >
//             <span className="font-semibold text-green-600">
//               Paid Orders ({paidOrders.length}) — ₹
//               {paidOrders.reduce((s, o) => s + Number(o.totalAmount), 0).toLocaleString()}
//             </span>
//             {showPaid ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//           </div>
//           {showPaid && (
//             <ul className="divide-y divide-gray-200">
//               {paidOrders.length === 0 ? (
//                 <li className="py-2 text-gray-500">No paid orders</li>
//               ) : (
//                 paidOrders.map((o) => (
//                   <li key={o.$id} className="py-2 flex justify-between">
//                     <span>
//                       <strong>{o.orderName}</strong> — {o.userName} ({o.userPhone})
//                     </span>
//                     <span className="text-sm text-green-600">₹{o.totalAmount}</span>
//                   </li>
//                 ))
//               )}
//             </ul>
//           )}

//           {/* Unpaid Orders */}
//           <div
//             className="cursor-pointer flex justify-between items-center py-3 border-b mt-4"
//             onClick={() => setShowUnpaid(!showUnpaid)}
//           >
//             <span className="font-semibold text-red-600">
//               Unpaid Orders ({unpaidOrders.length}) — ₹
//               {unpaidOrders.reduce((s, o) => s + Number(o.totalAmount), 0).toLocaleString()}
//             </span>
//             {showUnpaid ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//           </div>
//           {showUnpaid && (
//             <ul className="divide-y divide-gray-200">
//               {unpaidOrders.length === 0 ? (
//                 <li className="py-2 text-gray-500">No unpaid orders</li>
//               ) : (
//                 unpaidOrders.map((o) => (
//                   <li key={o.$id} className="py-2 flex justify-between">
//                     <span>
//                       <strong>{o.orderName}</strong> — {o.userName} ({o.userPhone})
//                     </span>
//                     <span className="text-sm text-red-600">Pending ₹{o.totalAmount}</span>
//                   </li>
//                 ))
//               )}
//             </ul>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
