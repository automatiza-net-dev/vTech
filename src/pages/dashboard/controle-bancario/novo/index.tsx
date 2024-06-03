import CreateBankingTransaction from "@/OLD/components/Banking/Create";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function CreateBankingTransactionPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <CreateBankingTransaction />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
