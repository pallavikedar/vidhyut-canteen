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























// import { account, databases, DATABASE_ID, USERS_COLLECTION_ID,teams} from "./appwrite"
// import { ID, Query } from "appwrite"

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

// // replace with your actual Admin Team ID from Appwrite Console
// const ADMIN_TEAM_ID = "68c64d7800074308fe93"

// export const authService = {
//   // ============================
//   // REGISTER USER
//   // ============================
//   async register(data: RegisterData) {
//     try {
//       try { await account.deleteSession("current") } catch {}

//       const res = await account.create(
//         ID.unique(),
//         data.email,
//         data.password,
//         data.name
//       )

//       await account.createEmailPasswordSession(data.email, data.password)

//       await databases.createDocument(
//         DATABASE_ID,
//         USERS_COLLECTION_ID,
//         ID.unique(),
//         {
//           authId: res.$id,
//           name: data.name,
//           email: data.email,
//           phone: data.phone,
//           designation: data.designation,
//           isAdmin: false,
//         }
//       )

//       return {
//         $id: res.$id,
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         designation: data.designation,
//         isAdmin: false,
//       }
//     } catch (err: any) {
//       console.error("Registration failed:", err)
//       throw err
//     }
//   },

//   // ============================
//   // LOGIN USER
//   // ============================
// // async login(email: string, password: string): Promise<User> {
// //   try {
// //     // 1️⃣ Create session
// //     await account.createEmailPasswordSession(email, password);

// //     // 2️⃣ Get logged-in user info
// //     const user = await account.get();

// //     // 3️⃣ Check admin membership
// //     const teamMemberships = await teams.listMemberships(ADMIN_TEAM_ID);
// //     const isAdmin = teamMemberships.memberships.some(m => m.userId === user.$id);

// //     // 4️⃣ Fetch profile from DB
// //     const userDoc = await databases.listDocuments(
// //       DATABASE_ID,
// //       USERS_COLLECTION_ID,
// //       [Query.equal("authId", user.$id)]
// //     );
// //     const profile = userDoc.total > 0 ? userDoc.documents[0] : null;

// //     // 5️⃣ Return user object
// //     return {
// //       $id: user.$id,
// //       name: user.name,
// //       email: user.email,
// //       phone: profile?.phone,
// //       designation: profile?.designation,
// //       isAdmin,
// //     };
// //   } catch (err: any) {
// //     console.error("Login failed:", err);
// //     throw new Error(err?.message || "Login failed");
// //   }
// // },
// async login(email: string, password: string): Promise<User> {
//   try {
//     // 1️⃣ Clear any existing session
//     try { await account.deleteSession("current") } catch {}

//     // 2️⃣ Create a new session
//     await account.createEmailPasswordSession(email, password)

//     // 3️⃣ Get logged-in user info
//     const user = await account.get()

//     // 4️⃣ Check if user is admin safely
//     let isAdmin = false
//     try {
//       const teamMemberships = await teams.listMemberships(ADMIN_TEAM_ID)
//       isAdmin = teamMemberships.memberships.some(m => m.userId === user.$id)
//     } catch (err) {
//       // If team doesn't exist or user not in team, treat as normal user
//       console.warn("Admin team check skipped:", err)
//     }

//     // 5️⃣ Fetch user profile from database
//     let profile: any = null
//     try {
//       const userDoc = await databases.listDocuments(
//         DATABASE_ID,
//         USERS_COLLECTION_ID,
//         [Query.equal("authId", user.$id)]
//       )
//       profile = userDoc.total > 0 ? userDoc.documents[0] : null
//     } catch (err) {
//       console.warn("User profile not found in DB:", user.email)
//     }

//     // 6️⃣ Return user object
//     return {
//       $id: user.$id,
//       name: user.name,
//       email: user.email,
//       phone: profile?.phone,
//       designation: profile?.designation,
//       isAdmin,
//     }

//   } catch (err: any) {
//     console.error("Login failed:", err)
//     throw new Error(err?.message || "Login failed")
//   }
// },


//   // ============================
//   // GET CURRENT USER
//   // ============================
// async getCurrentUser(): Promise<User | null> {
//   try {
//     const user = await account.get(); // checks Appwrite session
//     if (!user) return null;

//     let isAdmin = false;
//     try {
//       const memberships = await teams.listMemberships(ADMIN_TEAM_ID);
//       isAdmin = memberships.memberships.some(m => m.userId === user.$id);
//     } catch {
//       // admin check fails safely
//     }

//     const userDoc = await databases.listDocuments(
//       DATABASE_ID,
//       USERS_COLLECTION_ID,
//       [Query.equal("authId", user.$id)]
//     );
//     const profile = userDoc.total > 0 ? userDoc.documents[0] : null;

