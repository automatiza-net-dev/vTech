import Cashier from "@/OLD/components/Cashier";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function CashierPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <Cashier />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
