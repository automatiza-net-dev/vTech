import React from "react";
import { SchedulingPage, LayoutDashboard } from "@/presentation";
import { PrivatePage } from "infinity-forge";

export default function AgendaPage() {
  return (
    <LayoutDashboard>
      <SchedulingPage />
    </LayoutDashboard>
  );
}
