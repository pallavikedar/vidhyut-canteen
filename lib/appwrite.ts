import { Client, Account, Databases, Storage, Teams, Role,ID, Permission,Query} from "appwrite"

const client = new Client()

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "68c5199f0022f542138f")

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const teams = new Teams(client)

export { client }

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "68c59c690038d7f7d1fc"
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "users"
export const MENU_ITEMS_COLLECTION_ID = "menuitems"
export const ORDERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || "orders"
export const ORDER_ITEMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDER_ITEMS_COLLECTION_ID || "orderitems"
export const ADMIN_TEAM_ID = "68c64d7800074308fe93"
export { ID, Permission, Role, Query }