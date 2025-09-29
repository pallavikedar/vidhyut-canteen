"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Navbar } from "@/components/layout/navbar";
import {
  account,
  databases,
  DATABASE_ID,
  ORDERS_COLLECTION_ID,
  ORDER_ITEMS_COLLECTION_ID,
  Query,
} from "@/lib/appwrite";

export default function MyOrdersPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const user = await account.get();
      setUserId(user.$id);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    if (!userId) return;
    try {
      const res = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
        Query.equal("userId", userId),
      ]);
      setOrders(res.documents);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId]);

  // Sort orders latest first
  const displayOrders = orders.sort(
    (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-orange-50">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-orange-600 mb-4">My Orders</h1>

          {displayOrders.length === 0 ? (
            <p className="text-orange-500 text-lg">No orders found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayOrders.map((order) => (
                <div
                  key={order.$id}
                  className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500 hover:shadow-md transition-shadow"
                >
                  <p className="text-gray-900 font-medium text-sm truncate">
                    <b>Items:</b> {order.items.join(", ")}
                  </p>
                  <p className="text-gray-700 mt-1 text-sm">
                    <b>Total:</b> ${order.totalAmount}
                  </p>
                  <p className="text-gray-500 mt-1 text-xs">
                    <b>Date:</b> {new Date(order.$createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
