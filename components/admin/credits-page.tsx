// "use client";

// import { useEffect, useState } from "react";
// import {
//   databases,
//   DATABASE_ID,
//   USERS_COLLECTION_ID,
//   ORDERS_COLLECTION_ID,
//   Query,
// } from "@/lib/appwrite"; // adjust your import path
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// // 📌 Types
// type User = {
//   $id: string;
//   name: string;
//   phone: string;
//   designation?: string | null;
// };

// type Order = {
//   $id: string;
//   userId: string;
//   items: string[];
//   paymentPeriod: "daily" | "weekly" | "monthly";
//   totalAmount: number;
//   receivedPayments?: number;
//   $createdAt: string;
// };

// export default function Credits() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filter, setFilter] = useState<"daily" | "weekly" | "monthly">("daily");
//   const [loading, setLoading] = useState(true);

//   // Fetch users + orders
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const userRes = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID);
//       const orderRes = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
//         Query.equal("paymentPeriod", filter),
//       ]);
//       setUsers(userRes.documents as any);
//       setOrders(orderRes.documents as any);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filter]);

//   // Payment calculation
//   const calculatePayments = (userId: string) => {
//     const userOrders = orders.filter((o) => o.userId === userId);
//     const totalAmount = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
//     const receivedPayments = userOrders.reduce((sum, o) => sum + (o.receivedPayments || 0), 0);
//     const balance = totalAmount - receivedPayments;
//     return { totalAmount, receivedPayments, balance, userOrders };
//   };

//   // Add payment
//   const addPayment = async (orderId: string, amount: number) => {
//     try {
//       const order = orders.find((o) => o.$id === orderId);
//       if (!order) return;
//       const newReceived = (order.receivedPayments || 0) + amount;

//       await databases.updateDocument(DATABASE_ID, ORDERS_COLLECTION_ID, orderId, {
//         receivedPayments: newReceived,
//       });

//       fetchData(); // refresh
//     } catch (err) {
//       console.error("Payment update error:", err);
//     }
//   };

//   // Generate PDF per user
//   const generateUserPDF = (user: User, userOrders: Order[], payments: any) => {
//     const doc = new jsPDF();

//     doc.text(`User Report - ${user.name}`, 14, 20);
//     doc.text(`Phone: ${user.phone}`, 14, 30);
//     doc.text(`Designation: ${user.designation || "N/A"}`, 14, 40);

//     autoTable(doc, {
//       startY: 50,
//       head: [["Items", "Payment Period", "Amount", "Received"]],
//       body: userOrders.map((o) => [
//         o.items.join(", "),
//         o.paymentPeriod,
//         o.totalAmount,
//         o.receivedPayments || 0,
//       ]),
//     });

//     doc.text(`Total: ${payments.totalAmount}`, 14, doc.lastAutoTable.finalY + 10);
//     doc.text(`Received: ${payments.receivedPayments}`, 14, doc.lastAutoTable.finalY + 20);
//     doc.text(`Balance: ${payments.balance}`, 14, doc.lastAutoTable.finalY + 30);

//     doc.save(`${user.name}_orders.pdf`);
//   };

//   // Generate PDF full list
//   const generateAllPDF = () => {
//     const doc = new jsPDF();
//     doc.text(`Orders Report - ${filter.toUpperCase()}`, 14, 20);

//     const rows: any[] = [];

//     users.forEach((u) => {
//       const { totalAmount, receivedPayments, balance } = calculatePayments(u.$id);
//       rows.push([u.name, u.phone, totalAmount, receivedPayments, balance]);
//     });

//     autoTable(doc, {
//       startY: 30,
//       head: [["Name", "Phone", "Total", "Received", "Balance"]],
//       body: rows,
//     });

//     doc.save(`All_Orders_${filter}.pdf`);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Orders Management</h1>

//       {/* Filter */}
//       <select
//         className="border p-2 mb-4"
//         value={filter}
//         onChange={(e) => setFilter(e.target.value as any)}
//       >
//         <option value="daily">Daily</option>
//         <option value="weekly">Weekly</option>
//         <option value="monthly">Monthly</option>
//       </select>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div>
//           {users.map((user) => {
//             const { totalAmount, receivedPayments, balance, userOrders } = calculatePayments(
//               user.$id
//             );

//             return (
//               <div key={user.$id} className="border rounded p-4 mb-4">
//                 <h2 className="font-semibold text-lg">{user.name}</h2>
//                 <p>Phone: {user.phone}</p>
//                 <p>Designation: {user.designation || "N/A"}</p>
//                 <p>Total: {totalAmount} | Received: {receivedPayments} | Balance: {balance}</p>

//                 {/* Orders */}
//                 <ul className="list-disc ml-6">
//                   {userOrders.map((o) => (
//                     <li key={o.$id}>
//                       {o.items.join(", ")} - {o.totalAmount} ({o.paymentPeriod}) | Received:{" "}
//                       {o.receivedPayments || 0}
//                       <button
//                         className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
//                         onClick={() => {
//                           const amt = parseFloat(prompt("Enter payment amount") || "0");
//                           if (amt > 0) addPayment(o.$id, amt);
//                         }}
//                       >
//                         Add Payment
//                       </button>
//                     </li>
//                   ))}
//                 </ul>

//                 {/* PDF Button */}
//                 <button
//                   className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
//                   onClick={() => generateUserPDF(user, userOrders, { totalAmount, receivedPayments, balance })}
//                 >
//                   Generate User PDF
//                 </button>
//               </div>
//             );
//           })}

//           {/* All Users PDF */}
//           <button
//             className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
//             onClick={generateAllPDF}
//           >
//             Generate Full Report PDF
//           </button>
//         </div>
//       )}

