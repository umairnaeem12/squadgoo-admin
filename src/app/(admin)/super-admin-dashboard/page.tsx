import type { Metadata } from "next";
import DashboardPageLayout from "@/components/dashboard/DashboardPageLayout";

export const metadata: Metadata = {
  title: "Super Admin Dashboard",
  description: "Platform-wide KPIs and controls for super admins.",
};

export default function SuperAdminDashboardPage() {
  return <DashboardPageLayout />;
}
