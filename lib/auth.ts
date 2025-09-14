// // lib/auth.ts
// import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from "./appwrite"
// import { ID } from "appwrite"

// // Hardcoded admin credentials
// const ADMIN_EMAIL = "admin@vidyutcanteen.com"
// const ADMIN_PASSWORD = "Admin@123"

// export interface User {
//   $id: string
//   name: string
//   email: string
//   isAdmin?: boolean
//   phone?: string
//   designation?: string
// }

// export interface RegisterData {
//   name: string
//   email: string
//   password: string
//   phone?: string
//   designation?: string
// }

// export const authService = {
//   // ============================
//   // REGISTER USER
//   // ============================
// async register(data: RegisterData) {
//   try {
//     // Make sure no session is active
//     try { await account.deleteSession("current") } catch {}

//     // 1. Create user in Auth
//     const res = await account.create(ID.unique(), data.email, data.password, data.name)

//     // 2. Create session for new user
//     await account.createEmailPasswordSession(data.email, data.password)

//     // 3. Store profile in database
//     await databases.createDocument(
//       DATABASE_ID,
//       USERS_COLLECTION_ID,
//       ID.unique(),
//       {
//         authId: res.$id,
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         designation: data.designation,
//         isAdmin: false,
//       }
//     )

//     return {
//       $id: res.$id,
//       name: data.name,
//       email: data.email,
//       phone: data.phone,
//       designation: data.designation,
//       isAdmin: false,
//     }
//   } catch (err: any) {
//     console.error("Registration failed:", err)
//     throw err
//   }
// },



//   // ============================
//   // LOGIN USER
//   // ============================
//   async login(email: string, password: string): Promise<User> {
//     if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
//       return { $id: "admin", name: "Admin", email: ADMIN_EMAIL, isAdmin: true }
//     }

//     try {
//       await account.createEmailPasswordSession(email, password)
//       const user = await account.get()
//       console.log("Logged in user:", user)

//       // Fetch profile from database
//       let phone: string | undefined
//       let designation: string | undefined
//       try {
//         const userDoc = await databases.listDocuments(
//           DATABASE_ID,
//           USERS_COLLECTION_ID,
//           [`authId=${user.$id}`]
//         )
//         if (userDoc.total > 0) {
//           const profile = userDoc.documents[0]
//           phone = profile.phone
//           designation = profile.designation
//         }
//       } catch (err) {
//         console.warn("No user profile found in database for:", user.email)
//       }

//       return {
//         $id: user.$id,
//         name: user.name,
//         email: user.email,
//         phone,
//         designation,
//         isAdmin: false,
//       }
//     } catch (err: any) {
//       console.error("Login failed:", err)
//       throw new Error(err?.message || "Login failed")
//     }
//   },

//   // ============================
//   // GET CURRENT USER
//   // ============================
//   async getCurrentUser(): Promise<User | null> {
//     try {
//       const user = await account.get()
//       if (user.email === ADMIN_EMAIL) {
//         return { $id: "admin", name: "Admin", email: ADMIN_EMAIL, isAdmin: true }
//       }

//       let phone: string | undefined
//       let designation: string | undefined
//       try {
//         const userDoc = await databases.listDocuments(
//           DATABASE_ID,
//           USERS_COLLECTION_ID,
//           [`authId=${user.$id}`]
//         )
//         if (userDoc.total > 0) {
//           const profile = userDoc.documents[0]
//           phone = profile.phone
//           designation = profile.designation
//         }
//       } catch {}

//       return {
//         $id: user.$id,
//         name: user.name,
//         email: user.email,
//         isAdmin: false,
//         phone,
//         designation,
//       }
//     } catch {
//       return null
//     }
//   },

//   // ============================
//   // LOGOUT
//   // ============================
//   async logout() {
//     try {
//       await account.deleteSession("current")
//     } catch (err) {
//       console.error("Logout failed:", err)
//     }
//   },

//   // ============================
//   // CHECK AUTH
//   // ============================
//   async isAuthenticated() {
//     try {
//       await account.get()
//       return true
//     } catch {
//       return false
//     }
//   },

//   // ============================
//   // FORGOT PASSWORD
//   // ============================
//   async forgotPassword(email: string, redirectUrl: string) {
//     await account.createRecovery(email, redirectUrl)
//   },

//   // ============================
//   // RESET PASSWORD
//   // ============================
//   async resetPassword(userId: string, secret: string, newPassword: string) {
//     await account.updateRecovery(userId, secret, newPassword, newPassword)
//   },
// }



// lib/auth.ts

import { account, databases, DATABASE_ID, USERS_COLLECTION_ID,teams} from "./appwrite"
import { ID, Query } from "appwrite"

