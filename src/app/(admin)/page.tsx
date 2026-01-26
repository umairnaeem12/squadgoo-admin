import type { Metadata } from "next";
import StaffDashboard from "@/components/staff-dashboard/StaffDashboard";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";

export const metadata: Metadata = {
  title: "Staff Dashboard",
  description: "Role-based staff dashboard focused on today's responsibilities.",
};

export default function StaffDashboardPage() {
  return (
    <ProtectedAdminRoute>
      <StaffDashboard />
    </ProtectedAdminRoute>
  );
}
