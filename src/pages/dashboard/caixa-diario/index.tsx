import DailyCashier from "@/OLD/components/DailyCashier";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function DailyCashierPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <DailyCashier />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
