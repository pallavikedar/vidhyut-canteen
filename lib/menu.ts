// export interface MenuItem {
//   $id: string
//   name: string
//   description: string
//   halfPrice: number
//   fullPrice: number
//   category: string
//   image?: string
//   isAvailable: boolean
//   createdAt: string
// }

// export interface CartItem extends MenuItem {
//   quantity: number
//   selectedSize: "half" | "full"
// }

// export class MenuService {
//   private menuItems: MenuItem[] = [
//     {
//       $id: "1",
//       name: "Masala Dosa",
//       description: "Crispy dosa with spiced potato filling",
//       halfPrice: 25,
//       fullPrice: 45,
//       category: "South Indian",
//       isAvailable: true,
//       createdAt: new Date().toISOString(),
//     },
//     {
//       $id: "2",
//       name: "Chole Bhature",
//       description: "Spicy chickpeas with fried bread",
//       halfPrice: 30,
//       fullPrice: 55,
//       category: "North Indian",
//       isAvailable: true,
//       createdAt: new Date().toISOString(),
//     },
//     {
//       $id: "3",
//       name: "Veg Biryani",
//       description: "Aromatic rice with mixed vegetables",
//       halfPrice: 40,
//       fullPrice: 70,
//       category: "Rice",
//       isAvailable: true,
//       createdAt: new Date().toISOString(),
//     },
//     {
//       $id: "4",
//       name: "Paneer Butter Masala",
//       description: "Rich and creamy paneer curry",
//       halfPrice: 45,
//       fullPrice: 80,
//       category: "North Indian",
//       isAvailable: true,
//       createdAt: new Date().toISOString(),
//     },
//     {
//       $id: "5",
//       name: "Samosa Chat",
//       description: "Crispy samosas with chutneys",
//       halfPrice: 20,
//       fullPrice: 35,
//       category: "Snacks",
//       isAvailable: true,
//       createdAt: new Date().toISOString(),
//     },
//   ]

//   // Get all available menu items
//   async getMenuItems(): Promise<MenuItem[]> {
//     return this.menuItems.filter((item) => item.isAvailable)
//   }

//   // Get all menu items (for admin)
//   async getAllMenuItems(): Promise<MenuItem[]> {
//     return this.menuItems
//   }

//   // Add new menu item
//   async addMenuItem(item: Omit<MenuItem, "$id" | "createdAt">): Promise<MenuItem> {
//     const newItem: MenuItem = {
//       ...item,
//       $id: Date.now().toString(),
//       createdAt: new Date().toISOString(),
//     }

//     this.menuItems.push(newItem)
//     return newItem
//   }

//   // Update menu item
//   async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
//     const index = this.menuItems.findIndex((item) => item.$id === id)
//     if (index === -1) {
//       throw new Error("Menu item not found")
//     }

//     this.menuItems[index] = { ...this.menuItems[index], ...updates }
//     return this.menuItems[index]
//   }

//   // Delete menu item
//   async deleteMenuItem(id: string): Promise<void> {
//     const index = this.menuItems.findIndex((item) => item.$id === id)
//     if (index === -1) {
//       throw new Error("Menu item not found")
//     }

//     this.menuItems.splice(index, 1)
//   }

//   // Toggle item availability
//   async toggleAvailability(id: string): Promise<MenuItem> {
//     const item = this.menuItems.find((item) => item.$id === id)
//     if (!item) {
//       throw new Error("Menu item not found")
//     }

//     item.isAvailable = !item.isAvailable
//     return item
//   }
// }

// export const menuService = new MenuService()

import { ID, Query, Permission, Role } from "appwrite";
import { databases, DATABASE_ID, MENU_ITEMS_COLLECTION_ID, ADMIN_TEAM_ID } from "@/lib/appwrite";

export interface MenuItem {
  $id: string;
  name: string;
  description: string;
  halfPrice: number;
  fullPrice: number;
  category: string;
  isAvailable: boolean;
  createdAt: string; // mapped from $createdAt
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSize: "half" | "full";
}

// --- Normalizer so we always get $id and createdAt properly ---
function normalizeDoc(res: any): MenuItem {
  const doc = res.data ?? res;

  return {
    $id: res.$id,
    name: doc.name,
    description: doc.description,
    halfPrice: doc.halfPrice,
    fullPrice: doc.fullPrice,
    category: doc.category,
    isAvailable: doc.isAvailable,
    createdAt: res.$createdAt, // ✅ always use Appwrite system field
  };
}

class MenuService {
  // Get only available menu items
  async getMenuItems(): Promise<MenuItem[]> {
    const res = await databases.listDocuments(
      DATABASE_ID,
      MENU_ITEMS_COLLECTION_ID,
      [Query.equal("isAvailable", true)]
    );
    return res.documents.map(normalizeDoc);
  }

  // Get all menu items (for admin)
  async getAllMenuItems(): Promise<MenuItem[]> {
    const res = await databases.listDocuments(
      DATABASE_ID,
      MENU_ITEMS_COLLECTION_ID,
      [Query.orderDesc("$createdAt")] // ✅ correct field
    );
    return res.documents.map(normalizeDoc);
  }

  // Add new menu item
  async addMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
  const payload = {
    name: item.name,
    description: item.description,
    halfPrice: Number(item.halfPrice),
    fullPrice: Number(item.fullPrice),
    category: item.category,
    isAvailable: item.isAvailable ?? true,
  };

  const res = await databases.createDocument(
    DATABASE_ID,
    MENU_ITEMS_COLLECTION_ID,
    ID.unique(),
    payload,
    [
      Permission.read(Role.any()), // Allow anyone to read
      Permission.write(Role.team(ADMIN_TEAM_ID)), // Use write instead of create
      Permission.update(Role.team(ADMIN_TEAM_ID)),
      Permission.delete(Role.team(ADMIN_TEAM_ID)),
    ]
  );

  return normalizeDoc(res);
}


  // Update menu item
async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
  const { $id, createdAt, ...cleanUpdates } = updates;

  const res = await databases.updateDocument(
    DATABASE_ID,
    MENU_ITEMS_COLLECTION_ID,
    id,
    cleanUpdates,
    [
      Permission.read(Role.any()),
      Permission.write(Role.team(ADMIN_TEAM_ID)), // Ensure write permission
      Permission.delete(Role.team(ADMIN_TEAM_ID)),
    ]
  );
  return normalizeDoc(res);
}
  // Delete menu item
  async deleteMenuItem(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, MENU_ITEMS_COLLECTION_ID, id);
  }

  // Toggle availability
async toggleAvailability(id: string, isAvailable: boolean): Promise<MenuItem> {
  const res = await databases.updateDocument(
    DATABASE_ID,
    MENU_ITEMS_COLLECTION_ID,
    id,
    { isAvailable },
    [
      Permission.read(Role.any()),
      Permission.write(Role.team(ADMIN_TEAM_ID)), // Ensure write permission
      Permission.delete(Role.team(ADMIN_TEAM_ID)),
    ]
  );
  return normalizeDoc(res);
}
}

export const menuService = new MenuService();
