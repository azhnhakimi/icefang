// app/(protected)/dashboard/page.tsx
import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Get a quick overview of your activities",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
