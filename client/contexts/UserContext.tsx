import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole =
  | "admin"
  | "receptionist"
  | "housekeeping"
  | "maintenance"
  | "accountant"
  | "restaurant"
  | "support"
  | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Define role permissions
const rolePermissions = {
  admin: ["*"], // Full access
  receptionist: [
    "bookings",
    "guests",
    "rooms",
    "payments",
    "checkin",
    "checkout",
  ],
  housekeeping: ["housekeeping", "rooms_status", "maintenance_requests"],
  maintenance: ["maintenance", "repairs", "inventory", "room_maintenance"],
  accountant: ["billing", "payments", "reports", "refunds", "financial_data"],
  restaurant: [
    "restaurant",
    "orders",
    "menu",
    "table_reservations",
    "food_billing",
  ],
  support: ["support", "tickets", "system_logs", "user_assistance"],
  guest: ["public_pages", "booking_requests", "reviews"],
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Initialize user from stored data
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          id: parsedUser.id.toString(),
          email: parsedUser.email,
          name: parsedUser.name,
          role: parsedUser.role,
          department: parsedUser.department
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
  }, []);

  const switchRole = (role: UserRole) => {
    if (user) {
      const roleData = {
        admin: {
          name: "Jovan K",
          department: "Management",
          email: "jovan.k@armaflex.com",
        },
        receptionist: {
          name: "Sarah Johnson",
          department: "Front Desk",
          email: "sarah.j@armaflex.com",
        },
        housekeeping: {
          name: "Maria Garcia",
          department: "Housekeeping",
          email: "maria.g@armaflex.com",
        },
        maintenance: {
          name: "Robert Wilson",
          department: "Maintenance",
          email: "robert.w@armaflex.com",
        },
        accountant: {
          name: "Emily Davis",
          department: "Finance",
          email: "emily.d@armaflex.com",
        },
        restaurant: {
          name: "Michael Chen",
          department: "Restaurant",
          email: "michael.c@armaflex.com",
        },
        support: {
          name: "Lisa Brown",
          department: "IT Support",
          email: "lisa.b@armaflex.com",
        },
        guest: {
          name: "Guest User",
          department: "Public",
          email: "guest@example.com",
        },
      };

      const data = roleData[role];
      setUser({
        ...user,
        role,
        name: data.name,
        department: data.department,
        email: data.email,
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/hotel/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      // Store token
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));

      // Set user in context
      setUser({
        id: data.user.id.toString(),
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        department: data.user.department,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    // Clear any stored authentication data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("hotel_auth_token");
    sessionStorage.removeItem("hotel_user_session");
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;

    const userPermissions = rolePermissions[user.role] || [];

    // Admin has full access
    if (userPermissions.includes("*")) return true;

    // Check specific permission
    return userPermissions.includes(permission);
  };

  const isLoggedIn = user !== null;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        isLoggedIn,
        logout,
        hasPermission,
        login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    console.error('UserContext is undefined. Make sure the component is wrapped in UserProvider.');
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
