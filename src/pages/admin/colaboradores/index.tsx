import React from "react";

import { ListUserPage, PrivatePageFranchisor } from "@/presentation";

export default function ListUsuarioPage() {
  return (
    <PrivatePageFranchisor>
      <ListUserPage />
    </PrivatePageFranchisor>
  );
}