//       {/* Credits */}
//       <footer className="mt-10 text-center text-gray-500 text-sm">
//         Developed with ❤️ by <b>Your Name</b>
//       </footer>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import {
//   databases,
//   DATABASE_ID,
//   ORDERS_COLLECTION_ID,
//   ORDER_ITEMS_COLLECTION_ID,
//   Query,
//   ID,
// } from "@/lib/appwrite";

// export default function OrdersToOrderItems() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [orderItems, setOrderItems] = useState<any[]>([]);
//   const [filter, setFilter] = useState("daily");
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState<any>(null);
//   const [amount, setAmount] = useState("");
//   const [mode, setMode] = useState("cash");

//   // Fetch orders + orderitems
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const orderRes = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
//         Query.equal("paymentPeriod", filter),
//       ]);
//       const itemsRes = await databases.listDocuments(DATABASE_ID, ORDER_ITEMS_COLLECTION_ID);

//       console.log("📦 Orders fetched:", orderRes.documents);
//       console.log("📦 OrderItems fetched:", itemsRes.documents);

//       setOrders(orderRes.documents);
//       setOrderItems(itemsRes.documents);
//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filter]);

//   // Group orders by userName+userPhone+paymentPeriod
//   const grouped = orders.reduce((acc: any, order: any) => {
//     const key = `${order.userName || "Unknown"}-${order.userPhone || "NA"}-${
//       order.paymentPeriod || filter
//     }`;
//     if (!acc[key]) {
//       acc[key] = {
//         orderId: order.$id,
//         userId: order.userId,
//         userName: order.userName || "Unknown",
//         userPhone: order.userPhone || "NA",
//         paymentPeriod: order.paymentPeriod || filter,
//         totalAmount: 0,
//       };
//     }
//     acc[key].totalAmount += order.totalAmount || 0;
//     return acc;
//   }, {});

//   const groups = Object.values(grouped).map((g: any) => {
//     const userPayments = orderItems.filter(
//       (oi) =>
//         oi.userId === g.userId &&
//         oi.userPhone === g.userPhone &&
//         oi.paymentPeriod === g.paymentPeriod
//     );

//     const received = userPayments.reduce((sum, p) => sum + (p.receivedAmount || 0), 0);
//     return {
//       ...g,
//       receivedAmount: received,
//       balanceAmount: g.totalAmount - received,
//       payments: userPayments,
//     };
//   });

//   // Add payment
//   const handleAddPayment = async (group: any) => {
//     const amt = parseFloat(amount);
//     if (amt <= 0) return;

//     const newBalance = group.totalAmount - (group.receivedAmount + amt);

//     try {
//       await databases.createDocument(DATABASE_ID, ORDER_ITEMS_COLLECTION_ID, ID.unique(), {
//         orderId: group.orderId,
//         userId: group.userId,
//         userName: group.userName,
//         userPhone: group.userPhone,
//         paymentPeriod: group.paymentPeriod,
//         totalAmount: group.totalAmount,
//         receivedAmount: amt,
//         mode,
//         balanceAmount: newBalance,
//         receivedDate: new Date().toISOString(),
//         createdAt: new Date().toISOString(),
//       });

//       setShowModal(null);
//       setAmount("");
//       setMode("cash");
//       fetchData();
//     } catch (err) {
//       console.error("❌ Add payment error:", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Orders + Payments</h1>

//       {/* Filter */}
//       <select
//         className="border p-2 mb-4"
//         value={filter}
//         onChange={(e) => setFilter(e.target.value)}
//       >
//         <option value="daily">Daily</option>
//         <option value="weekly">Weekly</option>
//         <option value="monthly">Monthly</option>
//       </select>

//       {loading ? (
//         <p>⏳ Loading...</p>
//       ) : groups.length === 0 ? (
//         <div>
//           <p>No grouped data found for {filter}.</p>
//           <pre className="bg-gray-100 p-2 mt-2 text-xs">
//             Raw Orders: {JSON.stringify(orders, null, 2)}
//           </pre>
//         </div>
//       ) : (
//         groups.map((g: any, i) => (
//           <div key={i} className="border rounded p-4 mb-4">
//             <h2 className="font-semibold text-lg">{g.userName}</h2>
//             <p>Phone: {g.userPhone}</p>
//             <p>Period: {g.paymentPeriod}</p>
//             <p>
//               Total: {g.totalAmount} | Received: {g.receivedAmount} | Balance: {g.balanceAmount}
//             </p>

//             <button
//               className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
//               onClick={() => setShowModal(g)}
//             >
//               Received Payment
//             </button>

//             {/* Payment History */}
//             {g.payments.length > 0 && (
//               <div className="mt-3">
//                 <h3 className="font-semibold">Payments</h3>
//                 <ul className="list-disc ml-6">
//                   {g.payments.map((p) => (
//                     <li key={p.$id}>
//                       {p.receivedAmount} via {p.mode} on{" "}
//                       {new Date(p.receivedDate).toLocaleDateString()} | Balance after:{" "}
//                       {p.balanceAmount}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         ))
//       )}

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">
//               Add Payment for {showModal.userName}
//             </h2>
//             <input
//               type="number"
//               placeholder="Amount"
//               className="border p-2 w-full mb-3"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//             />
//             <select
//               className="border p-2 w-full mb-3"
//               value={mode}
//               onChange={(e) => setMode(e.target.value)}
//             >
//               <option value="cash">Cash</option>
//               <option value="upi">UPI</option>
//               <option value="card">Card</option>
//             </select>
//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-4 py-2 bg-gray-400 text-white rounded"
//                 onClick={() => setShowModal(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-green-500 text-white rounded"
//                 onClick={() => handleAddPayment(showModal)}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import {
//   databases,
//   DATABASE_ID,
//   ORDERS_COLLECTION_ID,
//   ORDER_ITEMS_COLLECTION_ID,
//   Query,
//   ID,
// } from "@/lib/appwrite";

