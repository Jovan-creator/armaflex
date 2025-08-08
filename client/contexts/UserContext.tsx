import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'receptionist' | 'housekeeping' | 'maintenance' | 'accountant' | 'restaurant' | 'support' | 'guest';

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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@armaflex.com',
    role: 'admin',
    avatar: '/placeholder.svg',
    department: 'Management',
  });

  const switchRole = (role: UserRole) => {
    if (user) {
      const roleData = {
        admin: { name: 'John Doe', department: 'Management', email: 'john.doe@armaflex.com' },
        receptionist: { name: 'Sarah Johnson', department: 'Front Desk', email: 'sarah.j@armaflex.com' },
        housekeeping: { name: 'Maria Garcia', department: 'Housekeeping', email: 'maria.g@armaflex.com' },
        maintenance: { name: 'Robert Wilson', department: 'Maintenance', email: 'robert.w@armaflex.com' },
        accountant: { name: 'Emily Davis', department: 'Finance', email: 'emily.d@armaflex.com' },
        restaurant: { name: 'Michael Chen', department: 'Restaurant', email: 'michael.c@armaflex.com' },
        support: { name: 'Lisa Brown', department: 'IT Support', email: 'lisa.b@armaflex.com' },
        guest: { name: 'Guest User', department: 'Public', email: 'guest@example.com' },
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

  const logout = () => {
    setUser(null);
  };

  const isLoggedIn = user !== null;

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      switchRole,
      isLoggedIn,
      logout,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
