import CreateBankingTransaction from "@/OLD/components/Banking/Create";
import { LayoutDashboard } from "@/presentation";
import { PrivatePage } from "infinity-forge";

export default function CreateBankingTransactionPage() {
  return (
    <LayoutDashboard>
      <CreateBankingTransaction />
    </LayoutDashboard>
  );
}
