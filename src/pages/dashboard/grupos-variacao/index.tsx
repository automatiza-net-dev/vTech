import VariationsGroups from "@/OLD/components/VariationGroup";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function VarationsGroupsPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <VariationsGroups />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