// export default function OrdersToOrderItems() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [orderItems, setOrderItems] = useState<any[]>([]);
//   const [filter, setFilter] = useState("daily");
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState<any>(null);
//   const [amount, setAmount] = useState("");
//   const [mode, setMode] = useState("cash");

//   // Fetch orders + payments
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const orderRes = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
//         Query.equal("paymentPeriod", filter),
//       ]);
//       const itemsRes = await databases.listDocuments(DATABASE_ID, ORDER_ITEMS_COLLECTION_ID, [
//         Query.equal("paymentPeriod", filter),
//       ]);
//       setOrders(orderRes.documents);
//       setOrderItems(itemsRes.documents);
//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filter]);

//   // Group orders by user + period
//   const grouped = orders.reduce((acc: any, order: any) => {
//     const key = `${order.userName}-${order.userPhone}-${order.paymentPeriod}`;
//     if (!acc[key]) {
//       acc[key] = {
//         orderId: order.$id,
//         userId: order.userId,
//         userName: order.userName,
//         userPhone: order.userPhone,
//         paymentPeriod: order.paymentPeriod,
//         totalAmount: 0,
//       };
//     }
//     acc[key].totalAmount += order.totalAmount || 0;
//     return acc;
//   }, {});

//   // Merge in payments
//   const groups = Object.values(grouped).map((g: any) => {
//     const userPayments = orderItems.filter(
//       (oi) =>
//         oi.userName === g.userName &&
//         oi.userPhone === g.userPhone &&
//         oi.paymentPeriod === g.paymentPeriod
//     );
//     const received = userPayments.reduce((sum, p) => sum + (p.receivedAmount || 0), 0);
//     return {
//       ...g,
//       receivedAmount: received,
//       balanceAmount: g.totalAmount - received,
//       payments: userPayments,
//     };
//   });

//   // Add payment to orderitems
//   const handleAddPayment = async (group: any) => {
//     const amt = parseFloat(amount);
//     if (!amt || amt <= 0) return;

//     const newBalance = group.totalAmount - (group.receivedAmount + amt);

//     try {
//       await databases.createDocument(DATABASE_ID, ORDER_ITEMS_COLLECTION_ID, ID.unique(), {
//         orderId: group.orderId,
//         userId: group.userId,
//         userName: group.userName,
//         userPhone: group.userPhone,
//         paymentPeriod: group.paymentPeriod,
//         totalAmount: group.totalAmount,
//         receivedAmount: amt,
//         mode,
//         balanceAmount: newBalance,
//         createdAt: new Date().toISOString(),
//       });

//       setShowModal(null);
//       setAmount("");
//       setMode("cash");
//       fetchData();
//     } catch (err) {
//       console.error("❌ Save error:", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Orders → OrderItems</h1>

//       {/* Filter */}
//       <select
//         className="border p-2 mb-4"
//         value={filter}
//         onChange={(e) => setFilter(e.target.value)}
//       >
//         <option value="daily">Daily</option>
//         <option value="weekly">Weekly</option>
//         <option value="monthly">Monthly</option>
//       </select>

//       {loading ? (
//         <p>⏳ Loading...</p>
//       ) : groups.length === 0 ? (
//         <p>No orders found for {filter}</p>
//       ) : (
//         groups.map((g: any, i) => (
//           <div key={i} className="border rounded p-4 mb-4">
//             <h2 className="font-semibold text-lg">{g.userName}</h2>
//             <p>Phone: {g.userPhone}</p>
//             <p>Period: {g.paymentPeriod}</p>
//             <p>
//               Total: {g.totalAmount} | Received: {g.receivedAmount} | Balance:{" "}
//               {g.balanceAmount}
//             </p>

//             <button
//               className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
//               onClick={() => setShowModal(g)}
//             >
//               Add Payment
//             </button>

//             {/* Payment History */}
//             {g.payments.length > 0 && (
//               <div className="mt-3">
//                 <h3 className="font-semibold">Payments</h3>
//                 <ul className="list-disc ml-6">
//                   {g.payments.map((p: any) => (
//                     <li key={p.$id}>
//                       {p.receivedAmount} via {p.mode} on{" "}
//                       {new Date(p.createdAt).toLocaleDateString()} | Balance:{" "}
//                       {p.balanceAmount}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         ))
//       )}

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">
//               Add Payment for {showModal.userName}
//             </h2>
//             <input
//               type="number"
//               placeholder="Amount"
//               className="border p-2 w-full mb-3"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//             />
//             <select
//               className="border p-2 w-full mb-3"
//               value={mode}
//               onChange={(e) => setMode(e.target.value)}
//             >
//               <option value="cash">Cash</option>
//               <option value="upi">UPI</option>
//               <option value="card">Card</option>
//             </select>
//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-4 py-2 bg-gray-400 text-white rounded"
//                 onClick={() => setShowModal(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-green-500 text-white rounded"
//                 onClick={() => handleAddPayment(showModal)}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   databases,
//   ID,
//   Permission,
//   Role,
//   DATABASE_ID,
//   ORDERS_COLLECTION_ID,
//   ORDER_ITEMS_COLLECTION_ID,
//   ADMIN_TEAM_ID,
// } from "@/lib/appwrite";
// import jsPDF from "jspdf";

// interface Payment {
//   amount: number;
//   mode: string;
//   receivedDate: string;
// }

// export default function CreditsPage() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [orderItems, setOrderItems] = useState<any[]>([]);
//   const [filter, setFilter] = useState<string>("daily");
//   const [expanded, setExpanded] = useState<Record<string, boolean>>({});

//   // Fetch all orders
//   const fetchOrders = async () => {
//     try {
//       const res = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID);
//       setOrders(res.documents);
//     } catch (err) {
//       console.error("❌ Fetch orders error:", err);
//     }
//   };