//     return {
//       $id: user.$id,
//       name: user.name,
//       email: user.email,
//       phone: profile?.phone,
//       designation: profile?.designation,
//       isAdmin,
//     };
//   } catch {
//     return null;
//   }
// },



//   // logout, isAuthenticated, forgotPassword, resetPassword stay the same
//   async logout() {
//     try {
//       await account.deleteSession("current")
//     } catch (err) {
//       console.error("Logout failed:", err)
//     }
//   },

//   async isAuthenticated() {
//     try {
//       await account.get()
//       return true
//     } catch {
//       return false
//     }
//   },

//   async forgotPassword(email: string, redirectUrl: string) {
//     await account.createRecovery(email, redirectUrl)
//   },

//   async resetPassword(userId: string, secret: string, newPassword: string) {
//     await account.updateRecovery(userId, secret, newPassword, newPassword)
//   },
// }


import { account, databases, DATABASE_ID, USERS_COLLECTION_ID, teams,ADMIN_TEAM_ID } from "./appwrite"
import { ID, Query } from "appwrite";
export const ADMIN_PHONE = "8055808899"; // optional if you want phone check
export const ADMIN_EMAIL = "admin@vidyutcanteen.com";
export const ADMIN_PASSWORD = "Admin@123";



export interface User {
  $id: string
  name: string
  // email: string
  isAdmin?: boolean
  phone?: string
  // designation?: string
}

export interface RegisterData {
  name: string
  // email: string
  password: string
  phone?: string
  // designation?: string
}

// replace with your actual Admin Team ID from Appwrite Console
// const ADMIN_TEAM_ID = "68c64d7800074308fe93"

