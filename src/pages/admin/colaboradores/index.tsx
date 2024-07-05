import React from "react";

import { ListUserPage } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function ListUsuarioPage() {
  return (
    <PrivatePageAdmin roleUser="admin">
      <ListUserPage />
    </PrivatePageAdmin>
  );
}
