import React from "react";
import { SchedulingPage } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function AgendaPage() {
  return (
    <PrivatePageAdmin>
      <SchedulingPage />
    </PrivatePageAdmin>
  );
}