export const authService = {
  // ============================
  // REGISTER USER
  // ============================
  // async register(data: RegisterData) {
  //   try {
  //     // ✅ DO NOT delete session here, just create account
  //     const res = await account.create(
  //       ID.unique(),
  //       data.email,
  //       data.password,
  //       data.name
  //     )

  //     // ✅ Log them in immediately
  //     await account.createEmailPasswordSession(data.email, data.password)

  //     // ✅ Store profile in database
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


  // ============================
// REGISTER USER (without email and designation)
// ============================
async register(data: RegisterData) {
  try {
    // ✅ Create account in Appwrite
    // Since email is removed, we'll use a dummy email (Appwrite requires email)
    // You can generate a unique email using phone or name
    const dummyEmail = `${data.phone || data.name}@vidyut.local`

    const res = await account.create(
      ID.unique(),
      dummyEmail, // required by Appwrite
      data.password,
      data.name
    )

    // ✅ Log them in immediately
    await account.createEmailPasswordSession(dummyEmail, data.password)

    // ✅ Store profile in database
    await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      {
        authId: res.$id,
        name: data.name,
        phone: data.phone,
        isAdmin: false,
      }
    )

    return {
      $id: res.$id,
      name: data.name,
      phone: data.phone,
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
  // async login(phone: string, password: string): Promise<User> {
  //   try {
  //     // ✅ Create a new session
  //     await account.createEmailPasswordSession(phone, password)

  //     // ✅ Get logged-in user info
  //     const user = await account.get()

  //     // ✅ Check if user is admin
  //     let isAdmin = false
  //     try {
  //       const teamMemberships = await teams.listMemberships(ADMIN_TEAM_ID)
  //       isAdmin = teamMemberships.memberships.some(m => m.userId === user.$id)
  //     } catch (err) {
  //       console.warn("Admin team check skipped:", err)
  //     }

  //     // ✅ Fetch profile from DB
  //     let profile: any = null
  //     try {
  //       const userDoc = await databases.listDocuments(
  //         DATABASE_ID,
  //         USERS_COLLECTION_ID,
  //         [Query.equal("authId", user.$id)]
  //       )
  //       profile = userDoc.total > 0 ? userDoc.documents[0] : null
  //     } catch {
  //       console.warn("User profile not found in DB:", user.email)
  //     }

  //     return {
  //       $id: user.$id,
  //       name: user.name,
  //       // email: user.email,
  //       phone: profile?.phone,
  //       // designation: profile?.designation,
  //       isAdmin,
  //     }
  //   } catch (err: any) {
  //     console.error("Login failed:", err)
  //     throw new Error(err?.message || "Login failed")
  //   }
  // },




// async  login(phone: string, password: string): Promise<User> {
//   try {
//     // Find user by phone
//     const userDoc = await databases.listDocuments(
//       DATABASE_ID,
//       USERS_COLLECTION_ID,
//       [Query.equal("phone", phone)]
//     );

//     if (userDoc.total === 0) throw new Error("User not found");

//     const userRecord = userDoc.documents[0];

//     // Use email from database
//     await account.createEmailPasswordSession(userRecord.email, password);
//     const user = await account.get();

//     return {
//       $id: user.$id,
//       name: user.name,
//       phone: userRecord.phone,
//       isAdmin: userRecord.isAdmin || false,
//     };
//   } catch (err: any) {
//     console.error("Login failed:", err);
//     throw new Error(err?.message || "Login failed");
//   }
// },



// async login(phone: string, password: string): Promise<User> {
//   try {
//     // Convert phone to dummy email used during registration
//     const dummyEmail = `${phone}@vidyut.local`;

//     // ✅ Create a new session using dummy email
//     await account.createEmailPasswordSession(dummyEmail, password);

//     // ✅ Get logged-in user info
//     const user = await account.get();

//     // ✅ Fetch profile from DB to get isAdmin dynamically
//     let profile: any = null;
//     try {
//       const userDoc = await databases.listDocuments(
//         DATABASE_ID,
//         USERS_COLLECTION_ID,
//         [Query.equal("authId", user.$id)]
//       );
//       profile = userDoc.total > 0 ? userDoc.documents[0] : null;
//     } catch {
//       console.warn("User profile not found in DB:", dummyEmail);
//     }

//     return {
//       $id: user.$id,
//       name: user.name,
//       phone: profile?.phone,
//       isAdmin: profile?.isAdmin || false, // Dynamic admin check
//     };
//   } catch (err: any) {
//     console.error("Login failed:", err);
//     throw new Error(err?.message || "Login failed");
//   }
// },


// async  login(identifier: string, password: string): Promise<any> {
//   try {
//     let loginEmail = "";
//     let loginPassword = password;
//     let isAdmin = false;
//     let profile: any = null;

//     // ✅ Check if admin (by email)
//     if (identifier === ADMIN_EMAIL) {
//       loginEmail = ADMIN_EMAIL;
//       loginPassword = ADMIN_PASSWORD;
//       isAdmin = true;
//     } else {
//       // ✅ Normal user: identifier is phone
//       const userDoc = await databases.listDocuments(
//         DATABASE_ID,
//         USERS_COLLECTION_ID,
//         [Query.equal("phone", identifier)]
//       );
//       if (userDoc.total === 0) throw new Error("User not found");

//       const userRecord = userDoc.documents[0];
//       loginEmail = userRecord.email; // dummy email stored in Appwrite
//       profile = userRecord;
//     }

//     // ✅ Create session
//     await account.createEmailPasswordSession(loginEmail, loginPassword);

//     // ✅ Get logged-in user info
//     const user = await account.get();

//     // ✅ For non-admins, check if they belong to admin team (optional)
//     if (!isAdmin) {
//       try {
//         const teamMemberships = await teams.listMemberships(ADMIN_TEAM_ID);
//         isAdmin = teamMemberships.memberships.some((m) => m.userId === user.$id);
//       } catch {
//         console.warn("Admin team check skipped");
//       }
//     }

//     return {
//       $id: user.$id,
//       name: user.name,
//       email: profile?.email || loginEmail,
//       phone: profile?.phone || null,
//       isAdmin,
//     };
//   } catch (err: any) {
//     console.error("Login failed:", err);
//     throw new Error(err?.message || "Login failed");
//   }
// },














// async login(identifier: string, password: string): Promise<any> {
//   try {
//     let loginEmail = identifier;
//     let loginPassword = password;
//     let isAdmin = false;

//     // Admin login
//     if (identifier === ADMIN_PHONE) {
//       loginEmail = ADMIN_EMAIL;
//       loginPassword = ADMIN_PASSWORD;
//       isAdmin = true;
//     }

//     // User login → convert phone to dummy email
//     if (!isAdmin) {
//       loginEmail = `${identifier}@vidyut.local`;
//     }

//     // Create session
//     await account.createEmailPasswordSession(loginEmail, loginPassword);

//     // Get user info
//     const user = await account.get();

//     // Fetch profile from DB (optional, ensure permissions allow this)
//     let profile: any = null;
//     if (!isAdmin) {
//       const userDoc = await databases.listDocuments(
//         DATABASE_ID,
//         USERS_COLLECTION_ID,
//         [Query.equal("authId", user.$id)]
//       );
//       profile = userDoc.total > 0 ? userDoc.documents[0] : null;
//     }

//     return {
//       $id: user.$id,
//       name: user.name,
//       phone: isAdmin ? ADMIN_PHONE : profile?.phone,
//       isAdmin,
//     };
//   } catch (err: any) {
//     console.error("Login failed:", err);
//     throw new Error(err?.message || "Login failed");
//   }
// },












async  login(identifier: string, password: string) {
  try {
    let loginEmail = identifier;
    let isAdmin = false;

    // ✅ Check if admin
    if (identifier === ADMIN_EMAIL) {
      loginEmail = ADMIN_EMAIL;
      password = ADMIN_PASSWORD;
      isAdmin = true;
    } else {
      // ✅ For normal users, convert phone to dummy email
      loginEmail = `${identifier}@vidyut.local`;
    }

    // ✅ Create Appwrite session
    await account.createEmailPasswordSession(loginEmail, password);

    // ✅ Get logged-in user info
    const user = await account.get();

    // ✅ Fetch user profile for normal users
    let profile: any = null;
    if (!isAdmin) {
      const userDoc = await databases.listDocuments(
        DATABASE_ID!,
        USERS_COLLECTION_ID!,
       
        [Query.equal("authId", user.$id)]
      );
      profile = userDoc.total > 0 ? userDoc.documents[0] : null;
    }

    return {
      $id: user.$id,
      name: user.name,
      phone: isAdmin ? null : profile?.phone,
      isAdmin,
    };
  } catch (err: any) {
    console.error("Login failed:", err);
    throw new Error(err?.message || "Login failed");
  }
},



// async login(phone: string, password: string): Promise<any> {
//   try {
//     let loginEmail = phone;
//     let loginPassword = password;

//     // ✅ Map admin phone to internal registered email
//     if (phone === ADMIN_PHONE) {
//       loginEmail = ADMIN_EMAIL;
//       loginPassword = ADMIN_PASSWORD;
//     } else {
//       // ✅ Normal users: fetch email from database
//       const userDoc = await databases.listDocuments(
//         DATABASE_ID,
//         USERS_COLLECTION_ID,
//         [Query.equal("phone", phone)]
//       );

//       if (userDoc.total === 0) throw new Error("User not found");

//       const userRecord = userDoc.documents[0];
//       loginEmail = userRecord.email;
//     }

//     // ✅ Create Appwrite session
//     await account.createEmailPasswordSession(loginEmail, loginPassword);

//     // ✅ Get logged-in user info
//     const user = await account.get();

//     // ✅ Determine if user is admin
//     let isAdmin = false;
//     if (phone === ADMIN_PHONE) {
//       isAdmin = true;
//     } else {
//       try {
//         const teamMemberships = await teams.listMemberships(ADMIN_TEAM_ID);
//         isAdmin = teamMemberships.memberships.some(m => m.userId === user.$id);
//       } catch {
//         console.warn("Admin team check skipped");
//       }
//     }

//     // ✅ Fetch profile for normal users
//     let profile: any = null;
//     if (phone !== ADMIN_PHONE) {
//       try {
//         const userDoc = await databases.listDocuments(
//           DATABASE_ID,
//           USERS_COLLECTION_ID,
//           [Query.equal("authId", user.$id)]
//         );
//         profile = userDoc.total > 0 ? userDoc.documents[0] : null;
//       } catch {
//         console.warn("User profile not found in DB:", loginEmail);
//       }
//     }

//     return {
//       $id: user.$id,
//       name: user.name,
//       phone: profile?.phone || phone,
//       isAdmin,
//     };

//   } catch (err: any) {
//     console.error("Login failed:", err);
//     throw new Error(err?.message || "Login failed");
//   }
// },


  // ============================
  // GET CURRENT USER
  // ============================
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await account.get() // checks Appwrite session
      if (!user) return null

      let isAdmin = false
      try {
        const memberships = await teams.listMemberships(ADMIN_TEAM_ID)
        isAdmin = memberships.memberships.some(m => m.userId === user.$id)
      } catch {
        // ignore if no admin membership
      }

      const userDoc = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("authId", user.$id)]
      )
      const profile = userDoc.total > 0 ? userDoc.documents[0] : null

      return {
        $id: user.$id,
        name: user.name,
        // email: user.email,
        phone: profile?.phone,
        // designation: profile?.designation,
        isAdmin,
      }
    } catch (err) {
      console.warn("No active session:", err)
      return null
    }
  },

  // ============================
  // LOGOUT
  // ============================
  async logout() {
    try {
      await account.deleteSession("current")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  },

  // ============================
  // IS AUTHENTICATED
  // ============================
  async isAuthenticated() {
    try {
      await account.get()
      return true
    } catch {
      return false
    }
  },

  // ============================
  // PASSWORD RESET
  // ============================
  async forgotPassword(email: string, redirectUrl: string) {
    await account.createRecovery(email, redirectUrl)
  },

  async resetPassword(userId: string, secret: string, newPassword: string) {
    await account.updateRecovery(userId, secret, newPassword, newPassword)
  },
}
