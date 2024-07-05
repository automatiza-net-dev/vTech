import { DashboardAdmin } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function DashboardFranchisorPage() {
  return (
    <PrivatePageAdmin  roleUser="admin">
      <DashboardAdmin />
    </PrivatePageAdmin>
  );
}
