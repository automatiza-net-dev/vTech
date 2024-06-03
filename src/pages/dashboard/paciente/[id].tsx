import React from "react";

import { PacientePage } from "@/presentation";
import { LayoutDashboard } from "@/presentation";

export default function PatientPage() {
  return (
    <LayoutDashboard>
      <PacientePage />
    </LayoutDashboard>
  );
}