//   // Fetch all order items
//   const fetchOrderItems = async () => {
//     try {
//       const res = await databases.listDocuments(DATABASE_ID, ORDER_ITEMS_COLLECTION_ID);
//       setOrderItems(res.documents);
//     } catch (err) {
//       console.error("❌ Fetch orderItems error:", err);
//     }
//   };

//   // Handle payment
// // In handleReceivePayment
// const handleReceivePayment = async (order: any) => {
//   const amount = Number(prompt("Enter Received Amount:"));
//   if (!amount || amount <= 0) return;
//   const mode = prompt("Enter Mode (cash/upi/card):", "cash") || "cash";
//   const receivedDate = new Date().toISOString();

//   // Find existing order item for the same user + phone + period
//   const existingItem = orderItems.find(
//     (oi) =>
//       oi.userName === order.userName &&
//       oi.userPhone === order.userPhone &&
//       oi.paymentPeriod === order.paymentPeriod
//   );

//   if (existingItem) {
//     // Update existing document
//     const existingPayments: Payment[] = existingItem.payments
//       ? Array.isArray(existingItem.payments)
//         ? existingItem.payments
//         : JSON.parse(existingItem.payments)
//       : [];

//     const updated = {
//       ...existingItem,
//       receivedAmount: existingItem.receivedAmount + amount,
//       balanceAmount: existingItem.totalAmount - (existingItem.receivedAmount + amount),
//       mode,
//       payments: [...existingPayments, { amount, mode, receivedDate }],
//     };

//     await databases.updateDocument(
//       DATABASE_ID,
//       ORDER_ITEMS_COLLECTION_ID,
//       existingItem.$id,
//       { ...updated, payments: JSON.stringify(updated.payments) }
//     );
//   } else {
//     // Create new order item
//     const newItem = {
//       orderId: order.$id,
//       userId: order.userId,
//       userName: order.userName,
//       userPhone: order.userPhone,
//       paymentPeriod: order.paymentPeriod,
//       totalAmount: order.totalAmount || order.amount || 0,
//       receivedAmount: amount,
//       balanceAmount: (order.totalAmount || order.amount || 0) - amount,
//       mode,
//       payments: JSON.stringify([{ amount, mode, receivedDate }]),
//     };

//     await databases.createDocument(
//       DATABASE_ID,
//       ORDER_ITEMS_COLLECTION_ID,
//       ID.unique(),
//       newItem,
//       [
//         Permission.read(Role.team(ADMIN_TEAM_ID)),
//         Permission.update(Role.team(ADMIN_TEAM_ID)),
//         Permission.delete(Role.team(ADMIN_TEAM_ID)),
//       ]
//     );
//   }

//   // Refresh orderItems to reflect updated values
//   fetchOrderItems();
// };


//   useEffect(() => {
//     fetchOrders();
//     fetchOrderItems();
//   }, []);

//   const toggleExpand = (id: string) => {
//     setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

// const generatePDF = (order: any) => {
//   const doc = new jsPDF();

//   doc.setFontSize(16);
//   doc.text(`Payment Report for ${order.userName}`, 10, 20);

//   doc.setFontSize(12);
//   doc.text(`Phone: ${order.userPhone}`, 10, 30);
//   doc.text(`Payment Period: ${order.paymentPeriod}`, 10, 40);
//   doc.text(`Total Amount: ${order.totalAmount}`, 10, 50);
//   doc.text(`Received Amount: ${order.receivedAmount}`, 10, 60);
//   doc.text(`Balance Amount: ${order.balanceAmount}`, 10, 70);

//   if (order.payments.length > 0) {
//     doc.text("Payments:", 10, 85);

//     let y = 95;
//     order.payments.forEach((p: any, idx: number) => {
//       doc.text(
//         `${idx + 1}. Amount: ${p.amount}, Mode: ${p.mode}, Date: ${new Date(
//           p.receivedDate
//         ).toLocaleString()}`,
//         10,
//         y
//       );
//       y += 10;
//     });
//   } else {
//     doc.text("No payments yet.", 10, 85);
//   }

//   doc.save(`${order.userName}_Payment_Report.pdf`);
// };




//   // Merge orders with orderItems for display
//   const displayOrders = orders.map((order) => {
//     const item = orderItems.find(
//       (oi) => oi.orderId === order.$id && oi.userId === order.userId && oi.paymentPeriod === order.paymentPeriod
//     );

//     const payments: Payment[] = item?.payments
//       ? Array.isArray(item.payments)
//         ? item.payments
//         : JSON.parse(item.payments)
//       : [];

//     return {
//       ...order,
//       receivedAmount: item?.receivedAmount || 0,
//       balanceAmount: item ? item.balanceAmount : order.totalAmount || order.amount || 0,
//       mode: item?.mode || "",
//       payments,
//       $id: item ? item.$id : order.$id,
//     };
//   });

//   return (
//     <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
//       <h2>📦 Filter Orders</h2>
//       <div style={{ marginBottom: 30 }}>
//   {["daily", "weekly", "monthly"].map((f) => (
//     <button
//       key={f}
//       onClick={() => setFilter(f)}
//       style={{
//         marginRight: 10,
//         padding: "8px 16px",
//         backgroundColor: filter === f ? "#4CAF50" : "#eee",
//         color: filter === f ? "#fff" : "#333",
//         border: "none",
//         borderRadius: 5,
//         cursor: "pointer",
//       }}
    
      
//     >
//       {f.charAt(0).toUpperCase() + f.slice(1)}
//     </button>
//   ))}
// </div>


