import { PageWrapper } from "infinity-forge";

import { PermissionItem } from "@/presentation";
import { DreGroupsTable } from "./components";

export function DreGroups() {
  return (
    <PageWrapper title="DRE - Agrupamentos">
      <DreGroupsTable />
    </PageWrapper>
  );
}
