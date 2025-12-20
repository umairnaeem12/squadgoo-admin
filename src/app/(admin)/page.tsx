import type { Metadata } from "next";
import DashboardPageLayout from "@/components/dashboard/DashboardPageLayout";

export const metadata: Metadata = {
  title: "SquadGoo Dashboard",
  description: "Internal admin panel for SquadGoo platform controls and reports",
};

export default function Ecommerce() {
  return <DashboardPageLayout />;
}