//       {displayOrders
//         .filter((o) => (filter ? o.paymentPeriod === filter : true))
//         .map((order) => (
//           <div
//             key={order.$id}
//             style={{
//               border: "1px solid #ccc",
//               borderRadius: 8,
//               padding: 15,
//               marginBottom: 15,
//               boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <div>
//                 <h3 style={{ margin: 0 }}>{order.userName}</h3>
//                 <p style={{ margin: "2px 0", color: "#555" }}>{order.userPhone}</p>
//                 <p style={{ margin: "2px 0" }}>
//                   Total: <b>{order.totalAmount}</b> | Received: <b>{order.receivedAmount}</b> | Balance:{" "}
//                   <b>{order.balanceAmount}</b>
//                 </p>
//               </div>
//               <div style={{ display: "flex", gap: 10 }}>
//   <button
//     onClick={() => handleReceivePayment(order)}
//     style={{
//       padding: "6px 12px",
//       backgroundColor: "#2196F3",
//       color: "#fff",
//       border: "none",
//       borderRadius: 5,
//       cursor: "pointer",
//     }}
//   >
//     Add Payment
//   </button>

//   {order.payments.length > 0 && (
//     <>
//       <button
//         onClick={() => toggleExpand(order.$id)}
//         style={{
//           padding: "6px 12px",
//           backgroundColor: "#f0f0f0",
//           border: "none",
//           borderRadius: 5,
//           cursor: "pointer",
//         }}
//       >
//         {expanded[order.$id] ? "Hide Details" : "See More"}
//       </button>

//       <button
//         onClick={() => generatePDF(order)}
//         style={{
//           padding: "6px 12px",
//           backgroundColor: "#4CAF50",
//           color: "#fff",
//           border: "none",
//           borderRadius: 5,
//           cursor: "pointer",
//         }}
//       >
//         Print / PDF
//       </button>
//     </>
//   )}
// </div>

//             </div>

//             {expanded[order.$id] && order.payments.length > 0 && (
//               <div style={{ marginTop: 15, borderTop: "1px solid #ddd", paddingTop: 10 }}>
//                 <h4>Payment Details</h4>
//                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                   <thead>
//                     <tr style={{ backgroundColor: "#f9f9f9" }}>
//                       <th style={{ textAlign: "left", padding: 8 }}>Amount</th>
//                       <th style={{ textAlign: "left", padding: 8 }}>Mode</th>
//                       <th style={{ textAlign: "left", padding: 8 }}>Date & Time</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {order.payments.map((p, idx) => (
//                       <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
//                         <td style={{ padding: 8 }}>{p.amount}</td>
//                         <td style={{ padding: 8 }}>{p.mode}</td>
//                         <td style={{ padding: 8 }}>{new Date(p.receivedDate).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         ))}
//     </div>
//   );
// }




















// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   databases,
//   ID,
//   Permission,
//   Role,
//   DATABASE_ID,
//   ORDERS_COLLECTION_ID,
//   ORDER_ITEMS_COLLECTION_ID,
//   ADMIN_TEAM_ID,
// } from "@/lib/appwrite";
// import jsPDF from "jspdf";

// interface Payment {
//   amount: number;
//   mode: string;
//   receivedDate: string;
// }

// export default function CreditsPage() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [orderItems, setOrderItems] = useState<any[]>([]);
//   const [filter, setFilter] = useState<string>("daily");
//   const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  
//   // Popup state
//   const [popupOpen, setPopupOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<any>(null);
//   const [paymentAmount, setPaymentAmount] = useState<number>(0);
//   const [paymentMode, setPaymentMode] = useState<string>("cash");

//   const fetchOrders = async () => {
//     try {
//       const res = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID);
//       setOrders(res.documents);
//     } catch (err) {
//       console.error("❌ Fetch orders error:", err);
//     }
//   };

//   const fetchOrderItems = async () => {
//     try {
//       const res = await databases.listDocuments(DATABASE_ID, ORDER_ITEMS_COLLECTION_ID);
//       setOrderItems(res.documents);
//     } catch (err) {
//       console.error("❌ Fetch orderItems error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//     fetchOrderItems();
//   }, []);

//   const toggleExpand = (id: string) => {
//     setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const openPaymentPopup = (order: any) => {
//     setSelectedOrder(order);
//     setPaymentAmount(0);
//     setPaymentMode("cash");
//     setPopupOpen(true);
//   };

//   const handlePaymentSubmit = async () => {
//     if (!paymentAmount || paymentAmount <= 0) {
//       alert("Enter a valid amount");
//       return;
//     }

//     const receivedDate = new Date().toISOString();

//     const existingItem = orderItems.find(
//       (oi) =>
//         oi.userName === selectedOrder.userName &&
//         oi.userPhone === selectedOrder.userPhone &&
//         oi.paymentPeriod === selectedOrder.paymentPeriod
//     );

//     if (existingItem) {
//       const existingPayments = existingItem.payments ? JSON.parse(existingItem.payments) : [];
//       const updated = {
//         ...existingItem,
//         receivedAmount: existingItem.receivedAmount + paymentAmount,
//         balanceAmount: existingItem.totalAmount - (existingItem.receivedAmount + paymentAmount),
//         mode: paymentMode,
//         payments: [...existingPayments, { amount: paymentAmount, mode: paymentMode, receivedDate }],
//       };
//       await databases.updateDocument(
//         DATABASE_ID,
//         ORDER_ITEMS_COLLECTION_ID,
//         existingItem.$id,
//         { ...updated, payments: JSON.stringify(updated.payments) }
//       );
//     } else {
//       const newItem = {
//         orderId: selectedOrder.$id,
//         userId: selectedOrder.userId,
//         userName: selectedOrder.userName,
//         userPhone: selectedOrder.userPhone,
//         paymentPeriod: selectedOrder.paymentPeriod,
//         totalAmount: selectedOrder.totalAmount || selectedOrder.amount || 0,
//         receivedAmount: paymentAmount,
//         balanceAmount: (selectedOrder.totalAmount || selectedOrder.amount || 0) - paymentAmount,
//         mode: paymentMode,
//         payments: JSON.stringify([{ amount: paymentAmount, mode: paymentMode, receivedDate }]),
//       };
//       await databases.createDocument(
//         DATABASE_ID,
//         ORDER_ITEMS_COLLECTION_ID,
//         ID.unique(),
//         newItem,
//         [
//           Permission.read(Role.team(ADMIN_TEAM_ID)),
//           Permission.update(Role.team(ADMIN_TEAM_ID)),
//           Permission.delete(Role.team(ADMIN_TEAM_ID)),
//         ]
//       );
//     }

