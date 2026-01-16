import type { Metadata } from "next";
import StaffDashboard from "@/components/staff-dashboard/StaffDashboard";

export const metadata: Metadata = {
  title: "Staff Dashboard",
  description: "Role-based staff dashboard focused on today's responsibilities.",
};

export default function StaffDashboardPage() {
  return <StaffDashboard />;
}
