import React from "react";
import { AccessControlsPage, PrivatePageFranchisor } from "@/presentation";

export default function ListUsuarioPage() {
  return (
    <PrivatePageFranchisor>
      <AccessControlsPage />
    </PrivatePageFranchisor>
  );
}
