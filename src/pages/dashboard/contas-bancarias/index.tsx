import CheckingAccounts from "@/OLD/components/CheckingAccounts";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function CheckingAccountsPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <CheckingAccounts />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
