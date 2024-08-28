import { DashboardPage, LayoutDashboard } from "@/presentation";
import { useWindow } from "infinity-forge";
import { useEffect } from "react";

export default function Dashboard() {
  return (
    <LayoutDashboard>
      <DashboardPage />
    </LayoutDashboard>
  );
}
