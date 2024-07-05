import React from "react";
import { AccessControlsPage } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function ListUsuarioPage() {
  return (
    <PrivatePageAdmin roleUser="admin">
      <AccessControlsPage />
    </PrivatePageAdmin>
  );
}
