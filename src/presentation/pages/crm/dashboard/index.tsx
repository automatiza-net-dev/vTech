import { PermissionItem,  DashboardPage } from "@/presentation";

export const CrmDashboardComponent = () => {
  return (
    <PermissionItem hash={"ORC02"}>
      <DashboardPage type="crm" />
    </PermissionItem>
  );
};