//     fetchOrderItems();
//     setPopupOpen(false);
//   };

//   const generatePDF = (order: any) => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text(`Payment Report for ${order.userName}`, 10, 20);
//     doc.setFontSize(12);
//     doc.text(`Phone: ${order.userPhone}`, 10, 30);
//     doc.text(`Payment Period: ${order.paymentPeriod}`, 10, 40);
//     doc.text(`Total Amount: ${order.totalAmount}`, 10, 50);
//     doc.text(`Received Amount: ${order.receivedAmount}`, 10, 60);
//     doc.text(`Balance Amount: ${order.balanceAmount}`, 10, 70);
//     if (order.payments.length > 0) {
//       doc.text("Payments:", 10, 85);
//       let y = 95;
//       order.payments.forEach((p: any, idx: number) => {
//         doc.text(
//           `${idx + 1}. Amount: ${p.amount}, Mode: ${p.mode}, Date: ${new Date(p.receivedDate).toLocaleString()}`,
//           10,
//           y
//         );
//         y += 10;
//       });
//     } else {
//       doc.text("No payments yet.", 10, 85);
//     }
//     doc.save(`${order.userName}_Payment_Report.pdf`);
//   };

//   // Merge orders with orderItems
//   const displayOrders = orders.map((order) => {
//     const item = orderItems.find(
//       (oi) => oi.orderId === order.$id && oi.userId === order.userId && oi.paymentPeriod === order.paymentPeriod
//     );
//     const payments: Payment[] = item?.payments
//       ? Array.isArray(item.payments)
//         ? item.payments
//         : JSON.parse(item.payments)
//       : [];
//     return {
//       ...order,
//       receivedAmount: item?.receivedAmount || 0,
//       balanceAmount: item ? item.balanceAmount : order.totalAmount || order.amount || 0,
//       mode: item?.mode || "",
//       payments,
//       $id: item ? item.$id : order.$id,
//     };
//   });

//   return (
//     <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
//       <h2>📦 Filter Orders</h2>
//       <div style={{ marginBottom: 30 }}>
//         {["daily", "weekly", "monthly"].map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             style={{
//               marginRight: 10,
//               padding: "8px 16px",
//               backgroundColor: filter === f ? "#d86d38" : "#eee",
//               color: filter === f ? "#fff" : "#333",
//               border: "none",
//               borderRadius: 5,
//               cursor: "pointer",
//             }}
//           >
//             {f.charAt(0).toUpperCase() + f.slice(1)}
//           </button>
//         ))}
//       </div>

//       {displayOrders
//         .filter((o) => (filter ? o.paymentPeriod === filter : true))
//         .map((order) => (
//           <div
//             key={order.$id}
//             style={{
//               border: "1px solid #ccc",
//               borderRadius: 8,
//               padding: 15,
//               marginBottom: 15,
//               boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
//               backgroundColor:"#fffbed"
//             }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <div>
//                 <h3 style={{ margin: 0 }}>{order.userName}</h3>
//                 <p style={{ margin: "2px 0", color: "#555" }}>{order.userPhone}</p>
//                 <p style={{ margin: "2px 0" }}>
//                   Total: <b>{order.totalAmount}</b> | Received: <b>{order.receivedAmount}</b> | Balance: <b>{order.balanceAmount}</b>
//                 </p>
//               </div>
//               <div style={{ display: "flex", gap: 10 }}>
//                 <button
//                   onClick={() => openPaymentPopup(order)}
//                   style={{
//                     padding: "6px 12px",
//                     backgroundColor: "#d86d38",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: 5,
//                     cursor: "pointer",
//                   }}
//                 >
//                   Add Payment
//                 </button>

//                 {order.payments.length > 0 && (
//                   <>
//                     <button
//                       onClick={() => toggleExpand(order.$id)}
//                       style={{
//                         padding: "6px 12px",
//                         backgroundColor: "#ffffffff",
                        
//                         border: "1px solid #faa57ac3",
//                         borderRadius: 5,
//                         cursor: "pointer",
//                       }}
//                     >
//                       {expanded[order.$id] ? "Hide Details" : "See More"}
//                     </button>

//                     <button
//                       onClick={() => generatePDF(order)}
//                       style={{
//                         padding: "6px 12px",
//                         backgroundColor: "#4CAF50",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: 5,
//                         cursor: "pointer",
//                       }}
//                     >
//                       Print / PDF
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>

//             {expanded[order.$id] && order.payments.length > 0 && (
//               <div style={{ marginTop: 15, borderTop: "1px solid #ddd", paddingTop: 10 }}>
//                 <h4>Payment Details</h4>
//                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                   <thead>
//                     <tr style={{ backgroundColor: "#f9f9f9" }}>
//                       <th style={{ textAlign: "left", padding: 8 }}>Amount</th>
//                       <th style={{ textAlign: "left", padding: 8 }}>Mode</th>
//                       <th style={{ textAlign: "left", padding: 8 }}>Date & Time</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {order.payments.map((p, idx) => (
//                       <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
//                         <td style={{ padding: 8 }}>{p.amount}</td>
//                         <td style={{ padding: 8 }}>{p.mode}</td>
//                         <td style={{ padding: 8 }}>{new Date(p.receivedDate).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         ))}

