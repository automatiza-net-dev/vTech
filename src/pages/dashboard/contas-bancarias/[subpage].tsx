import SingleCheckingAccount from "@/OLD/components/CheckingAccounts/Single";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function SingleCheckingAccountPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <SingleCheckingAccount />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
