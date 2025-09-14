import type { CartItem } from "./menu"

export interface Order {
  $id: string
  userId: string
  userName: string
  userPhone: string
  items: OrderItem[]
  totalAmount: number
  paymentMethod: "cash" | "online"
  paymentPeriod: "daily" | "weekly" | "monthly"
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  menuItemId: string
  name: string
  selectedSize: "half" | "full"
  quantity: number
  price: number
  totalPrice: number
}

export class OrderService {
  private orders: Order[] = []

  // Place new order
  async placeOrder(
    userId: string,
    userName: string,
    userPhone: string,
    cartItems: CartItem[],
    paymentMethod: "cash" | "online",
    paymentPeriod: "daily" | "weekly" | "monthly",
  ): Promise<Order> {
    const orderItems: OrderItem[] = cartItems.map((item) => ({
      menuItemId: item.$id,
      name: item.name,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      price: item.selectedSize === "half" ? item.halfPrice : item.fullPrice,
      totalPrice: (item.selectedSize === "half" ? item.halfPrice : item.fullPrice) * item.quantity,
    }))

    const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)

    const newOrder: Order = {
      $id: Date.now().toString(),
      userId,
      userName,
      userPhone,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentPeriod,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.orders.push(newOrder)
    return newOrder
  }

  // Get user orders
  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orders.filter((order) => order.userId === userId)
  }

  // Get all orders (for admin)
  async getAllOrders(): Promise<Order[]> {
    return this.orders
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order> {
    const order = this.orders.find((order) => order.$id === orderId)
    if (!order) {
      throw new Error("Order not found")
    }

    order.status = status
    order.updatedAt = new Date().toISOString()
    return order
  }

  // Get orders by date range
  async getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    return this.orders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
    })
  }

  // Get daily orders
  async getDailyOrders(date: string): Promise<Order[]> {
    const targetDate = new Date(date)
    return this.orders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return orderDate.toDateString() === targetDate.toDateString()
    })
  }

  // Get payment analytics
  async getPaymentAnalytics(period: "daily" | "weekly" | "monthly") {
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "daily":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "weekly":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
    }

    const filteredOrders = this.orders.filter((order) => new Date(order.createdAt) >= startDate)

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalOrders = filteredOrders.length
    const cashPayments = filteredOrders.filter((order) => order.paymentMethod === "cash").length
    const onlinePayments = filteredOrders.filter((order) => order.paymentMethod === "online").length

    return {
      totalRevenue,
      totalOrders,
      cashPayments,
      onlinePayments,
      orders: filteredOrders,
    }
  }
}

export const orderService = new OrderService()
