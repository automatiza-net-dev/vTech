import { ShowDepositMovement } from "@/OLD/components/DepositMovement/show";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function ShowDepositMovementPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <ShowDepositMovement />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