//       {/* Popup form for Add Payment */}
//       {popupOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0,0,0,0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 8, width: 350 }}>
//             <h3>Add Payment for {selectedOrder?.userName}</h3>
//             <input
//               type="number"
//               placeholder="Enter Amount"
//               value={paymentAmount}
//               onChange={(e) => setPaymentAmount(Number(e.target.value))}
//               style={{ width: "100%", padding: 8, marginBottom: 10 }}
//             />
//             <div style={{ marginBottom: 20 }}>
//               <label>
//                 <input
//                   type="radio"
//                   name="mode"
//                   value="cash"
//                   checked={paymentMode === "cash"}
//                   onChange={() => setPaymentMode("cash")}
//                 />{" "}
//                 Cash
//               </label>{" "}
//               <label>
//                 <input
//                   type="radio"
//                   name="mode"
//                   value="upi"
//                   checked={paymentMode === "upi"}
//                   onChange={() => setPaymentMode("upi")}
//                 />{" "}
//                 UPI
//               </label>{" "}
//               <label>
//                 <input
//                   type="radio"
//                   name="mode"
//                   value="card"
//                   checked={paymentMode === "card"}
//                   onChange={() => setPaymentMode("card")}
//                 />{" "}
//                 Card
//               </label>
//             </div>
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <button onClick={() => setPopupOpen(false)} style={{ padding: "6px 12px" }}>
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePaymentSubmit}
//                 style={{ padding: "6px 12px", backgroundColor: "#4CAF50", color: "#fff" }}
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import {
  databases,
  ID,
  Permission,
  Role,
  DATABASE_ID,
  ORDERS_COLLECTION_ID,
  ORDER_ITEMS_COLLECTION_ID,
  ADMIN_TEAM_ID,
} from "@/lib/appwrite";
import jsPDF from "jspdf";

interface Payment {
  amount: number;
  mode: string;
  receivedDate: string;
}

