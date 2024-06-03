import React from "react";
import { PrivatePageAdmin } from "infinity-forge";
import { LayoutDashboard } from "@/presentation";

import DashboardPage from "@/OLD/components/Dashboard";

export default function Login() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <DashboardPage />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}