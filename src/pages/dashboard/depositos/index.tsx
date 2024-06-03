import { Deposits } from "@/OLD/components/Deposit";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function DepositsPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <Deposits />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
