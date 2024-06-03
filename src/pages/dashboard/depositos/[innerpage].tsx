import { ShowDeposit } from "@/OLD/components/Deposit/show";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function ShowDepositPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <ShowDeposit />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
