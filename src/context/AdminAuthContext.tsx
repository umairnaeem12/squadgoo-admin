"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { AdminUser, MenuPermission, ActionPermission } from "@/types/admin-system";

interface AdminAuthContextType {
  currentAdmin: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasMenuPermission: (menu: MenuPermission) => boolean;
  hasActionPermission: (action: ActionPermission) => boolean;
  isSuperAdmin: () => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedAdmin = localStorage.getItem("currentAdmin");
    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      setCurrentAdmin(admin);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get all admin users from localStorage
    const adminsData = localStorage.getItem("adminUsers");
    if (!adminsData) return false;

    const admins: AdminUser[] = JSON.parse(adminsData);
    const admin = admins.find(
      (a) => a.email === email && a.password === password && a.isActive
    );

    if (admin) {
      setCurrentAdmin(admin);
      setIsAuthenticated(true);
      localStorage.setItem("currentAdmin", JSON.stringify(admin));
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentAdmin");
  };

  const hasMenuPermission = (menu: MenuPermission): boolean => {
    if (!currentAdmin) return false;
    if (currentAdmin.role === "super_admin") return true;
    return currentAdmin.menuPermissions.includes(menu);
  };

  const hasActionPermission = (action: ActionPermission): boolean => {
    if (!currentAdmin) return false;
    if (currentAdmin.role === "super_admin") return true;
    return currentAdmin.actionPermissions.includes(action);
  };

  const isSuperAdmin = (): boolean => {
    return currentAdmin?.role === "super_admin";
  };

  return (
    <AdminAuthContext.Provider
      value={{
        currentAdmin,
        login,
        logout,
        isAuthenticated,
        hasMenuPermission,
        hasActionPermission,
        isSuperAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
