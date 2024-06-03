import MetasManagement from "@/OLD/components/Metas";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function MetasManagementPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <MetasManagement />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
