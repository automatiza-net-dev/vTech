import FinancialStatement from "@/OLD/components/FinancialStatement";
import { LayoutDashboard } from "@/presentation";
import { PrivatePage } from "infinity-forge";

export default function FinancialStatementPage() {
  return (
    <LayoutDashboard>
      <FinancialStatement />
    </LayoutDashboard>
  );
}
