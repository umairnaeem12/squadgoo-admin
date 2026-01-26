"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, currentAdmin } = useAdminAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    // Redirect Super Admin to their own dashboard
    if (currentAdmin?.role === "super_admin") {
      router.push("/admin/super-admin-dashboard");
      return;
    }
  }, [isAuthenticated, currentAdmin, router]);

  // Don't render until we've checked authentication
  if (!isAuthenticated || currentAdmin?.role === "super_admin") {
    return null;
  }

  return <>{children}</>;
}
