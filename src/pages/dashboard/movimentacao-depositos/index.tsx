import { DepositMovements } from "@/OLD/components/DepositMovement";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function DepositMovementsPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <DepositMovements />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