export default function CreditsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("daily");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>("cash");

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID);
      setOrders(res.documents);
    } catch (err) {
      console.error("❌ Fetch orders error:", err);
    }
  };

  // Fetch order items
  const fetchOrderItems = async () => {
    try {
      const res = await databases.listDocuments(DATABASE_ID, ORDER_ITEMS_COLLECTION_ID);
      setOrderItems(res.documents);
    } catch (err) {
      console.error("❌ Fetch orderItems error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchOrderItems();
  }, []);

  // Toggle order details
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Open popup for Add Payment
  const openPaymentPopup = (order: any, fullPayment: boolean = false) => {
    setSelectedOrder(order);
    setPaymentAmount(order.balanceAmount); // pre-fill remaining balance
    setPaymentMode("cash"); // default
    setPopupOpen(true);
  };

  // Handle payment submit
  const handlePaymentSubmit = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    const receivedDate = new Date().toISOString();

    const existingItem = orderItems.find(
      (oi) =>
        oi.userName === selectedOrder.userName &&
        oi.userPhone === selectedOrder.userPhone &&
        oi.paymentPeriod === selectedOrder.paymentPeriod &&
        oi.orderId === selectedOrder.$id
    );

    if (existingItem) {
      const existingPayments = existingItem.payments ? JSON.parse(existingItem.payments) : [];
      const updated = {
        ...existingItem,
        receivedAmount: Number(existingItem.receivedAmount) + paymentAmount,
        balanceAmount: Number(existingItem.totalAmount) - (Number(existingItem.receivedAmount) + paymentAmount),
        payments: [...existingPayments, { amount: paymentAmount, mode: paymentMode, receivedDate }],
      };

      await databases.updateDocument(
        DATABASE_ID,
        ORDER_ITEMS_COLLECTION_ID,
        existingItem.$id,
        { ...updated, payments: JSON.stringify(updated.payments), mode: paymentMode }
      );
    } else {
      const newItem = {
        orderId: selectedOrder.$id,
        userId: selectedOrder.userId,
        userName: selectedOrder.userName,
        userPhone: selectedOrder.userPhone,
        paymentPeriod: selectedOrder.paymentPeriod,
        totalAmount: selectedOrder.totalAmount || selectedOrder.amount || 0,
        receivedAmount: paymentAmount,
        balanceAmount: (selectedOrder.totalAmount || selectedOrder.amount || 0) - paymentAmount,
        payments: JSON.stringify([{ amount: paymentAmount, mode: paymentMode, receivedDate }]),
        mode: paymentMode,
      };

      await databases.createDocument(
        DATABASE_ID,
        ORDER_ITEMS_COLLECTION_ID,
        ID.unique(),
        newItem,
        [
          Permission.read(Role.team(ADMIN_TEAM_ID)),
          Permission.update(Role.team(ADMIN_TEAM_ID)),
          Permission.delete(Role.team(ADMIN_TEAM_ID)),
        ]
      );
    }

    fetchOrderItems();
    setPopupOpen(false);
  };

  // Merge orders with payments
  const displayOrders = orders.map((order) => {
    const item = orderItems.find(
      (oi) => oi.orderId === order.$id && oi.userId === order.userId && oi.paymentPeriod === order.paymentPeriod
    );
    const payments: Payment[] = item?.payments
      ? Array.isArray(item.payments)
        ? item.payments
        : JSON.parse(item.payments)
      : [];
    return {
      ...order,
      receivedAmount: item?.receivedAmount || 0,
      balanceAmount: item ? item.balanceAmount : order.totalAmount || order.amount || 0,
      payments,
      $id: order.$id,
    };
  });

  // Merge orders per user/paymentPeriod
  const mergedOrders = Object.values(
    displayOrders
      .filter((o) => (filter ? o.paymentPeriod === filter : true))
      .filter(
        (o) =>
          o.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.userPhone.includes(searchTerm)
      )
      .reduce((acc: Record<string, any>, order) => {
        const key = `${order.userId}_${order.paymentPeriod}`;
        if (!acc[key]) {
          acc[key] = {
            userId: order.userId,
            userName: order.userName,
            userPhone: order.userPhone,
            paymentPeriod: order.paymentPeriod,
            orders: [order],
            totalAmount: Number(order.totalAmount),
            receivedAmount: Number(order.receivedAmount),
            balanceAmount: Number(order.balanceAmount),
          };
        } else {
          acc[key].orders.push(order);
          acc[key].totalAmount += Number(order.totalAmount);
          acc[key].receivedAmount += Number(order.receivedAmount);
          acc[key].balanceAmount += Number(order.balanceAmount);
        }
        return acc;
      }, {})
  );

  // Sort each user's orders by most recent first
  mergedOrders.forEach((user) => {
    user.orders.sort(
      (a: any, b: any) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
    );
  });

  // Generate PDF
  const generatePDF = (user: any) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Payment Report - ${user.userName}`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Phone: ${user.userPhone}`, 10, 30);
    doc.text(`Payment Period: ${user.paymentPeriod}`, 10, 40);
    doc.text(`Total Amount: ${user.totalAmount}`, 10, 50);
    doc.text(`Received: ${user.receivedAmount}`, 10, 60);
    doc.text(`Balance: ${user.balanceAmount}`, 10, 70);

    let y = 85;
    user.orders.forEach((order: any, idx: number) => {
      doc.text(
        `Order ${idx + 1} (ID: ${order.$id.slice(-6)} | Date: ${new Date(order.$createdAt).toLocaleDateString()})`,
        10,
        y
      );
      y += 10;
      if (order.payments.length > 0) {
        order.payments.forEach((p: any, pidx: number) => {
          doc.text(
            `Payment ${pidx + 1}: Amount: ${p.amount}, Mode: ${p.mode}, Date: ${new Date(
              p.receivedDate
            ).toLocaleString()}`,
            12,
            y
          );
          y += 10;
        });
      } else {
        doc.text("No payments yet.", 12, y);
        y += 10;
      }
    });
    doc.save(`${user.userName}_Payment_Report.pdf`);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: 15 }}>📦 Filter Orders</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: 8, marginBottom: 15, width: "100%", borderRadius: 6, border: "1px solid #ccc" }}
      />

      {/* Filter buttons */}
      <div style={{ marginBottom: 20 }}>
        {["daily", "weekly", "monthly"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              marginRight: 10,
              padding: "8px 16px",
              backgroundColor: filter === f ? "#d86d38" : "#eee",
              color: filter === f ? "#fff" : "#333",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {mergedOrders.map((user) => (
        <div
          key={user.userId}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 20,
            marginBottom: 20,
            backgroundColor: "#fff",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3>{user.userName}</h3>
              <p>{user.userPhone}</p>
              <p>
                Total: <b>{user.totalAmount}</b> | Received: <b>{user.receivedAmount}</b> | Balance:{" "}
                <b style={{ color: user.balanceAmount === 0 ? "green" : "red" }}>{user.balanceAmount}</b>
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {user.balanceAmount > 0 && (
                <button
                  onClick={() => openPaymentPopup(user.orders.find((o: any) => o.balanceAmount > 0), true)}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Pay Full
                </button>
              )}
              <button
                onClick={() => generatePDF(user)}
                style={{
                  padding: "6px 14px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                PDF
              </button>
            </div>
          </div>

          <div style={{ marginTop: 15 }}>
            {user.orders.map((order: any) => (
              <div
                key={order.$id}
                style={{
                  padding: 12,
                  borderTop: "1px solid #eee",
                  borderRadius: 6,
                  marginBottom: 8,
                  backgroundColor: order.balanceAmount === 0 ? "#e6ffed" : "#fff9f0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0 }}>
                      <b>Order ID:</b> {order.$id.slice(-6)} | <b>Date:</b>{" "}
                      {new Date(order.$createdAt).toLocaleDateString()}
                    </p>
                    <p style={{ margin: 0 }}>
                      Total: {order.totalAmount} | Received: {order.receivedAmount} | Pending:{" "}
                      {order.balanceAmount}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {order.balanceAmount > 0 && (
                      <button
                        onClick={() => openPaymentPopup(order)}
                        style={{
                          padding: "4px 10px",
                          backgroundColor: "#d86d38",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        Add Payment
                      </button>
                    )}
                    <button
                      onClick={() => toggleExpand(order.$id)}
                      style={{
                        padding: "4px 10px",
                        backgroundColor: "#f1f1f1",
                        color: "#333",
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      {expanded[order.$id] ? "Hide Details" : "See Payments"}
                    </button>
                  </div>
                </div>
                {expanded[order.$id] && order.payments.length > 0 && (
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f9f9f9" }}>
                        <th style={{ padding: 8 }}>Amount</th>
                        <th style={{ padding: 8 }}>Mode</th>
                        <th style={{ padding: 8 }}>Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.payments.map((p: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ padding: 8 }}>{p.amount}</td>
                          <td style={{ padding: 8 }}>{p.mode}</td>
                          <td style={{ padding: 8 }}>{new Date(p.receivedDate).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Payment Popup */}
      {popupOpen && selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 8, width: 350 }}>
            <h3>Add Payment for {selectedOrder.userName}</h3>
            <input
              type="number"
              value={paymentAmount}
              disabled // pre-filled amount
              style={{ width: "100%", padding: 8, marginBottom: 10, backgroundColor: "#f1f1f1" }}
            />
            <div style={{ marginBottom: 20 }}>
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="cash"
                  checked={paymentMode === "cash"}
                  onChange={() => setPaymentMode("cash")}
                />{" "}
                Cash
              </label>{" "}
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="upi"
                  checked={paymentMode === "upi"}
                  onChange={() => setPaymentMode("upi")}
                />{" "}
                UPI
              </label>{" "}
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="card"
                  checked={paymentMode === "card"}
                  onChange={() => setPaymentMode("card")}
                />{" "}
                Card
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setPopupOpen(false)} style={{ padding: "6px 12px" }}>
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                style={{ padding: "6px 12px", backgroundColor: "#4CAF50", color: "#fff" }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