export interface User {
  $id: string
  name: string
  email: string
  isAdmin?: boolean
  phone?: string
  designation?: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  designation?: string
}

// replace with your actual Admin Team ID from Appwrite Console
const ADMIN_TEAM_ID = "68c64d7800074308fe93"

export const authService = {
  // ============================
  // REGISTER USER
  // ============================
  async register(data: RegisterData) {
    try {
      try { await account.deleteSession("current") } catch {}

      const res = await account.create(
        ID.unique(),
        data.email,
        data.password,
        data.name
      )

      await account.createEmailPasswordSession(data.email, data.password)

      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          authId: res.$id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          designation: data.designation,
          isAdmin: false,
        }
      )

      return {
        $id: res.$id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        designation: data.designation,
        isAdmin: false,
      }
    } catch (err: any) {
      console.error("Registration failed:", err)
      throw err
    }
  },

  // ============================
  // LOGIN USER
  // ============================
// async login(email: string, password: string): Promise<User> {
//   try {
//     // 1️⃣ Create session
//     await account.createEmailPasswordSession(email, password);

//     // 2️⃣ Get logged-in user info
//     const user = await account.get();

//     // 3️⃣ Check admin membership
//     const teamMemberships = await teams.listMemberships(ADMIN_TEAM_ID);
//     const isAdmin = teamMemberships.memberships.some(m => m.userId === user.$id);

//     // 4️⃣ Fetch profile from DB
//     const userDoc = await databases.listDocuments(
//       DATABASE_ID,
//       USERS_COLLECTION_ID,
//       [Query.equal("authId", user.$id)]
//     );
//     const profile = userDoc.total > 0 ? userDoc.documents[0] : null;

//     // 5️⃣ Return user object
//     return {
//       $id: user.$id,
//       name: user.name,
//       email: user.email,
//       phone: profile?.phone,
//       designation: profile?.designation,
//       isAdmin,
//     };
//   } catch (err: any) {
//     console.error("Login failed:", err);
//     throw new Error(err?.message || "Login failed");
//   }
// },
async login(email: string, password: string): Promise<User> {
  try {
    // 1️⃣ Clear any existing session
    try { await account.deleteSession("current") } catch {}

    // 2️⃣ Create a new session
    await account.createEmailPasswordSession(email, password)

    // 3️⃣ Get logged-in user info
    const user = await account.get()

    // 4️⃣ Check if user is admin safely
    let isAdmin = false
    try {
      const teamMemberships = await teams.listMemberships(ADMIN_TEAM_ID)
      isAdmin = teamMemberships.memberships.some(m => m.userId === user.$id)
    } catch (err) {
      // If team doesn't exist or user not in team, treat as normal user
      console.warn("Admin team check skipped:", err)
    }

    // 5️⃣ Fetch user profile from database
    let profile: any = null
    try {
      const userDoc = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("authId", user.$id)]
      )
      profile = userDoc.total > 0 ? userDoc.documents[0] : null
    } catch (err) {
      console.warn("User profile not found in DB:", user.email)
    }

    // 6️⃣ Return user object
    return {
      $id: user.$id,
      name: user.name,
      email: user.email,
      phone: profile?.phone,
      designation: profile?.designation,
      isAdmin,
    }

  } catch (err: any) {
    console.error("Login failed:", err)
    throw new Error(err?.message || "Login failed")
  }
},


  // ============================
  // GET CURRENT USER
  // ============================
async getCurrentUser(): Promise<User | null> {
  try {
    const user = await account.get(); // checks Appwrite session
    if (!user) return null;

    let isAdmin = false;
    try {
      const memberships = await teams.listMemberships(ADMIN_TEAM_ID);
      isAdmin = memberships.memberships.some(m => m.userId === user.$id);
    } catch {
      // admin check fails safely
    }

    const userDoc = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("authId", user.$id)]
    );
    const profile = userDoc.total > 0 ? userDoc.documents[0] : null;

    return {
      $id: user.$id,
      name: user.name,
      email: user.email,
      phone: profile?.phone,
      designation: profile?.designation,
      isAdmin,
    };
  } catch {
    return null;
  }
},



  // logout, isAuthenticated, forgotPassword, resetPassword stay the same
  async logout() {
    try {
      await account.deleteSession("current")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  },

  async isAuthenticated() {
    try {
      await account.get()
      return true
    } catch {
      return false
    }
  },

  async forgotPassword(email: string, redirectUrl: string) {
    await account.createRecovery(email, redirectUrl)
  },

  async resetPassword(userId: string, secret: string, newPassword: string) {
    await account.updateRecovery(userId, secret, newPassword, newPassword)
  },
}
