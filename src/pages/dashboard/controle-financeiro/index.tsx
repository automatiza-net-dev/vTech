import FinancialStatement from "@/OLD/components/FinancialStatement";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function FinancialStatementPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <FinancialStatement />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
